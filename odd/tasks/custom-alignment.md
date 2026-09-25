# Custom character alignment

## Objective

Allow a character to create a custom alignment that is available only to that character.

## Scope

- Add `POST /characters/:characterId/alignments/custom`.
- Accept an alignment name and description.
- Persist the record in `classContent` with `type = ALIGNMENT`.
- Persist ownership metadata as `{ "isCustom": true, "characterId": <id> }`.
- Exclude another character's custom alignments from available alignment results.
- Preserve existing alignment selection and shared alignment behavior.

## Constraints

- Do not add Prisma models or schema relations.
- Derive `classId` from the character; do not accept it from the request body.
- Store metadata as the existing `classContent.metadata` string field.
- Invalid or incomplete custom metadata must not make a custom alignment visible to other characters.

## Tasks

- [x] CA-01 Add DTO, route, service creation, and ownership-aware available-alignment filtering.
- [x] CA-02 Add HTTP example and verify formatting, build, and tests.
- [x] CA-04 Reject foreign and malformed custom alignment metadata during selection and availability filtering.
- [ ] CA-03 Review final diff and create the work-unit commit.

## Authorized scope

- `src/modules/character/`
- `src/http/alignment.http`
- `odd/tasks/custom-alignment.md`

## Acceptance criteria

- A valid character can create an alignment with name and description.
- The created row has `type = ALIGNMENT` and metadata identifying it as custom for that character.
- The creating character sees the custom alignment in `GET /characters/:id/alignments/available`.
- Other characters do not see it, even when they use the same class.
- Existing non-custom alignments and selection behavior remain unchanged.

## Verification

- `npx prettier --write` on changed TypeScript and HTTP/task files.
- `npm run build`.
- `npx tsc -p tsconfig.build.json --noEmit`.
- `npx jest --runInBand --passWithNoTests`.

## Progress

- Feature branch created: `feature/custom-alignment`.
- Task document created before source changes.
- Implementation completed in the authorized scope.
- Correction applied: `selectAlignment` now rejects custom alignments whose parsed `characterId` does not match the requesting character, including malformed custom metadata. Available alignments use the same helper; arrays, invalid JSON, and custom metadata with missing or non-integer ownership are excluded rather than treated as shared. Shared alignments and race behavior are unchanged.
- Verification results:
  - `npx prettier --write` on changed TypeScript files: passed.
  - `npx prettier --write --parser markdown` on `src/http/alignment.http` and this task file: passed; the `.http` file requires the explicit parser.
  - `npm run build`: passed (`nest build`, exit code 0).
  - `npx tsc -p tsconfig.build.json --noEmit`: passed (exit code 0).
  - `npx jest --runInBand --passWithNoTests`: passed; no tests found, exit code 0.
- No commit created, per request.
