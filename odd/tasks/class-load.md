# Class base load

## Objective
Store each class's base load on `classes` and expose it wherever class data is returned.

## Scope
- Add required `classes.base_load` / Prisma `baseLoad`.
- Backfill current test classes: Guerrero=12 and Mago=7.
- Expose base load in class list/detail and nested character class responses.
- Keep current inventory weight calculation in the frontend using equipment weight and quantity.
- Do not add a backend current-load aggregate yet.

## Constraints
- Current class values are provisional test data but must be explicit in the migration.
- Do not create a LOAD classContent type or row.
- Keep existing movement changes and untracked `src/http/bonds.http` untouched.
- Keep migrations append-only; prior migrations are applied.
- Do not commit without explicit authorization.

## Tasks
- [x] LOAD-01 Add required baseLoad schema field and append-only migration with test backfill.
- [x] LOAD-02 Expose baseLoad through class and character response mappers/DTOs.
- [x] LOAD-03 Run formatting, Prisma checks, build, tests, migration, and live verification.
- [ ] LOAD-04 Review final diff; commit only with explicit authorization.

## Acceptance criteria
- `classes` stores a required base load value.
- Current test data is Guerrero=12 and Mago=7.
- Class list/detail and character nested class responses expose the value.
- No current inventory-weight aggregate is added to the backend.
- No unrelated worktree changes are modified.

## Verification
- Migration: `20260920100000_add_class_base_load/migration.sql` applied successfully.
- Changed files: `prisma/schema.prisma`, `prisma/migrations/20260920100000_add_class_base_load/migration.sql`, `src/modules/classes/classes.service.ts`, `src/modules/classes/dto/class-response.dto.ts`, `src/modules/classes/dto/class-detail.dto.ts`, `src/modules/classes/dto/class-summary.dto.ts`, `src/modules/classes/mappers/class.mapper.ts`, `src/modules/character/dto/character-response.dto.ts`, and `src/modules/character/mappers/character.mapper.ts`.
- Targeted Prettier: passed for the changed TypeScript files.
- Prisma format: `npx prisma format` was unavailable in the installed Prisma 8 RC platform CLI; equivalent `npx --yes prisma@7.10.0 format` passed.
- Prisma validate: `npx prisma validate` was unavailable in the installed Prisma 8 RC platform CLI; `npx --yes prisma@7.10.0 validate` passed.
- Prisma generate: `npx --yes prisma@7.10.0 generate` passed.
- `npm run build`: passed.
- `npm test -- --runInBand --passWithNoTests`: passed; no tests found.
- `git diff --check`: passed after removing formatting-only trailing whitespace.
- Live verification: `classes.base_load` is required with no default; Guerrero id 1 = 12 and Mago id 2 = 7.

## Next step
Migration and live verification are complete. No default or LOAD classContent row was added. Commit remains pending explicit authorization.
