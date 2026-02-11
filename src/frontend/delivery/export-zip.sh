#!/usr/bin/env bash
set -euo pipefail

# Export script for creating a single-folder ZIP archive of the entire repository
# Usage: bash frontend/delivery/export-zip.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DELIVERY_DIR="$SCRIPT_DIR"
EXPORTS_DIR="$DELIVERY_DIR/exports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PROJECT_NAME="payment-tracker-app"
ARCHIVE_NAME="${PROJECT_NAME}_${TIMESTAMP}"
OUTPUT_ZIP="$EXPORTS_DIR/${ARCHIVE_NAME}.zip"

echo "Starting repository export..."
echo "Repository root: $REPO_ROOT"

# Create exports directory if it doesn't exist
mkdir -p "$EXPORTS_DIR"

# Create temporary directory for staging
TEMP_DIR=$(mktemp -d)
STAGING_DIR="$TEMP_DIR/$ARCHIVE_NAME"
mkdir -p "$STAGING_DIR"

echo "Copying repository files..."

# Copy all files except excluded directories
rsync -a \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='build' \
  --exclude='.dfx' \
  --exclude='frontend/delivery/exports' \
  --exclude='.cache' \
  --exclude='coverage' \
  --exclude='.next' \
  --exclude='.turbo' \
  "$REPO_ROOT/" "$STAGING_DIR/"

echo "Creating ZIP archive..."

# Create ZIP from staging directory
cd "$TEMP_DIR"
zip -r -q "$OUTPUT_ZIP" "$ARCHIVE_NAME"

# Clean up temporary directory
rm -rf "$TEMP_DIR"

echo "Export complete!"
echo "Output ZIP: $OUTPUT_ZIP"
echo ""
echo "The ZIP contains all program files under a single top-level folder: $ARCHIVE_NAME"
echo "Next steps:"
echo "  1. Extract the ZIP file"
echo "  2. Navigate to the extracted folder: cd $ARCHIVE_NAME"
echo "  3. Install dependencies: pnpm install"
echo "  4. Start the development server: pnpm dev"
