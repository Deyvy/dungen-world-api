# Character appearance read

## Objective

Expose the existing character appearance records without duplicating the update operation.

## Scope

- Add `GET /characters/:id/appearance`.
- Return appearance lines ordered by `sortOrder`.
- Keep `PATCH /characters/:id` as the update contract.
- Preserve the existing transactional replacement behavior.

## Constraints

- Do not add a duplicate appearance-only update route.
- Do not change the `characterAppearance` schema.
- Return an empty array when the character exists without appearance lines.
- Preserve unrelated uncommitted changes.

## Tasks

- [x] APP-01 Add the character-scoped appearance GET and HTTP example.
- [x] APP-02 Run formatting, build, tests, and read-only verification.
- [ ] APP-03 Review final diff; commit only with explicit authorization.

## Acceptance criteria

- Missing characters use the existing not-found behavior.
- Existing characters receive ordered appearance strings.
- PATCH appearance behavior remains unchanged.

## Verification

- Added `GET /characters/:id/appearance`, returning ordered content strings.
- Targeted Prettier: passed for TypeScript/task files; `.http` files were not formatted because the configured parser does not support them.
- `npm run build`: passed.
- `npm test -- --runInBand --passWithNoTests`: passed; no tests found.
- `git diff --check`: passed.
- Live read-only verification: character 4 has four ordered appearance rows; missing character id 99999 is absent and service not-found behavior remains unchanged.

## Next step

Review the final diff; commit only with explicit authorization.
