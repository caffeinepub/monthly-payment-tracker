# Specification

## Summary
**Goal:** Finalize the Payment Tracker App for reliable production publishing on the Internet Computer, ensure consistent app naming, and package a reproducible delivery export (including troubleshooting “problem files”).

**Planned changes:**
- Update all user-facing naming/branding strings across the frontend to consistently use “Payment Tracker App” (document title/metadata, login branding text/alt text, in-app header/brand label, and any remaining legacy names like “Monthly Payment Tracker”, “Payment Tracker”, or “Finance Tracker”).
- Add a repo-local `delivery/` folder containing a human-readable project structure index (full snapshot of frontend + backend folders) and documented, reproducible steps (single command or clear sequence) to regenerate the export from the repo without manual copying.
- Add `delivery/problem-files/` containing build/deploy troubleshooting-relevant files, plus a README explaining what each file is and why it’s included.
- Identify and fix deterministic causes of intermittent build/deploy failures and add a short troubleshooting note describing what was fixed and how to reliably reproduce a successful end-to-end build + deploy.

**User-visible outcome:** The app shows “Payment Tracker App” everywhere users see the name, deployments can be run end-to-end reliably, and a `delivery/` package exists with a reproducible project snapshot plus a clearly documented set of “problem files” for diagnosing build/deploy issues.
