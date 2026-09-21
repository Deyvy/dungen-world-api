# Integrity and transactions

## Objective

Harden multi-table character operations and database constraints without changing business behavior.

## Scope

- Make spell replacement atomic and reject duplicate spell IDs.
- Add the missing unique constraint for character element values.
- Enforce that selected options belong to the selected element at database level.
- Remove duplicate appearance insertion during character creation.
- Make race and alignment selection atomic.

## Constraints

- Preserve existing user changes, including AGENTS.md.
- Keep migrations append-only; prior migrations are applied.
- Preflight existing duplicates/mismatches before applying constraints.
- Do not expand into authentication, global DTO validation, or unrelated API changes.
- Do not commit without explicit authorization.

## Tasks

- [x] INT-01 Make spell replacement transactional and validate duplicate IDs.
- [x] INT-02 Add character element value uniqueness and option/element integrity migration.
- [x] INT-03 Remove duplicate character-creation appearance insertion.
- [x] INT-04 Transactionalize race and alignment selection.
- [x] INT-05 Run formatting, Prisma checks, build, tests, migration, and live verification.
- [ ] INT-06 Review final diff; commit only with explicit authorization.

## Acceptance criteria

- Spell replacement cannot leave partial state.
- One character has at most one value per element at database level.
- An option cannot be stored against a different element from its catalog definition.
- Character creation creates each appearance row exactly once.
- Race/alignment selection is atomic under concurrent validation/insertion.
- Existing behavior remains unchanged for valid requests.

## Preflight evidence

- No duplicate `character_element_values` rows found.
- No mismatched `character_element_options` rows found.
- The deployed database lacks the unique value index and composite option/element integrity.

## Verification

- Targeted Prettier formatting completed for the changed TypeScript and task files.
- `npx -y prisma@7.10.0 format` passed.
- `npx -y prisma@7.10.0 validate` passed: schema is valid.
- `npx -y prisma@7.10.0 generate` passed: Prisma Client 7.10.0 generated.
- `npm run build` passed.
- `npm test -- --runInBand --passWithNoTests` passed with no tests found (exit code 0).
- `git diff --check` passed.
- Migration `20260921200000_add_character_element_integrity` applied successfully.
- Live verification: unique `(character_id, element_id)` exists for character element values; composite option/element unique key and foreign key exist; migration status is up to date.
- Parent build: passed.
- Parent no-tests check: passed; no tests found.

## Next step

Migration and live verification are complete. Commit remains pending explicit authorization.
