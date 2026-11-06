#!/usr/bin/env bash
# Generates release notes for a muckidrive tag from the changelog directory.
# Usage: generate-release-notes.sh <tag>   (e.g. v0.1.0)
#
# Notes are assembled from changelog/release-<x-y-z>/*.md (sorted by name - use
# a YYYY-MM-DD-NN-slug.md prefix to control the order). The frontmatter title
# becomes the section heading; the frontmatter block itself is not printed.
# When the folder is empty or missing, a fallback list of commits since the
# previous tag is used.
set -euo pipefail

TAG="${1:?Usage: generate-release-notes.sh <tag>}"
VERSION="${TAG#v}"
DIR="changelog/release-$(echo "$VERSION" | tr '.' '-')"

echo "# Changelog ${VERSION}"

if compgen -G "${DIR}/*.md" > /dev/null; then
    for file in "${DIR}"/*.md; do
        slug="$(basename "$file" .md)"
        slug="$(echo "$slug" | sed -E 's/^[0-9]{4}-[0-9]{2}-[0-9]{2}(-[0-9]+)?-//')"
        title="$(sed -n 's/^title:[[:space:]]*//p' "$file" | head -1)"
        title="${title:-${slug//-/ }}"
        echo
        echo "## $title"
        echo
        awk 'NR==1 && /^---$/ {fm=1; next} fm==1 && /^---$/ {fm=0; next} fm!=1 {print}' "$file"
    done
else
    PREVIOUS_TAG="$(git describe --tags --abbrev=0 "${TAG}^" 2>/dev/null || true)"
    RANGE="${PREVIOUS_TAG:+${PREVIOUS_TAG}..}${TAG}"
    echo
    echo "_No changelog entries found in \`${DIR}\` - listing commits since ${PREVIOUS_TAG:-the beginning}:_"
    echo
    git log --oneline "${RANGE}"
fi
