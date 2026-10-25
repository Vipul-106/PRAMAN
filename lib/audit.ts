// P.R.A.M.A.N. — Cryptographic Audit Trail & Hash-Chaining Engine
// Demonstrates immutable sequence verification via SHA-256 block linking.

import { AuditEvent, OfficerRole } from './types';

/**
 * Deterministic string hash (SHA-256 simulation in environments without crypto,
 * and standard WebCrypto / Node crypto where available)
 */
async function computeSha256(data: string): Promise<string> {
  // If running in browser or Node with Web Crypto available
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback pure JS SHA-256 for non-crypto contexts
  return fallbackSha256(data);
}

// Compact synchronous SHA-256 implementation for deterministic local verification
function fallbackSha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  let i = 0, j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  for (i = 0; i < ascii.length; i++) {
    const code = ascii.charCodeAt(i);
    words[i >> 2] |= (code & 0xff) << (24 - (i % 4) * 8);
  }
  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  const w: number[] = new Array(64);
  for (i = 0; i < words.length; i += 16) {
    let a = hash[0], b = hash[1], c = hash[2], d = hash[3];
    let e = hash[4], f = hash[5], g = hash[6], h = hash[7];

    for (j = 0; j < 64; j++) {
      if (j < 16) {
        w[j] = words[i + j] | 0;
      } else {
        const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }

      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + ch + k[j] + w[j]) | 0;
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = ((rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }

  return result;
}

/**
 * Serializes event payload deterministically with sorted keys
 */
export function canonicalizePayload(event: Omit<AuditEvent, 'eventHash'>): string {
  const stableObject = {
    action: event.action,
    actorName: event.actorName,
    actorRole: event.actorRole,
    applicationId: event.applicationId,
    details: event.details,
    id: event.id,
    previousHash: event.previousHash,
    ruleIds: [...event.ruleIds].sort(),
    sourceReferences: [...event.sourceReferences].sort(),
    timestamp: event.timestamp,
  };
  return JSON.stringify(stableObject);
}

/**
 * Computes hash for an event using canonical payload + previousHash
 */
export async function calculateEventHash(event: Omit<AuditEvent, 'eventHash'>): Promise<string> {
  const canonical = canonicalizePayload(event);
  return computeSha256(event.previousHash + canonical);
}

export interface ChainVerificationResult {
  passed: boolean;
  eventsChecked: number;
  failedEventIndex: number | null;
  failedEventId: string | null;
  failureReason: string | null;
}

/**
 * Validates the complete cryptographic continuity of an audit event chain
 */
export async function verifyAuditChain(events: AuditEvent[]): Promise<ChainVerificationResult> {
  if (events.length === 0) {
    return {
      passed: true,
      eventsChecked: 0,
      failedEventIndex: null,
      failedEventId: null,
      failureReason: null,
    };
  }

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    // Check link to previous hash
    if (i > 0) {
      const prevEvent = events[i - 1];
      if (event.previousHash !== prevEvent.eventHash) {
        return {
          passed: false,
          eventsChecked: i,
          failedEventIndex: i,
          failedEventId: event.id,
          failureReason: `Broken previousHash pointer. Event ${event.id} points to ${event.previousHash.slice(0, 10)}..., expected ${prevEvent.eventHash.slice(0, 10)}...`,
        };
      }
    } else {
      // Genesis event must have valid genesis previousHash
      if (event.previousHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
        return {
          passed: false,
          eventsChecked: 0,
          failedEventIndex: 0,
          failedEventId: event.id,
          failureReason: 'Genesis event previousHash is not null-padded genesis format.',
        };
      }
    }

    // Recompute payload hash
    const recomputedHash = await calculateEventHash(event);
    if (recomputedHash !== event.eventHash) {
      return {
        passed: false,
        eventsChecked: i,
        failedEventIndex: i,
        failedEventId: event.id,
        failureReason: `Tampered payload in event ${event.id}. Recomputed ${recomputedHash.slice(0, 12)}... does not match recorded ${event.eventHash.slice(0, 12)}...`,
      };
    }
  }

  return {
    passed: true,
    eventsChecked: events.length,
    failedEventIndex: null,
    failedEventId: null,
    failureReason: null,
  };
}

/**
 * Appends a new audited event to a running chain
 */
export async function appendAuditEvent(
  chain: AuditEvent[],
  eventData: {
    actorRole: OfficerRole;
    actorName: string;
    action: string;
    applicationId: string;
    details: string;
    ruleIds?: string[];
    sourceReferences?: string[];
  }
): Promise<AuditEvent> {
  const lastEvent = chain[chain.length - 1];
  const previousHash = lastEvent
    ? lastEvent.eventHash
    : '0000000000000000000000000000000000000000000000000000000000000000';

  const newId = `AUDIT-${String(chain.length + 1).padStart(4, '0')}`;
  const partialEvent: Omit<AuditEvent, 'eventHash'> = {
    id: newId,
    timestamp: new Date().toISOString(),
    actorRole: eventData.actorRole,
    actorName: eventData.actorName,
    action: eventData.action,
    applicationId: eventData.applicationId,
    details: eventData.details,
    ruleIds: eventData.ruleIds || [],
    sourceReferences: eventData.sourceReferences || [],
    previousHash,
  };

  const eventHash = await calculateEventHash(partialEvent);
  const fullEvent: AuditEvent = {
    ...partialEvent,
    eventHash,
  };

  return fullEvent;
}
