# Movement validation and atomicity

## Objective

Correct movement acquisition, initial assignment, dynamic-element updates, and level-up atomicity without changing the established game rules.

## Confirmed semantics

- `PUT /characters/:id/moves/:contentId` is a partial update.
- Only the `elementId` values included in the request may be changed or cleared.
- Omitted elements retain their previous character state.
- Explicit empty `optionIds` means clear that element and must still satisfy `min_select`.

## Scope

- Filter initial movement assignment by active status.
- Enforce advanced, active, same-class, level, and duplicate rules when acquiring movements.
- Reuse movement acquisition inside one Prisma transaction for level-up.
- Make dynamic updates partial and validate duplicate IDs and selection limits.

## Constraints

- Do not change movement content models or invent new progression rules.
- Preserve existing response shapes and completed endpoints.
- Use transaction clients for operations that update multiple tables.
- Do not commit without explicit authorization.

## Tasks

- [x] MOVE-01 Correct partial dynamic-element update behavior.
- [x] MOVE-02 Harden movement acquisition and initial active filtering.
- [x] MOVE-03 Make level-up and movement acquisition atomic.
- [x] MOVE-04 Run targeted formatting, build, tests, and static verification.
- [ ] MOVE-05 Review final diff; commit only with explicit authorization.
- [ ] MOVE-06 Preserve current HP on constitution increases unless HP was full before level-up.

## Acceptance criteria

- Updating one dynamic element leaves all other element state unchanged.
- Explicit empty selections are validated against `min_select`.
- Duplicate element and option IDs receive controlled validation errors.
- Only active advanced movements can be acquired once and at an allowed level.
- Character creation never assigns inactive initial movements.
- Level-up rolls back level/stat/hp and movement acquisition together on failure.
- Increasing constitution only increases hpCurrent when it was at the previous maximum HP.

## Verification

- `npx prettier --write "src/modules/character/character.service.ts" "src/modules/character/dto/update-move.dto.ts" "odd/tasks/movement-review.md"` — passed.
- `npm run build` — passed (`nest build`).
- `npm test -- --runInBand --passWithNoTests` — passed; no tests found, exit code 0.
- TypeScript check — covered by the successful Nest build; no separate TypeScript-check script is configured.
- Parent spot check `npm run build` — passed.
- Parent spot check `npm test -- --runInBand --passWithNoTests` — passed; no tests found.
- Live read-only verification — class 1 has one active initial movement and three active advanced movements; acquired movement rows remain unchanged.

## Follow-up correction

- MOVE-06 completed: nullable constitution is guarded and hpCurrent increases only when constitution increases while pre-level-up HP equals the previous maximum.

## Changed files

- `src/modules/character/character.service.ts` — active initial movement filtering, transaction-compatible acquisition helper, partial element updates, duplicate/selection validation, and atomic level-up.
- `src/modules/character/dto/update-move.dto.ts` — targeted formatting only.
- `odd/tasks/movement-review.md` — completion status, verification evidence, and risks.

## Remaining risks

- `getCharacterMove` still does not verify that the character owns the movement; intentionally deferred by scope.
- The global validation pipe remains unchanged; service-level duplicate checks therefore remain necessary.
- Other movement-content rules outside acquisition and dynamic update validation remain unchanged.
- No automated movement tests currently exist; endpoint and rollback behavior should receive dedicated tests in the testing block.

## Next step

Review the final diff; commit only with explicit authorization.
