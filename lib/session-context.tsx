'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  OfficerRole,
  AuditEvent,
  ValidationRule,
  ApplicationRecord,
  IssuerVerificationEvent,
  OfficerActionType,
} from './types';
import { mockDatabase } from './mock-data';
import { calculateEventHash } from './audit';
import { queryIssuerService, routeToManualConfirmation } from './verification-engine';

interface SessionContextType {
  // Role
  currentRole: OfficerRole;
  setCurrentRole: (role: OfficerRole) => void;

  // Verifiable Cryptographic Audit Chain
  auditEvents: AuditEvent[];
  addAuditEvent: (eventData: {
    action: string;
    applicationId: string;
    details: string;
    actorRole?: OfficerRole;
    actorName?: string;
    ruleIds?: string[];
    sourceReferences?: string[];
  }) => Promise<AuditEvent>;
  simulateTamper: () => void;
  resetAuditChain: () => void;

  // Rules Configuration & Dry-run
  rules: ValidationRule[];
  updateRules: (newRules: ValidationRule[]) => void;
  resetRules: () => void;
  isRulesModified: boolean;

  // Applications & Live Officer Decisions
  applications: ApplicationRecord[];
  getApplication: (idOrRef: string) => ApplicationRecord | undefined;
  performOfficerAction: (params: {
    applicationId: string;
    findingId?: string;
    actionType: OfficerActionType;
    reason?: string;
    note?: string;
  }) => Promise<void>;

  // Issuer Verification Events
  verificationEvents: IssuerVerificationEvent[];
  retryIssuerVerification: (event: IssuerVerificationEvent) => Promise<IssuerVerificationEvent>;
  routeIssuerToManual: (event: IssuerVerificationEvent, reason?: string) => Promise<IssuerVerificationEvent>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<OfficerRole>('Officer');
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([...mockDatabase.auditEvents]);
  const [rules, setRules] = useState<ValidationRule[]>([...mockDatabase.rules]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([...mockDatabase.applications]);
  const [verificationEvents, setVerificationEvents] = useState<IssuerVerificationEvent[]>(() => {
    return mockDatabase.applications.flatMap((app) => app.verificationEvents);
  });

  const isRulesModified = JSON.stringify(rules) !== JSON.stringify(mockDatabase.rules);

  // Append audit event with hash chaining
  const addAuditEvent = useCallback(
    async (eventData: {
      action: string;
      applicationId: string;
      details: string;
      actorRole?: OfficerRole;
      actorName?: string;
      ruleIds?: string[];
      sourceReferences?: string[];
    }): Promise<AuditEvent> => {
      const role = eventData.actorRole || currentRole;
      const actorName = eventData.actorName || (role === 'Administrator' ? 'System Administrator' : role === 'Reviewer' ? 'Senior Scrutiny Reviewer' : 'Authorized AICTE Officer');

      let createdEvent: AuditEvent | null = null;

      setAuditEvents((prevChain) => {
        const lastEvent = prevChain[prevChain.length - 1];
        const previousHash = lastEvent
          ? lastEvent.eventHash
          : '0000000000000000000000000000000000000000000000000000000000000000';

        const newId = `AUDIT-${String(prevChain.length + 1).padStart(4, '0')}`;
        const partialEvent: Omit<AuditEvent, 'eventHash'> = {
          id: newId,
          timestamp: new Date().toISOString(),
          actorRole: role,
          actorName,
          action: eventData.action,
          applicationId: eventData.applicationId,
          details: eventData.details,
          ruleIds: eventData.ruleIds || [],
          sourceReferences: eventData.sourceReferences || [],
          previousHash,
        };

        // Note: For deterministic immediate state update, we compute sync or set placeholder
        createdEvent = {
          ...partialEvent,
          eventHash: '', // populated below
        };
        return [...prevChain, createdEvent];
      });

      // Compute actual SHA-256 hash
      if (createdEvent) {
        const computedHash = await calculateEventHash(createdEvent);
        (createdEvent as AuditEvent).eventHash = computedHash;
        setAuditEvents((prev) =>
          prev.map((e) => (e.id === (createdEvent as AuditEvent).id ? { ...e, eventHash: computedHash } : e))
        );
        return createdEvent as AuditEvent;
      }

      throw new Error('Failed to create audit event');
    },
    [currentRole]
  );

  const simulateTamper = useCallback(() => {
    setAuditEvents((prev) => {
      if (prev.length > 2) {
        const tampered = [...prev];
        tampered[2] = {
          ...tampered[2],
          details: 'TAMPERED IN DEMO: Record modified without sequential cryptographic re-signing.',
        };
        return tampered;
      }
      return prev;
    });
  }, []);

  const resetAuditChain = useCallback(() => {
    setAuditEvents([...mockDatabase.auditEvents]);
  }, []);

  const updateRules = useCallback(
    (newRules: ValidationRule[]) => {
      setRules(newRules);
      addAuditEvent({
        action: 'APPLY_SESSION_RULES',
        applicationId: 'SYSTEM-GLOBAL',
        details: 'Administrator applied modified regulatory rule thresholds to current session state.',
      });
    },
    [addAuditEvent]
  );

  const resetRules = useCallback(() => {
    setRules([...mockDatabase.rules]);
    addAuditEvent({
      action: 'RESET_RULES_DEFAULT',
      applicationId: 'SYSTEM-GLOBAL',
      details: 'Administrator reset validation rule configuration to canonical baseline.',
    });
  }, [addAuditEvent]);

  const getApplication = useCallback(
    (idOrRef: string) => {
      return applications.find(
        (a) => a.id === idOrRef || a.referenceNumber.toLowerCase() === idOrRef.toLowerCase()
      );
    },
    [applications]
  );

  // Perform officer action: acknowledge, dismiss, clarification, escalate
  // NO APPROVE OR REJECT PERMITTED!
  const performOfficerAction = useCallback(
    async (params: {
      applicationId: string;
      findingId?: string;
      actionType: OfficerActionType;
      reason?: string;
      note?: string;
    }) => {
      const { applicationId, findingId, actionType, reason, note } = params;

      setApplications((prevApps) =>
        prevApps.map((app) => {
          if (app.id !== applicationId) return app;

          let updatedFindings = [...app.findings];
          let updatedStatus = app.status;

          if (findingId) {
            updatedFindings = updatedFindings.map((f) => {
              if (f.id !== findingId) return f;
              if (actionType === 'dismiss') {
                return { ...f, status: 'dismissed' as const, dismissReason: reason };
              }
              if (actionType === 'acknowledge') {
                return { ...f, status: 'acknowledged' as const, officerNote: note };
              }
              if (actionType === 'clarification') {
                return { ...f, status: 'clarification_requested' as const, officerNote: reason || note };
              }
              return f;
            });
          }

          if (actionType === 'escalate') {
            updatedStatus = 'Escalated';
          } else if (actionType === 'clarification') {
            updatedStatus = 'Clarification requested';
          }

          const actionRecord = {
            id: `ACT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            officerRole: currentRole,
            officerName: currentRole === 'Administrator' ? 'System Administrator' : currentRole === 'Reviewer' ? 'Senior Scrutiny Reviewer' : 'Authorized AICTE Officer',
            actionType,
            targetId: findingId || applicationId,
            targetType: (findingId ? 'finding' : 'application') as 'finding' | 'application',
            reason,
            note,
          };

          return {
            ...app,
            findings: updatedFindings,
            status: updatedStatus,
            actions: [...(app.actions || []), actionRecord],
          };
        })
      );

      // Audit the officer action
      const actionLabels: Record<OfficerActionType, string> = {
        acknowledge: 'OFFICER_ACKNOWLEDGE',
        dismiss: 'OFFICER_DISMISS_WITH_REASON',
        clarification: 'OFFICER_REQUEST_CLARIFICATION',
        escalate: 'OFFICER_ESCALATE_CASE',
      };

      await addAuditEvent({
        action: actionLabels[actionType],
        applicationId,
        details: `${currentRole} executed '${actionType}' on ${findingId ? `finding ${findingId}` : `case ${applicationId}`}.${reason ? ` Reason: ${reason}` : ''}${note ? ` Note: ${note}` : ''}`,
        ruleIds: findingId ? [findingId] : [],
      });
    },
    [currentRole, addAuditEvent]
  );

  // Retry issuer verification query
  const retryIssuerVerification = useCallback(
    async (event: IssuerVerificationEvent): Promise<IssuerVerificationEvent> => {
      const result = queryIssuerService({
        documentId: event.documentId,
        documentName: event.documentName,
        issuerName: event.source,
        referenceNumber: event.referenceNumber,
        currentStatus: event.status,
        retryCount: event.retryCount,
      });

      const updatedEvent: IssuerVerificationEvent = {
        ...event,
        status: result.status,
        timestamp: result.timestamp,
        message: result.message,
        retryCount: result.retryCount,
        canRetry: result.canRetry,
      };

      setVerificationEvents((prev) =>
        prev.map((e) => (e.id === event.id ? updatedEvent : e))
      );

      // Also update within applications
      setApplications((prev) =>
        prev.map((app) => ({
          ...app,
          verificationEvents: app.verificationEvents.map((ve) =>
            ve.id === event.id ? updatedEvent : ve
          ),
          documents: app.documents.map((doc) =>
            doc.id === event.documentId
              ? { ...doc, verificationStatus: result.status }
              : doc
          ),
        }))
      );

      await addAuditEvent({
        action: 'ISSUER_RETRY_QUERY',
        applicationId: event.documentId,
        details: `Simulated issuer adapter query retried for ${event.source} (${event.referenceNumber}). Status transitioned from '${event.status}' to '${result.status}'.`,
        sourceReferences: [event.source],
      });

      return updatedEvent;
    },
    [addAuditEvent]
  );

  // Route issuer query to manual confirmation
  const routeIssuerToManual = useCallback(
    async (event: IssuerVerificationEvent, reason?: string): Promise<IssuerVerificationEvent> => {
      const updatedEvent = routeToManualConfirmation(
        event,
        reason || 'Officer routed to manual physical clearance due to persistent registry timeout.'
      );

      setVerificationEvents((prev) =>
        prev.map((e) => (e.id === event.id ? updatedEvent : e))
      );

      setApplications((prev) =>
        prev.map((app) => ({
          ...app,
          verificationEvents: app.verificationEvents.map((ve) =>
            ve.id === event.id ? updatedEvent : ve
          ),
          documents: app.documents.map((doc) =>
            doc.id === event.documentId
              ? { ...doc, verificationStatus: 'manual_review_required' }
              : doc
          ),
        }))
      );

      await addAuditEvent({
        action: 'ISSUER_MANUAL_ROUTE',
        applicationId: event.documentId,
        details: `Officer routed verification query for ${event.source} to manual scrutiny. Reason: ${reason || 'Registry timeout / discrepancy'}`,
        sourceReferences: [event.source],
      });

      return updatedEvent;
    },
    [addAuditEvent]
  );

  return (
    <SessionContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        auditEvents,
        addAuditEvent,
        simulateTamper,
        resetAuditChain,
        rules,
        updateRules,
        resetRules,
        isRulesModified,
        applications,
        getApplication,
        performOfficerAction,
        verificationEvents,
        retryIssuerVerification,
        routeIssuerToManual,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
