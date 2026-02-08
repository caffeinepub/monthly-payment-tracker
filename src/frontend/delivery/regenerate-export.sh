#!/bin/bash

# Regenerate Delivery Export Script
# This script refreshes the delivery package from repository sources

set -e  # Exit on error

echo "🔄 Regenerating Payment Tracker App delivery export..."

# Determine script location and repository root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$FRONTEND_DIR/.." && pwd)"

echo "📁 Repository root: $REPO_ROOT"
echo "📁 Frontend directory: $FRONTEND_DIR"
echo "📁 Delivery directory: $SCRIPT_DIR"

# Create problem-files directory if it doesn't exist
mkdir -p "$SCRIPT_DIR/problem-files"

echo ""
echo "📋 Step 1: Copying problem files..."

# Copy problem files with renamed paths
cp "$FRONTEND_DIR/.env.example" "$SCRIPT_DIR/problem-files/frontend.env.example"
echo "  ✓ Copied .env.example"

cp "$FRONTEND_DIR/src/vite-env.d.ts" "$SCRIPT_DIR/problem-files/frontend.vite-env.d.ts"
echo "  ✓ Copied vite-env.d.ts"

cp "$FRONTEND_DIR/index.html" "$SCRIPT_DIR/problem-files/frontend.index.html"
echo "  ✓ Copied index.html"

cp "$FRONTEND_DIR/README.md" "$SCRIPT_DIR/problem-files/frontend.README.md"
echo "  ✓ Copied README.md"

echo ""
echo "📋 Step 2: Updating problem-files README..."

# Update problem-files README with current timestamp
cat > "$SCRIPT_DIR/problem-files/README.md" << 'EOF'
# Problem Files Collection

This directory contains copies of key configuration and documentation files that are frequently involved in build and deployment troubleshooting.

## Files Included

### frontend.env.example
**Original Path:** `frontend/.env.example`

**Purpose:** Template for optional environment variables used in production builds.

**Troubleshooting Relevance:**
- Defines available environment variables (`VITE_PUBLIC_APP_URL`, `VITE_II_URL`)
- Shows correct format for Vite environment variables (must be prefixed with `VITE_`)
- Helps diagnose issues with custom Internet Identity providers or public app URLs

**Common Issues:**
- Missing `VITE_` prefix causes variables to be undefined at runtime
- Incorrect URL format for Internet Identity provider
- Environment variables not being picked up during build

### frontend.vite-env.d.ts
**Original Path:** `frontend/src/vite-env.d.ts`

**Purpose:** TypeScript type declarations for Vite environment variables.

**Troubleshooting Relevance:**
- Prevents TypeScript errors about unknown properties on `ImportMetaEnv`
- Required for TypeScript to recognize custom `VITE_*` environment variables
- Must be updated whenever new environment variables are added

**Common Issues:**
- TypeScript error: "Property 'VITE_X' does not exist on type 'ImportMetaEnv'"
- Build fails at type checking stage
- IDE shows red squiggles on `import.meta.env.VITE_*` usage

### frontend.index.html
**Original Path:** `frontend/index.html`

**Purpose:** HTML entry point for the React application.

**Troubleshooting Relevance:**
- Defines document title (should match app branding)
- Contains favicon/icon references (must match asset paths)
- Specifies viewport and charset meta tags
- Links to main TypeScript entry point (`/src/main.tsx`)

**Common Issues:**
- Incorrect asset paths cause missing icons
- Wrong title shows in browser tab
- Missing viewport meta causes mobile layout issues
- Incorrect script path prevents app from loading

### frontend.README.md
**Original Path:** `frontend/README.md`

**Purpose:** Complete frontend development and deployment documentation.

**Troubleshooting Relevance:**
- Contains step-by-step build and deployment instructions
- Includes build verification checklist
- Documents troubleshooting procedures for common issues
- Explains project architecture and file structure

**Common Issues:**
- Skipping steps in deployment workflow causes failures
- Not following build verification checklist leads to incomplete builds
- Missing prerequisite tools (Node.js, pnpm, DFX)
- Incorrect command execution order

## Using These Files for Troubleshooting

### Scenario 1: TypeScript Build Errors
1. Compare your `frontend/src/vite-env.d.ts` with `frontend.vite-env.d.ts`
2. Ensure all custom environment variables are declared
3. Verify the file is in the correct location

### Scenario 2: Environment Variables Not Working
1. Check your `.env` file against `frontend.env.example`
2. Verify all variables have the `VITE_` prefix
3. Confirm you're using `import.meta.env.VITE_*` (not `process.env`)

### Scenario 3: Deployment Failures
1. Follow the deployment steps in `frontend.README.md` exactly
2. Use the build verification checklist before deploying
3. Check that your `index.html` matches the reference version

### Scenario 4: Missing Assets or Blank Screen
1. Verify asset paths in `frontend.index.html` match your build output
2. Check that favicon path points to existing file
3. Confirm script tag points to correct entry point

## Keeping Problem Files Current

These files should be regenerated whenever:
- Environment variable configuration changes
- Build process is updated
- Deployment workflow is modified
- New troubleshooting procedures are documented

To regenerate:
