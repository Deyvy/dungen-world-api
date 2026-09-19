# User-created bonds

## Objective
Add character-scoped CRUD for bonds entered by the player as free text.

## Problem
The database contains a `characterBonds` model, but the API has no bond operations. The existing `is_example` field is not needed because generic example templates belong to the frontend.

## Scope
- Store only player-created bond text.
- Remove `is_example` from the Prisma model and database.
- Add list, create, update, and delete operations under a character.
- Scope every mutation by both character and bond id.
- Validate non-empty trimmed text and return explicit DTOs/mappers.

## Constraints
- Do not model another-character foreign keys; the other character's name is part of the text.
- Do not add backend example/template endpoints.
- Preserve existing character and equipment behavior.
- Keep migrations append-only because prior migrations are applied.

## Authorized scope
- Repository: `dungen-world-api`
- Branch: `feature/equipment-inventory`
- Database: remove only `character_bonds.is_example`; no bond rows currently exist.

## Tasks
- [x] BOND-01 Add bond DTOs, mapper, service operations, and controller routes.
- [x] BOND-02 Remove `is_example` from the Prisma model and add an append-only cleanup migration.
- [x] BOND-03 Run targeted formatting, Prisma validation/generation, and the build; confirm the available test status.
- [x] BOND-04 Review final diff; commit authorized by user and ready to create.

## Endpoint contract
- `GET /characters/:id/bonds`
- `POST /characters/:id/bonds` with `{ "text": "..." }`
- `PATCH /characters/:id/bonds/:bondId` with `{ "text": "..." }`
- `DELETE /characters/:id/bonds/:bondId`

## Acceptance criteria
- Only user-created text is persisted.
- Empty or whitespace-only text is rejected.
- A bond from another character cannot be updated or deleted through the route.
- The database no longer contains `is_example`.
- Existing unrelated behavior remains intact.

## Verification
- Targeted Prettier: passed for the changed TypeScript files.
- `npx prisma format` / `npx prisma validate` / `npx prisma generate`: unavailable with the repository's installed Prisma `8.0.0-rc.15` CLI because those commands are not registered by that CLI.
- Equivalent Prisma `7.9.1` checks: passed with `npx -p prisma@7.9.1 prisma format --schema prisma/schema.prisma`, `npx -p prisma@7.9.1 prisma validate --schema prisma/schema.prisma`, and `npx -p prisma@7.9.1 prisma generate --schema prisma/schema.prisma`.
- `npm run build`: passed.
- `npm test -- --runInBand`: no tests found; Jest exited with code 1 because the repository has no matching `*.spec.ts` files.
- `npm test -- --runInBand --passWithNoTests`: passed with no tests found.
- Live migration verification: migration `20260919190000_remove_character_bond_example_flag` applied successfully; `character_bonds` now contains only `id`, `character_id`, `text`, and `created_at`, and currently has zero rows.
- Parent spot check `npm run build`: passed.
- Prisma migration status: database schema is up to date.
- `git diff --check`: passed with existing LF/CRLF warnings only.

## Changed files
- `prisma/schema.prisma` — removed `is_example` from `characterBonds`.
- `prisma/migrations/20260919190000_remove_character_bond_example_flag/migration.sql` — append-only migration that drops only `character_bonds.is_example`.
- `src/modules/character/character.controller.ts` — added the four character-scoped bond routes.
- `src/modules/character/character.service.ts` — added scoped CRUD operations and trimmed non-empty text validation.
- `src/modules/character/dto/create-bond.dto.ts` — create request DTO.
- `src/modules/character/dto/update-bond.dto.ts` — update request DTO.
- `src/modules/character/dto/bond-response.dto.ts` — explicit response DTO.
- `src/modules/character/mappers/character-bond.mapper.ts` — Prisma-to-response mapper.
- `odd/tasks/bonds.md` — recorded implementation and verification status.

## Migration
- Migration name: `20260919190000_remove_character_bond_example_flag`.
- Parent step: migration reviewed and applied to the target database.

## Next step
No application code changes remain for this task.

## Commit evidence
- Included in the authorized work-unit commit `feat: add equipment inventory and character bonds`.
