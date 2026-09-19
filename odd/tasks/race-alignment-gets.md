# Race and alignment reads

## Objective

Expose the class-specific race and alignment options and the race/alignment currently selected by a character.

## Scope

- `GET /characters/:id/races/available`
- `GET /characters/:id/race`
- `GET /characters/:id/alignments/available`
- `GET /characters/:id/alignment`
- Reuse explicit character-content response mapping.
- Preserve the existing POST selection behavior and validations.

## Constraints

- Race and alignment are `classContent` records scoped to the character's class.
- Only active class content is available for selection.
- A character without a selected race/alignment returns `null` for the selected resource.
- Do not alter character creation or add new schema relationships.

## Tasks

- [x] RA-01 Add available/selected service queries and explicit response mapping.
- [x] RA-02 Add the four GET controller routes and update HTTP examples if applicable.
- [x] RA-03 Run formatting, build, tests, and live read-only verification (runtime HTTP verification remains blocked by the existing production-start output path issue).
- [ ] RA-04 Review final diff; commit only with explicit authorization.

## Acceptance criteria

- Available options are filtered by character class, content type, and active status.
- Selected reads are scoped to the character and return `null` when not selected.
- Existing POST routes remain unchanged.
- No database migration is required.

## Verification

- Targeted Prettier: passed for the TypeScript and task files; Prettier does not infer a parser for the existing `.http` files.
- `npm run build`: passed (`nest build`).
- `npx tsc -p tsconfig.build.json --noEmit`: passed.
- Tests: no test files exist; `npm test -- --runInBand --passWithNoTests` exited successfully with no tests found.
- Prisma validate/generate: not run because `schema.prisma` was not changed.
- Live SQL verification: class 1 has three active alignments and three active races; character 5 currently has neither selected, matching the selected endpoints' expected `null` behavior.
- Runtime HTTP verification: blocked because `npm run start:prod` failed with `Cannot find module .../dist/main`; the successful build did not produce a `dist` entry in this workspace.

## Endpoint contract

- Available endpoints return an array of `{ id, title, content, sortOrder }` records.
- Selected endpoints return one `{ id, title, content, sortOrder }` record or `null`.
- Missing characters return the existing Prisma not-found response behavior.

## Changed files

- `src/modules/character/character.controller.ts`
- `src/modules/character/character.service.ts`
- `src/modules/character/dto/character-content-response.dto.ts`
- `src/modules/character/mappers/character-content.mapper.ts`
- `src/http/races.http`
- `src/http/alignment.http`
- `odd/tasks/race-alignment-gets.md`

## Next step

Review the final diff; commit only with explicit authorization.
