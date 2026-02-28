Release a new version of Claude Lens.

Steps:
1. Read the current version from package.json
2. Ask the user what type of release this is: patch, minor, or major
3. Bump the version in package.json accordingly (e.g. 0.1.0 → 0.1.1 for patch, 0.1.0 → 0.2.0 for minor, 0.1.0 → 1.0.0 for major)
4. Commit the version bump with message: 🔖 Bump version to v{NEW_VERSION}
5. Create a git tag: v{NEW_VERSION}
6. Push the commit and tag: git push && git push origin v{NEW_VERSION}
7. Tell the user the GitHub Actions workflow will now build, sign, notarize, release, and update the Homebrew tap automatically
8. Provide the link to watch the workflow: https://github.com/TheNightProject/claude-lens/actions
