# Character general endpoints

## Objective

Complete the general character API by replacing the DELETE placeholder with real character deletion.

## Scope

- Implement `DELETE /characters/:id`.
- Preserve existing POST, GET, and PATCH behavior.
- Rely on the existing database cascade relationships for character-owned state.
- Return an explicit deletion response.

## Constraints

- Do not add a migration; foreign-key cascades already exist.
- Missing characters must use the existing not-found behavior.
- Do not expand into authentication/authorization.
- Do not commit without explicit authorization.

## Tasks

- [x] CHAR-01 Implement character deletion and controller parameter validation.
- [x] CHAR-02 Run formatting, build, tests, and live read-only verification.
- [ ] CHAR-03 Review final diff; commit only with explicit authorization.

## Acceptance criteria

- Existing character deletion removes the character and database-owned child state through configured cascades.
- Missing character deletion returns not-found behavior.
- The endpoint no longer returns a placeholder string.
- Existing character endpoints remain unchanged.

## Verification

- `DELETE /characters/:id` now uses ParseIntPipe and Prisma delete with explicit success response.
- Targeted Prettier: passed for TypeScript/task files; `.http` file was not formatted because the configured parser does not support it.
- `npm run build`: passed.
- `npm test -- --runInBand --passWithNoTests`: passed; no tests found.
- `git diff --check`: passed.
- Live read-only verification: all seven character-owned tables have `ON DELETE CASCADE` foreign keys.

## Next step

Review the final diff; commit only with explicit authorization.
