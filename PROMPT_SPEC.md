# P.R.A.M.A.N. — Master Execution Specification
**Platform for Regulatory Approval, Monitoring & Authentication Network**  
**SIH 2026 | AICTE decision-support prototype**

> **Purpose:** This is the single source of truth for building a high-fidelity, runnable demonstration of a secure AI-assisted regulatory validation workflow. Read the entire specification once, then execute the four phases in order. Make sensible engineering and product decisions autonomously; do not ask the user to choose routine implementation details.

---

## 0. Mission, constraints, and definition of done

Build a polished, interactive Next.js application demonstrating how PRAMAN can help authorized AICTE officers review applications for Extension of Approval (EoA) and related approval changes. The prototype must demonstrate:

1. Category-based intake, document classification, OCR-style extraction, confidence scores, and rectification with before/after comparison.
2. Configurable rule validation against synthetic institutional records, with explainable, evidence-linked findings and dry-run rule editing.
3. Potential tampering, duplicate reuse, metadata, identifier, and date anomaly indicators—always described as indicators requiring human verification, never proof of forgery.
4. Issuer verification with exactly six statuses: `verified`, `mismatch_detected`, `expired`, `verification_pending`, `source_unavailable`, `manual_review_required`; include source, timestamp, result, retry, and manual-routing behavior.
5. Advisory compliance/infrastructure checks with reasons for additional evidence or recommended inspection.
6. Officer queue, alerts, role-aware screens, constrained officer actions, and verifiable hash-chained audit history.
7. A synthetic benchmark page and an integration-style API endpoint with a mock-record adapter.

### Non-negotiable regulatory and safety constraints
- This is a **decision-support prototype**, not an official AICTE service. Label demo data and simulated integrations clearly.
- Never claim access to real AICTE records, real issuing authorities, real QR services, or official APIs. Use synthetic records and deterministic mock adapters.
- Do not bypass access controls or include real personal/institutional data, secrets, credentials, or live external calls.
- AI findings are preliminary, explainable indicators. Do not label a document “forged” as a conclusion.
- Do not provide an `Approve` or `Reject` button anywhere. Officer actions are only: **Acknowledge**, **Dismiss with reason**, **Request clarification**, **Escalate**.
- Final statutory scrutiny, required inspection, and final decisions remain with competent authorities.
- Use role-based UI behavior for `Officer`, `Reviewer`, and `Administrator`; make clear this is prototype-level client-side simulation, not production authentication.
- Treat regulatory requirements as configurable demo rules, not definitive legal advice. Include a visible note that real deployment requires mapping to the applicable current Approval Process Handbook and authorized instructions.
- All seeded records must be fictional and visibly marked `SYNTHETIC DEMO DATA`.

### Definition of done
The project starts using the existing package manager and normal Next.js development command; no broken imports, missing routes, hydration errors, or fatal console errors. All navigation links and advertised controls work. Core flows can be demonstrated without external services. UI is responsive, keyboard-usable, and coherent on desktop and mobile. No empty placeholder panels, dead buttons, fake claims of live integrations, `TODO` stubs, or “coming soon” core features.

---

## 1. Existing environment — preserve it

Project root: `D:\praman`

Already initialized:
- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui using **Base UI** and **Nova** preset
- `components/ui/button.tsx`
- `lib/utils.ts`
- `app/globals.css`
- Git repository initialized

### Environment rules
1. Inspect the current files and `package.json` before changing anything. Do not recreate or reinitialize the project.
2. Preserve the existing Tailwind v4 configuration and shadcn/Base UI conventions. Do not paste in Tailwind v3 setup or add an incompatible component library.
3. Install only necessary dependencies. Add `lucide-react`; use existing UI primitives wherever practical. If a required shadcn component is missing, add it using the compatible shadcn CLI, or build an accessible local component using existing conventions.
4. Use the existing package manager and lockfile. Do not switch package managers.
5. Use the existing import alias (normally `@/*`) and verify it from `tsconfig.json`.
6. Avoid new backend, database, OCR, computer-vision, or cloud dependencies unless truly required. The demo should work offline after dependencies are installed.
7. Use deterministic local simulations for OCR, anomaly detection, issuer APIs, and infrastructure checks. Design interfaces so actual authorized services can later replace the adapters.
8. Keep source files maintainable and typed. Avoid `any` unless narrowly justified.
9. If a command fails, inspect the cause and fix it rather than repeatedly rerunning it unchanged.

---

## 2. Agent Execution Guidelines — mandatory

Anti-Gravity must follow these rules in every phase:

### Token and tool-call conservation
- Read this spec once. Inspect the project once at the start, then keep a concise internal checklist of completed work.
- Work phase-by-phase. Batch related file writes and edits; avoid long conversational explanations.
- Use targeted diffs for existing files. Never rewrite a 300+ line file to change one function, style, or state variable. Preserve unrelated code and user changes.
- Create related files in batched tool calls where supported. In Phase 1, batch mock data, types, utilities, and foundational components instead of doing one file per conversational round trip.
- Do not repeatedly print entire files or giant command output. Summarize only key outcomes and failures.
- Do not ask “Should I proceed?” after minor changes. Continue through the phase checklist and then the next phase.
- Do not stop after planning. Implement, run checks, fix issues, and continue autonomously until all four phases are complete or a genuine environment blocker prevents progress.
- Make reasonable decisions about file names, component boundaries, visual details, and interaction patterns without asking the user.
- If a requirement conflicts with the installed framework, choose the smallest compatible alternative and continue.
- Do not browse the web unless needed to resolve a concrete technical compatibility issue. Prefer installed project conventions and local package documentation.
- Avoid repeated dependency installation. Inspect package state first; install only missing dependencies.

### Implementation quality
- No placeholder stubs, `TODO`, `FIXME`, “rest of code here,” inert buttons, or empty components.
- Do not simulate success for a user action that did not occur. Simulated operations must be labelled as demo simulations.
- Use reusable components and typed data contracts, but do not over-engineer a prototype with needless abstraction.
- Keep mock business logic deterministic and explainable. Avoid arbitrary random values that change on every render.
- Ensure buttons, tabs, filters, dialogs, drawers, uploads, retries, dry runs, and navigation perform their advertised behavior.
- Do not use custom SVGs when a Lucide React icon is suitable. Reuse `components/ui/*`.
- Use semantic HTML, labels, visible focus states, accessible dialog controls, and adequate contrast.
- Prefer CSS transitions and restrained motion over distracting animation. Respect `prefers-reduced-motion`.
- Never overwrite unrelated files, remove the current Git repository, or run destructive cleanup commands.
- Do not claim tests/build succeeded unless the command was run and passed.

### End-of-phase routine
For each phase: implement all listed work, run the most relevant available lint/type/build checks, fix failures, test key flows, then proceed. If a check cannot run because a script is absent, inspect `package.json` and use the closest valid check. At the end, provide a compact summary of completed features, checks actually run, and any genuine limitations.

---

## 3. Product experience and design system

### Visual direction
Create a non-generic, ultra-premium GovTech command center: dense but legible, restrained, authoritative, and evidence-oriented. Avoid a generic landing page, oversized marketing headings, plain white cards, excessive gradients, and giant empty spaces.

- Default theme: dark obsidian, `#020617`.
- Main surfaces: `bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl`.
- Main text: slate-100; secondary text: slate-400; dividers: white/10.
- Verified/compliant: emerald `#10b981`.
- Anomaly/potential forgery indicator: rose/crimson `#f43f5e`.
- Pending/source timeout: amber `#f59e0b`.
- AI decision-support: indigo/violet `#6366f1`.
- Use metallic gradient for selected page titles: `bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400`.
- Use `lucide-react` icons consistently; do not scatter emoji through the interface.
- Add subtle grid/noise-like surface treatment only if implemented with CSS and not at the expense of performance.
- Use consistent spacing, border radii, and type hierarchy. Data tables and case workspace take priority over decorative visuals.

### App shell
- Persistent left sidebar on desktop, collapsible navigation on small screens.
- Header with breadcrumb/page title, global search affordance, demo-data badge, role selector, alerts access, and user/avatar treatment.
- Sidebar brand: **P.R.A.M.A.N.** with expansion “Platform for Regulatory Approval, Monitoring & Authentication Network.”
- Sidebar destinations: Overview, Application Queue, Intake & Validation, Issuer Verification, Compliance Review, Rule Editor, Benchmarks, Audit Trail.
- Use active navigation styling, counts where appropriate, and clear page titles.
- Every page should feel part of one coherent product.

### Status language
Use consistent human-readable labels:
- `verified` → Verified
- `mismatch_detected` → Mismatch detected
- `expired` → Expired
- `verification_pending` → Verification pending
- `source_unavailable` → Source unavailable
- `manual_review_required` → Manual review required

Never use color alone to communicate status; pair color with label and icon. Pulse indicators may be used for pending states, but honor reduced motion.

### Shared UX components
Build reusable components as appropriate:
- `AppShell`, `SidebarNav`, `TopBar`, `PageHeader`
- `StatusBadge`, `ConfidenceBar`, `MetricCard`, `SectionCard`
- `DataTable` or typed table wrappers, `EmptyState`, `FilterBar`
- `AlertBanner`, `EvidencePanel`, `DocumentPreview`
- `Modal/Dialog`, `Sheet/Drawer`, `Toast` or inline feedback
- `StatusTimeline`, `AuditTrail`, `RoleSwitcher`
Use existing shadcn components when available. Do not build a second competing design system.

---

## 4. Architecture and exact file structure

Adapt names only when the existing repository has a strong established convention. Keep all required functionality represented.

```text
D:\praman
├── app/
│   ├── layout.tsx
│   ├── page.tsx                         # Overview command center
│   ├── globals.css
│   ├── applications/
│   │   ├── page.tsx                     # Filterable application queue
│   │   └── [id]/page.tsx                # Case workspace
│   ├── intake/page.tsx                  # Smart intake pipeline
│   ├── verification/page.tsx            # Issuer verification center
│   ├── compliance/page.tsx              # Infrastructure/compliance
│   ├── rules/page.tsx                   # Rule editor and dry run
│   ├── benchmarks/page.tsx              # Synthetic benchmark metrics
│   ├── audit/page.tsx                   # Audit history
│   └── api/
│       └── applications/
│           └── submit/route.ts          # Integration-style endpoint
├── components/
│   ├── app-shell.tsx
│   ├── sidebar-nav.tsx
│   ├── top-bar.tsx
│   ├── page-header.tsx
│   ├── status-badge.tsx
│   ├── metric-card.tsx
│   ├── priority-queue.tsx
│   ├── alerts-strip.tsx
│   ├── application-table.tsx
│   ├── intake-pipeline.tsx
│   ├── document-preview.tsx
│   ├── ocr-diff-viewer.tsx
│   ├── finding-card.tsx
│   ├── evidence-modal.tsx
│   ├── rule-editor.tsx
│   ├── anomaly-viewer.tsx
│   ├── issuer-verification-panel.tsx
│   ├── infrastructure-review.tsx
│   ├── audit-trail-drawer.tsx
│   ├── officer-action-dialog.tsx
│   └── role-switcher.tsx
├── data/
│   └── mockData.json                    # Central synthetic demo dataset
├── lib/
│   ├── utils.ts                         # Preserve existing helpers
│   ├── types.ts                         # Shared TypeScript domain types
│   ├── mock-data.ts                     # Typed loading/access helpers
│   ├── validation-engine.ts             # Deterministic configurable checks
│   ├── verification-engine.ts           # Simulated issuer adapters/retry
│   ├── anomaly-engine.ts                # Synthetic anomaly indicators
│   ├── compliance-engine.ts             # Advisory infrastructure checks
│   ├── audit.ts                         # Hash-chain generation/verification
│   ├── permissions.ts                   # Demo role capability matrix
│   └── format.ts                        # Dates, labels, score formatting
└── public/
    └── demo-documents/                  # Optional synthetic sample assets
```

Create only the files needed; avoid empty scaffolding. If the project already has an equivalent component or route, reuse it.

### Data flow
- `data/mockData.json` is the canonical, human-readable seed data.
- Typed library modules consume seed data and implement deterministic simulation logic.
- UI components consume typed data and local state; avoid embedding large datasets directly in page components.
- API route validates incoming JSON, uses the mock adapter, and returns a structured response.
- No real external network requests. All simulation labels must be explicit.

---

## 5. Domain model and synthetic dataset

Create `/data/mockData.json` with enough realistic, internally consistent synthetic data to demonstrate all six core features. Aim for **at least 8 fictional applications** with a range of normal and problematic cases. All names, IDs, documents, identifiers, issuers, timestamps, and records must be invented. Include a top-level `"dataMode": "SYNTHETIC DEMO DATA"` field.

Suggested shape (extend it as required; keep the JSON valid):

```json
{
  "dataMode": "SYNTHETIC DEMO DATA",
  "generatedAt": "2026-10-25T09:00:00+05:30",
  "applications": [],
  "institutions": [],
  "documentTypes": [],
  "rules": [],
  "issuerResponses": [],
  "alerts": [],
  "benchmark": {},
  "auditEvents": [],
  "infrastructureChecks": []
}
```

### Application fields
Each application should contain:
- `id`, `referenceNumber`, `institutionId`, `institutionName`, `category` (`EoA`, `New Programme`, `Intake Change`, `Institutional Change`), `submittedAt`, `updatedAt`
- `status` (e.g. `Ready for review`, `Action required`, `Verification pending`, `Escalated`, `In review`)
- `priorityScore` (0–100), plus `priorityBreakdown` object with named factors and individual contributions that add coherently to the score
- `programmes` / `requestedIntake`, `previousApprovedIntake`, `terPaymentStatus`
- `documents[]`: `id`, `name`, `type`, `required`, `uploaded`, `expiryDate` or null, `issuer`, `verificationStatus`, `fileName`, `pageCount`, `confidence`, `extractedFields[]`, `metadata`, `anomalies[]`
- `findings[]`: `id`, `ruleId`, `severity`, `title`, `reason`, `field`, `submittedValue`, `recordValue`, `evidence` with document ID/page/region/bounding box, `recommendation`, `wouldClearIf`
- `verificationEvents[]`: source, timestamp, status, message, reference number, retry count
- `infrastructure[]`: evidence type, file, timestamp/location metadata, result, reason, advisory outcome
- `actions[]` and audit references where relevant.

### Synthetic institutions
Create institutional records for each application, with programme/intake values, faculty counts, payment status, compliance/deficiency state, prior approval status, and relevant record references. Deliberately seed both matching and mismatching values so cross-record validation can be shown.

### Document extraction structure
Each `extractedFields[]` item should include:
- `key`, `label`, `value`, `confidence` (0–1), `page`, `bbox` (`x`, `y`, `width`, `height`, normalized 0–1 coordinates), `sourceText`.
Seed believable field examples: institution name, institution ID, programme, approved intake, certificate number, issue date, expiry date, issuer, address, payment reference, faculty count. Ensure some fields match records and others contradict them.

### Rules
Include configurable rules for:
- Required document presence by application category.
- Expiry date.
- Missing required fields.
- Institution identifier mismatch.
- Approved programme/intake mismatch.
- TER payment status.
- Deficiency/compliance status.
- Cross-document date/identifier consistency.
- Duplicate document fingerprint/reuse across institutions.
- Metadata/edit-trace indicator.
- Infrastructure evidence timestamp/location/reuse and floor-plan area threshold.
Each rule needs stable `id`, title, category, enabled flag, severity, description, field/condition, and a human-readable explanation. Do not hard-code any legal threshold as official; label values as illustrative configuration.

### Anomaly examples
Seed distinct cases:
- One document with a synthetic edit-trace / metadata anomaly.
- One image with an illustrative error-level-analysis (ELA) heatmap indicator.
- One repeated document fingerprint linked to two fictional institutions.
- One malformed or mismatched identifier/date.
- One ordinary document with no anomaly, to demonstrate a clean baseline.
All anomaly findings must say **“Potential anomaly — requires human verification”** or equivalent.

### Issuer response coverage
Include examples for all six required statuses. Responses must be deterministic and clearly simulated. Include a case where a source is initially unavailable and a user-triggered or scripted retry changes the demo result to `verified`. Preserve the event history rather than erasing the original outage.

### Infrastructure cases
Include:
- A compliant-looking sample.
- A photo with missing/uncertain location or timestamp.
- A reused/duplicate evidence image.
- A floor plan with illustrative area below a configurable sample threshold.
For each, return reasons and an advisory outcome such as `No discrepancy indicated`, `Needs additional evidence`, or `Recommend inspection`. Never make an automated final compliance determination.

### Benchmark values
Seed plausible **illustrative demo measurements** for extraction accuracy, validation accuracy, anomaly indicator precision/recall, issuer source verification success, average verification time, alert latency, and reduction in repetitive manual effort. Label them “Synthetic benchmark run” and show sample size/methodology. Do not imply independent certification or real-world measured performance. Where practical, derive summary values from seeded test fixtures and explain their calculation.

### Audit events
Seed timestamped events with actor role, action, application ID, event details, rule IDs, source references, previous hash, and event hash. Implement deterministic hash chaining in code; use Web Crypto where available or a small deterministic SHA-256-compatible approach supported by the runtime. Prefer Node `crypto` in server-side utilities and a browser-safe verification approach for client-side use. Do not claim a cryptographic chain is tamper-proof if it is only a local demo simulation.

---

## 6. Shared TypeScript contracts and business logic

Define explicit domain types in `lib/types.ts`, including:
- `ApplicationCategory`
- `VerificationStatus` (exact six values)
- `Severity`
- `OfficerRole`
- `OfficerActionType`
- `DocumentRecord`, `ExtractedField`, `ValidationFinding`, `ValidationRule`
- `InstitutionRecord`, `IssuerVerificationEvent`, `InfrastructureFinding`
- `AuditEvent`, `BenchmarkMetrics`, `ApplicationRecord`

Use `as const`/literal unions where appropriate and type JSON access safely.

### `lib/validation-engine.ts`
Implement deterministic pure functions to:
- Determine required checklist from application category and enabled rules.
- Validate required documents, required fields, expiry, cross-document consistency, and institutional record differences.
- Return findings with stable IDs, rule IDs, evidence references, reasons, severity, and `wouldClearIf`.
- Support rule dry-run: compare current findings with findings after a proposed rule change and summarize added, removed, and changed findings without mutating canonical seed data.
- Keep rule changes in UI state unless the user explicitly selects a demo “Apply to session” action. Do not persist sensitive data or pretend to change official rules.

### `lib/anomaly-engine.ts`
Implement deterministic advisory indicators for:
- Duplicate fingerprint/reuse across institutions.
- Metadata and edit-trace inconsistencies.
- Identifier/date anomalies.
- Illustrative ELA regions.
Expose a normalized region/bounding-box structure for the preview. Label all results as indicators for manual review, not proof.

### `lib/verification-engine.ts`
Implement a mock issuer adapter:
- Accept document/issuer/reference inputs.
- Return a typed status, source name, checked timestamp, explanation, and synthetic reference.
- Support retry count and deterministic transition for the designated outage case.
- Keep event history, including failed attempts.
- Route `source_unavailable`, `mismatch_detected`, and inconclusive cases to manual confirmation as appropriate.
- Make the UI explicitly state “Simulated issuer response — no external authority contacted.”

### `lib/compliance-engine.ts`
Implement configurable advisory checks for photo metadata, reused evidence, and floor-plan area. Each result must include evidence, reason, relevant configured rule, and recommended next step. No automatic final regulatory decision.

### `lib/permissions.ts`
Use a clear capability map:
- **Officer:** view cases, acknowledge, dismiss with required reason, request clarification, escalate.
- **Reviewer:** view cases, review evidence, acknowledge, request clarification, escalate; may dismiss only if the product model explicitly permits it.
- **Administrator:** view and edit demo rules, run dry-run, inspect audit history, and perform officer actions where appropriate.
These are demo UI permissions only. Do not present them as production-grade authorization.

### `lib/audit.ts`
- Append an event for each meaningful simulated action: rule dry-run/apply-to-session, issuer retry, officer action, finding review, and integrity verification.
- Hash-chain events: `eventHash = SHA256(canonical(previousHash + stable event payload))`.
- Canonicalize object key order before hashing.
- Verify sequence continuity, previous-hash links, and recomputed hashes.
- Display exact failed event/index if tampered with in the demo fixture.
- “Verify integrity” must execute verification, show progress/state, and visibly return pass/fail. A passing result should turn the integrity indicator green and display how many events were checked.
- Keep the implementation honest about local demo limitations.

---

# PHASE 1 — Project Skeleton, API Endpoint & Rich Mock Data Engine

## Goal
Establish a stable foundation and all typed synthetic data/business logic in one batch. Build the app shell and functional navigation so later phases extend it rather than replace it.

## Required work
1. Inspect the repository and confirm Next.js version, scripts, import alias, existing UI components, and Tailwind v4 conventions.
2. Install `lucide-react` only if absent.
3. Configure global design tokens in `app/globals.css` without breaking shadcn/Base UI or Tailwind v4. Set dark obsidian as the default visual theme.
4. Create `/data/mockData.json` with the complete synthetic dataset described above and enough cases to cover every status, feature, and dashboard state.
5. Create `lib/types.ts`, `lib/mock-data.ts`, `lib/format.ts`, `lib/permissions.ts`, `lib/validation-engine.ts`, `lib/verification-engine.ts`, `lib/anomaly-engine.ts`, `lib/compliance-engine.ts`, and `lib/audit.ts` in batched edits.
6. Implement the integration-style API route `POST /api/applications/submit`:
   - Parse JSON safely; reject malformed JSON with HTTP 400.
   - Validate required fields and supported category.
   - Accept a synthetic application payload with application reference, institution ID, category, and document metadata.
   - Use a mock-record adapter to compare against seeded synthetic institutional records.
   - Return structured JSON with `success`, `dataMode`, `applicationId` or generated demo reference, `checklist`, `findings`, `verificationSummary`, and `message`.
   - Return useful 400/404/422 errors for invalid payload, unknown synthetic institution, or unsupported category. Do not expose stack traces.
   - Add basic payload size/field validation. Do not claim the endpoint is authenticated for production.
   - Add `GET` only if useful for a short health/demo response; never return secrets.
7. Create `AppShell`, sidebar, top bar, page header, status badge, metric card, and shared primitives. Ensure route links work.
8. Create a compelling overview page with live-feeling but deterministic summary metrics, priority items, alert strip, verification status distribution, and recent audit activity. Do not wait for Phase 2 to make the home route usable.
9. Create initial route pages for all planned destinations with useful, consistent starter content; do not leave blank routes. Phase-specific pages will be completed later.
10. Add a visible `SYNTHETIC DEMO DATA` label and the human-review disclaimer in the shell or persistent footer.

## Phase 1 acceptance checklist
- [ ] Existing project was preserved; no project reinitialization.
- [ ] `lucide-react` is available.
- [ ] Valid `data/mockData.json` covers 8+ fictional applications and all six issuer statuses.
- [ ] Types and deterministic business engines compile.
- [ ] API route validates input and returns structured success/error responses.
- [ ] App shell, navigation, and overview render responsively.
- [ ] Every sidebar link resolves to a real page.
- [ ] No live external integrations or real data are used.
- [ ] Run type/lint/build checks available in the repository and fix failures.

### Ready-to-run Anti-Gravity prompt — Phase 1
```text
Execute PHASE 1 of PROMPT_SPEC.md now. First inspect the existing project and package scripts; preserve the initialized Next.js App Router, TypeScript, Tailwind v4, shadcn Base UI/Nova setup, import alias, and Git repository. Do not reinitialize or switch package managers. Batch-create the complete typed synthetic dataset, domain types, deterministic validation/anomaly/issuer/compliance/audit engines, role capability map, shared shell, overview, initial non-empty route pages, and POST /api/applications/submit. Install lucide-react only if missing. Use synthetic fictional data only; clearly label every simulated external verification. Implement real interactions and useful error handling, not stubs. Follow the visual system and all regulatory safeguards in this spec. Run available checks, fix failures, then summarize briefly and continue only after Phase 1 is genuinely complete. Do not ask me questions about routine decisions.
```

---

# PHASE 2 — Officer Dashboard & Benchmark Analytics

## Goal
Deliver the polished officer-facing command center, priority queue, alerts, filters, role-aware views, and evidence-based benchmark page.

## Overview dashboard `/`
Build a dense operational overview:
- Page title “Regulatory Command Center” and concise context line.
- Summary cards: Applications in queue, Action required, Issuer checks pending, Potential anomalies, Inspection recommendations. Values must derive from seed data and/or deterministic engine outputs.
- Priority queue showing application reference, institution, category, priority score, top reasons, status, last activity, and action to open workspace.
- Priority score popover or expandable breakdown showing named weighted factors and contribution values. Explain that the score is a triage aid, not an automated decision.
- Alerts strip/cards for missing documents, expired items, unavailable sources, potential anomalies, and infrastructure evidence gaps.
- Verification status distribution using a small accessible chart or CSS-based bars; avoid adding a chart dependency if a clear lightweight visualization suffices.
- Recent audit activity with actor, action, timestamp, and case link.
- Filters for status, category, severity/priority, and text search where relevant.
- Distinguish “needs human review” from “verified” clearly.

## Application queue `/applications`
- Filterable, sortable table with search, category/status/severity filters, priority sort, and clear reset.
- Each row includes synthetic reference, institution, category, submitted date, score, primary issue, status, and “Open case”.
- Support pagination or a compact “showing N of M” pattern if needed.
- Filters must affect visible rows. Empty state must offer a reset action.
- Use responsive overflow behavior for narrow screens.
- Clicking a row or action opens `/applications/[id]`.

## Role-aware UI
- Provide role switcher for Officer / Reviewer / Administrator for demo purposes.
- Changing role updates visible capabilities and a small explanation banner.
- Hide or disable admin-only rule editing from non-admin roles; do not rely on hidden UI as production security.
- Keep case viewing and evidence inspection available according to the capability map.
- Do not introduce approve/reject actions.

## Benchmark page `/benchmarks`
Display synthetic test-run metrics:
- Extraction accuracy
- Validation accuracy
- Anomaly indicator precision and recall
- Issuer verification success rate
- Average verification time
- Alert latency
- Estimated reduction in repetitive manual checking effort
- Test fixture count, synthetic sample size, and methodology note
- A compact comparison/chart/table showing metrics by category or test batch if supported by the seeded data.
- Include definitions and denominators where meaningful. Avoid precision theater; mark values as illustrative and not independently validated.
- Include “Run synthetic benchmark” action that recomputes deterministic results and records a benchmark event in the audit trail. Provide visible progress/finished feedback; no random values.

## Phase 2 acceptance checklist
- [ ] Overview metrics derive from data, not hard-coded unrelated values.
- [ ] Priority score breakdown is inspectable.
- [ ] Alerts lead to relevant cases or filters.
- [ ] Queue search, filters, sort, reset, and case navigation work.
- [ ] Role switcher changes UI capabilities.
- [ ] Benchmark page explains sample size, definitions, and synthetic methodology.
- [ ] Benchmark run works and adds an audit event.
- [ ] Responsive layout and accessible status language are preserved.
- [ ] Run checks and fix failures before continuing.

### Ready-to-run Anti-Gravity prompt — Phase 2
```text
Execute PHASE 2 of PROMPT_SPEC.md by extending—not replacing—the Phase 1 architecture. Finish the command-center dashboard, filterable/sortable application queue, priority-score breakdown, actionable alerts, recent audit activity, role-aware UI, and /benchmarks synthetic analytics page. Derive values from seeded data and deterministic engines. Make every filter and control work, include good empty states, and ensure the benchmark run records an audit event. Clearly label all metrics as synthetic illustrative results. Never add Approve or Reject. Run available checks, fix issues, and proceed autonomously without routine questions.
```

---

# PHASE 3 — Application Workspace, Smart Intake & Verification Engine

## Goal
Make the core workflow demonstrable end-to-end: choose a category, upload or select synthetic documents, run intake, inspect extracted values against records, investigate findings, edit rules in dry-run, view anomaly indicators, and retry issuer checks.

## Application case workspace `/applications/[id]`
Use a strong two-column desktop layout with responsive stacking:
- Header: application reference, institution, category, current workflow status, priority score, synthetic-data marker.
- Workflow timeline: Intake → Extraction → Rule validation → Issuer verification → Compliance review → Officer review.
- Tabs/sections: Summary, Documents & OCR, Findings, Issuer checks, Compliance, Audit.
- A side panel summarizing required/received documents, high-priority findings, pending issuer responses, and suggested next steps.
- Show source and timestamp for each verification result.
- All findings must link to a specific document, page/region, rule, and institutional-record value when applicable.

## Smart intake `/intake`
- Category selector: EoA, New Programme, Intake Change, Institutional Change.
- On category change, update required checklist using the rule engine.
- Provide a drag/drop upload area and file picker accepting PDF/image files, with type and size validation. This prototype must not upload files to a server or claim real OCR. Use local in-memory file state and a synthetic document simulation.
- Include a “Load sample pack” action so the demo works instantly without user files.
- Show each document progressing through labelled deterministic stages: Received → Classified → Extracted → Validated. Use a short, restrained transition; do not use long timers or infinite animation.
- For user-supplied files, show the filename and locally simulate classification/extraction. Never pretend actual OCR ran. For seeded demo documents, display realistic synthetic extraction fixtures.
- Extraction fields show value, confidence percentage, page, and a clickable bounding box/region.
- Identify missing required documents/fields and provide a structured validation report.
- Rectification flow: re-upload/replace a selected sample document or edit a synthetic extracted field in demo mode; show before/after diff and rerun checks.
- Clearly separate synthetic field editing from the uploaded file’s real content. Do not persist uploaded documents.

## OCR / institutional record split-pane diff viewer
- Left pane: submitted document preview with synthetic text, extracted fields, confidence bars, page selector, and highlighted normalized bounding boxes.
- Right pane: matching synthetic institutional record fields and source label.
- Highlight agreement in emerald, discrepancy in rose, missing/unknown in amber. Always include text labels and values.
- Selecting a finding scrolls/focuses the relevant field and lights its bounding box.
- If no real PDF rendering exists, create a convincing synthetic document viewer using HTML/CSS and label it “Synthetic preview”; do not fabricate a real scan or claim the uploaded PDF was parsed.
- Provide a zoom or page selector only if it actually affects the preview.

## Evidence-linked findings
Every finding card displays:
- Severity and rule ID
- Concise title and reason
- Submitted value vs record/expected value
- Source document and page/region
- “Why flagged” explanation
- “Would clear if…” remediation condition
- Recommended next step
- Button to “View evidence” opening a dialog with the relevant preview/region and record comparison
- Human-review disclaimer for anomaly or potentially adverse findings
Clicking the finding must also focus/highlight its source evidence in the workspace.

## Rule editor `/rules`
- List enabled/disabled rules with stable IDs, category, severity, and description.
- Allow authorized demo Administrator to toggle a rule, edit a safe configurable threshold/condition, and run a dry run.
- Dry run compares current findings against proposed rules and shows added, removed, and changed findings, affected application count, and affected cases.
- Rule changes must not mutate official policy or canonical JSON. Provide “Apply to session” to update client/session state only, plus “Reset demo rules”.
- Record dry-run and apply-to-session actions in the audit trail.
- Explain the difference between illustrative prototype rules and authoritative regulations.
- For non-admin roles, render a clear read-only view with a reason.

## Anomaly viewer
- Present metadata, edit-trace, duplicate fingerprint, identifier/date mismatch, and ELA indicator examples.
- For ELA, create an illustrative CSS heatmap overlay with labeled suspicious region(s), legend, and evidence explanation. It is a visualization of seeded synthetic findings, not a real forensic ELA calculation.
- Show document fingerprint comparison across fictional institutions.
- Clearly label all cards: “Potential anomaly — requires human verification.”
- Do not use “forged”, “fraud confirmed”, or equivalent conclusive language.

## Issuer verification `/verification`
- Table/cards for all six statuses, source, document type, reference, checked timestamp, result summary, retry count, and next action.
- Filter by status and institution; open related case.
- Retry action calls deterministic local verification engine, records source response and timestamp, updates status if appropriate, and appends audit event.
- Demonstrate an initially unavailable mock source that becomes verified after a retry. Preserve the original failure in history.
- Route mismatch/unavailable/inconclusive cases to manual confirmation. Include a “Route to manual confirmation” action and record it.
- Use pulse dots only for active/pending states; do not imply a real network connection.
- Persistent label: “Simulated issuer response — no external authority contacted.”

## Phase 3 acceptance checklist
- [ ] Category changes required checklist.
- [ ] Sample pack can run without file selection.
- [ ] Upload accepts only allowed file types/sizes and reports errors accessibly.
- [ ] Pipeline stages, field confidence, page/box evidence, and validation report are visible.
- [ ] Before/after rectification diff works.
- [ ] Finding selection focuses the matching evidence and record comparison.
- [ ] Rule dry run reports affected cases and finding changes; session apply/reset work.
- [ ] Anomaly indicators and synthetic heatmap are explicitly advisory.
- [ ] All six issuer statuses are represented and filterable.
- [ ] Retry preserves event history and demonstrates recovery from outage.
- [ ] Manual confirmation routing works and is audited.
- [ ] Run checks and fix failures before continuing.

### Ready-to-run Anti-Gravity prompt — Phase 3
```text
Execute PHASE 3 of PROMPT_SPEC.md, extending the current app without wholesale rewrites. Implement the case workspace, category-aware smart intake, sample pack, safe local file selection, deterministic extraction pipeline, synthetic OCR-vs-record split pane, clickable evidence bounding boxes, before/after rectification, evidence dialogs, configurable rule editor with dry-run and session reset/apply, illustrative anomaly/ELA viewer, and issuer verification center covering all six statuses. Implement working filters, retries, recovery, manual routing, and audit events. Never claim real OCR or external issuer contact; label simulated content honestly. All anomaly findings must require human verification. Run checks and fix failures before moving on.
```

---

# PHASE 4 — Infrastructure Check, Audit Trail Drawer & Officer Decision Workflow

## Goal
Complete the advisory infrastructure module, cryptographically verifiable demo audit trail, officer action workflow, and final visual polish.

## Compliance and infrastructure `/compliance`
- Overview of configured documentary/infrastructure checks and their advisory outcomes.
- Evidence cards for photographs, videos, floor plans, and certificates as applicable to the synthetic data.
- Photo metadata review: timestamp, location availability, reuse indicator, evidence freshness where a configured rule exists.
- Duplicate/reuse comparison across synthetic applications.
- Floor-plan area comparison against a clearly labelled illustrative configurable threshold; show measured/declared values, units, source, and difference.
- Show why an item is flagged and what additional evidence may resolve it.
- Outcomes only: `No discrepancy indicated`, `Needs additional evidence`, `Recommend inspection`, or another clearly advisory equivalent.
- Never claim that computer vision can establish full physical compliance from a photo. Show “Visual/documentary screening only; physical inspection may still be required.”
- Link each result to its application, source evidence, and audit event.

## Audit trail page `/audit` and drawer
- Display chronological events with timestamp, actor/role, action, application, rule/source references, details, previous hash, and event hash.
- Filter by application, event type, and actor; search within visible audit details.
- Clicking an event opens full details in a drawer.
- Include a visible integrity status and “Verify integrity” button.
- Verification recomputes the chain, checks previous-hash continuity and event hashes, and shows checked event count plus exact failure location if any.
- On pass, indicator turns emerald/green with “Integrity check passed (local demo chain)”. On failure, show rose status and the first failing event. Never imply this replaces a production immutable audit store.
- Include a controlled synthetic tamper-test action only if it is clearly labelled as a demo test and can be reset; do not silently alter the canonical seed data.
- Every meaningful user action should add an audit event. Avoid creating an event on every render or trivial hover.

## Officer action workflow
Only these case actions are allowed:
1. **Acknowledge** — record officer acknowledgement and optional note.
2. **Dismiss with reason** — require a non-empty reason; dismiss only the selected alert/finding from the officer’s active queue, never erase underlying evidence or audit history.
3. **Request clarification** — require a clarification request/message; mark the case item as awaiting clarification.
4. **Escalate** — require or select a reason, raise priority/route to reviewer, and record escalation.
- Provide accessible dialog/modal forms with validation, cancel, and confirmation feedback.
- Show action outcome immediately in the UI and add a timestamped audit event.
- Record actor role, case, target finding/alert, reason/message, and previous state.
- Actions must be reversible only through a new audited event if reversal is supported; never delete prior events.
- Make it impossible to show an `Approve` or `Reject` action in the interface. Search the source for those exact action labels in button text before finalizing; explanatory text may state that the prototype intentionally excludes them.
- Keep statutory scrutiny and final decision authority with competent officials.

## Final UI polish
- Refine spacing, density, responsive sidebar, table layouts, modal/drawer sizing, typography, and status consistency across all pages.
- Ensure dashboard uses the same component tokens as workspace pages.
- Use restrained transitions for navigation, pipeline progress, drawers, and status updates. Respect `prefers-reduced-motion`.
- Add helpful loading/empty/error states; no fake infinite loading.
- Ensure keyboard access, focus states, labels, dialog escape behavior, and no color-only status communication.
- Check contrast and prevent overflow, especially for long references, audit hashes, and table cells.
- Add a compact persistent disclaimer: “PRAMAN is a prototype decision-support tool. Findings are advisory; authorized officials retain regulatory scrutiny and final decisions.”
- Add a visible synthetic-data indicator in the header.
- Ensure no real API keys, secrets, or personal data are committed.

## Phase 4 acceptance checklist
- [ ] Infrastructure checks cover photo metadata/reuse and floor-plan area.
- [ ] Each infrastructure finding has evidence, reason, and advisory recommendation.
- [ ] Audit log includes key user actions and source/rule events.
- [ ] Hash chain can be verified and visibly reports pass/fail.
- [ ] Audit filters and event details drawer work.
- [ ] Acknowledge, dismiss-with-reason, request-clarification, and escalate work and are audited.
- [ ] No Approve/Reject buttons or equivalent officer decision controls exist.
- [ ] Responsive/accessibility/visual consistency pass completed.
- [ ] Run final checks, test all key routes and workflows, and fix errors.

### Ready-to-run Anti-Gravity prompt — Phase 4
```text
Execute PHASE 4 of PROMPT_SPEC.md and finish the full prototype. Complete advisory infrastructure checks, photo metadata/reuse and floor-plan review, chronological audit page/drawer, hash-chain integrity verification with honest local-demo wording, and all four officer actions: Acknowledge, Dismiss with required reason, Request clarification, Escalate. Every meaningful action must update the UI and append an audit event without deleting history. Ensure there are no Approve or Reject buttons anywhere. Polish responsive layouts, accessibility, loading/empty/error states, contrast, motion, and consistent glassmorphic GovTech styling. Run final type/lint/build checks available, test key routes and flows, fix all errors, and report only verified outcomes and genuine limitations. Do not ask routine questions.
```

---

## 7. Cross-cutting interaction and engineering details

### Application state
- Use React state for filters, tabs, dialogs, selected evidence, upload progress, retry count, rule edits, role selector, and case actions.
- Prefer a small shared state/context layer only where multiple routes genuinely need synchronized session changes (e.g. role, audit events, session rule overrides, issuer retries). Avoid introducing a large state library.
- Seed data should be immutable at runtime. Keep mutable demo state separate from the JSON seed.
- If persistence is useful, use browser `sessionStorage` behind a small guarded helper; the app must still work if persistence is unavailable. Never persist uploaded document bytes or secrets.
- Avoid server/client hydration mismatches. Do not read browser-only APIs during server render.
- Every action must have a visible result and sensible error handling.

### API contract example
`POST /api/applications/submit`

Example request:
```json
{
  "referenceNumber": "DEMO-2026-001",
  "institutionId": "SYN-INST-001",
  "category": "EoA",
  "documents": [
    {
      "type": "accreditation_certificate",
      "fileName": "sample-accreditation.pdf",
      "referenceNumber": "SYN-CERT-001",
      "expiryDate": "2027-03-31"
    }
  ]
}
```

Example response:
```json
{
  "success": true,
  "dataMode": "SYNTHETIC DEMO DATA",
  "applicationId": "DEMO-2026-001",
  "checklist": {
    "required": ["institution_profile", "accreditation_certificate"],
    "received": ["accreditation_certificate"],
    "missing": ["institution_profile"]
  },
  "findings": [
    {
      "ruleId": "DOC-REQUIRED-001",
      "severity": "high",
      "title": "Required document missing",
      "reason": "The configured demo checklist requires an institution profile.",
      "wouldClearIf": "Upload a valid institution profile document."
    }
  ],
  "verificationSummary": {
    "verified": 0,
    "pending": 1,
    "manualReviewRequired": 0
  },
  "message": "Synthetic validation completed. Findings require authorized human review."
}
```

Treat this as a shape example, not values that must be copied blindly. Ensure the actual checklist and returned results are consistent with seeded rules. Never echo arbitrary huge user payloads.

### Error and empty states
- Unknown case ID: a branded not-found state with a link back to queue.
- Empty filters: explain that no records match and provide reset.
- API validation failure: return safe structured error and show a helpful message.
- Failed local simulation: show a retry or manual review option where appropriate.
- Missing document preview: show a synthetic placeholder clearly labelled as such.
- Do not conceal runtime errors behind fake success states.

### Security and privacy prototype notes
- Use fictional records only.
- Validate user input on the server route, not only in the UI.
- Keep secrets out of the repository.
- Do not execute uploaded files or render untrusted HTML.
- Restrict upload MIME types/extensions and file size; treat client MIME as advisory.
- Avoid logging file contents or personal data.
- Clearly document that production deployment needs real identity/access management, server-side authorization, secure storage, retention policy, rate limiting, monitoring, and security review.

---

## 8. Final verification protocol

Before declaring completion:

1. Inspect `package.json`; run available lint, type-check, and production build scripts. If there is no type-check script, run `npx tsc --noEmit` if compatible.
2. Fix all TypeScript, lint, import, route, and build errors introduced by the implementation.
3. Check all routes:
   - `/`
   - `/applications`
   - `/applications/[valid-seeded-id]`
   - `/intake`
   - `/verification`
   - `/compliance`
   - `/rules`
   - `/benchmarks`
   - `/audit`
   - `/api/applications/submit` using a valid request and malformed/invalid request.
4. Manually exercise: queue filters; category checklist change; sample intake pipeline; evidence highlight; before/after diff; rule dry-run and reset; each of six issuer statuses; source retry recovery; manual routing; benchmark run; infrastructure advisory; each officer action and required reason; audit integrity pass.
5. Search source for `TODO`, `FIXME`, placeholder copy, dead buttons, and `Approve`/`Reject` button labels. Remove core-feature stubs and prohibited action controls.
6. Check responsive layouts and browser console if a browser preview is available. Do not claim browser testing if it was not available.
7. Ensure no live external service is called and all simulated results are labelled.
8. Keep the Git history intact. Do not automatically commit unless explicitly requested.

### Final report format
When all four phases are finished, give a concise report containing:
- What was implemented
- Routes available
- Commands/checks actually run and their results
- Any real limitations or blockers
- How to start the app using the existing project scripts

Do not paste entire source files into the final report. Do not claim completion of anything that was not implemented and checked.

---

## 9. Master execution directive

**Execute Phase 1 → Phase 2 → Phase 3 → Phase 4 in order.** Treat the acceptance checklist in each phase as a gate. Reuse working code and existing components; do not rebuild completed work from scratch. Make ordinary product and engineering decisions autonomously. Use concise tool calls and summaries. Do not ask the user for routine confirmation, do not stop at a plan, and do not sacrifice functional behavior for visual mockups. The result must be a coherent, high-fidelity, fully navigable PRAMAN SIH demonstration with explainable synthetic validation, advisory anomaly/compliance signals, issuer verification simulations, role-aware officer workflows, and an auditable decision-support trail.
