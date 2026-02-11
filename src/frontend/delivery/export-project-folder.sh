#!/usr/bin/env bash
set -euo pipefail

# Export script for creating a single project folder containing the entire repository
# Usage: bash frontend/delivery/export-project-folder.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DELIVERY_DIR="$SCRIPT_DIR"
EXPORTS_DIR="$DELIVERY_DIR/exports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PROJECT_NAME="payment-tracker-app"
FOLDER_NAME="${PROJECT_NAME}_${TIMESTAMP}"
OUTPUT_DIR="$EXPORTS_DIR/$FOLDER_NAME"

echo "Starting repository export..."
echo "Repository root: $REPO_ROOT"

# Create exports directory if it doesn't exist
mkdir -p "$EXPORTS_DIR"

# Create output directory
mkdir -p "$OUTPUT_DIR"

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
  "$REPO_ROOT/" "$OUTPUT_DIR/"

echo "Export complete!"
echo "Output folder: $OUTPUT_DIR"
echo ""
echo "The folder contains all program files ready to run."
echo "Next steps:"
echo "  1. Navigate to the exported folder: cd $OUTPUT_DIR"
echo "  2. Install dependencies: pnpm install"
echo "  3. Start the development server: pnpm dev"
