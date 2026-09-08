---
name: fix-dependabot-alerts
description: Read every open GitHub Dependabot alert for the current repository, update vulnerable direct and transitive dependencies and lockfiles, repair update-caused compatibility issues, and validate the result. Use when asked to fix Dependabot alerts or dependency security vulnerabilities with gh.
---

# Fix Dependabot Alerts

Fix the underlying vulnerabilities without dismissing alerts. Do not commit, push, open pull requests, or dismiss alerts unless the user separately requests those actions.

## Workflow

1. Read repository instructions and inspect the working tree. Preserve unrelated user changes and generated-file conventions.
2. Identify the GitHub repository with `gh repo view`. Retrieve **all** open alerts with the REST endpoint using an explicit GET, pagination, and `state=open`; for example:

   ```sh
   gh api -X GET --paginate 'repos/OWNER/REPO/dependabot/alerts?state=open&per_page=100'
   ```

   Do not use `-f state=open` without `-X GET`, because that makes `gh api` send a POST.
3. Build a complete inventory containing each alert number, severity, ecosystem, manifest path, dependency, relationship, vulnerable range, and first patched version. Process critical and high severity alerts first, then finish every remaining open alert. Consolidate duplicate advisories only after retaining a mapping from every alert number to its fix.
4. Inspect manifests, lockfiles, package-manager configuration, and dependency paths. Choose a patched version that satisfies every applicable advisory. Prefer the smallest compatible update, but advance beyond an alert's minimum when the current registry audit reports a newer vulnerability.
5. Update direct dependencies in their manifests. Resolve transitive vulnerabilities through normal parent upgrades when practical; otherwise add a narrowly scoped package-manager override. Put configuration in the location supported by the repository's actual package-manager version—for pnpm 10+, use `pnpm-workspace.yaml` overrides. Preserve existing overrides.
6. Regenerate lockfiles with the repository's package manager. Never hand-edit resolution or integrity entries. Avoid unrelated broad dependency upgrades.
7. Run the relevant tests, type checks, builds, and lint prescribed by repository instructions. Fix compatibility failures caused by the security update. Report pre-existing failures separately instead of expanding into unrelated cleanup.
8. Run the package manager's vulnerability audit for every affected package or workspace. Fix remaining known vulnerabilities in the resolved graph when doing so stays within dependency-security scope. Confirm frozen-lockfile installation succeeds when supported.
9. Inspect the final diff, remove only generated artifacts created during validation, and run a whitespace/error check such as `git diff --check`.

## Completion report

Account for every original alert number, grouped by dependency when useful. State its minimum patched version and final resolved version, list changed manifests/configuration/lockfiles, and report each validation command as passed or failed. Explicitly mention that no alerts were dismissed. Note that GitHub alerts generally remain open until the fix is committed and reaches the scanned branch.
