# Specification

## Summary
**Goal:** Add a one-command way to export the entire repository into a single local “project folder”, and update delivery docs/output to be clear and English-only.

**Planned changes:**
- Add a new script under `frontend/delivery/` that copies the repository into one exported top-level folder while excluding `.git`, `node_modules`, `dist`, `build`, `.dfx`, and existing export directories.
- Ensure the folder export is safe to run multiple times (timestamped output or clean overwrite) and prints the final on-disk output path in English.
- Update `frontend/delivery/README.md` with complete English instructions for creating the project folder export and (optionally) the ZIP export, including exact commands from repo root, output locations, and the next steps to run locally (install deps + start dev server).
- Adjust the existing `frontend/delivery/export-zip.sh` to keep producing a ZIP with exactly one top-level directory, and ensure console output is English-only and prints the full ZIP path at the end.

**User-visible outcome:** The user can run a command to generate a single exported project folder on disk containing all program files (with standard exclusions), can still generate a clean ZIP with one top-level folder, and can follow updated English documentation to export and run the app locally.
