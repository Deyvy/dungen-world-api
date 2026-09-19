# Equipment inventory

## Objective

Implement the equipment catalog and character inventory flow without conflating class-eligible creation choices with global equipment, including quantities, weights, tags, and consumable uses.

## Problem

Equipment currently lives directly in `classContent`, and `selectEquipment` replaces all character equipment. The model cannot represent global equipment, quantities, weight, or consumable uses safely.

## Why

Character creation needs class-specific suggestions, while the game universe also needs generic equipment such as weapons, potions, rations, and ammunition. Character state must support inventory updates and consumable use transitions.

## Scope

- Add a canonical global equipment catalog.
- Link class creation options to catalog equipment without duplicating definitions.
- Add character equipment state with quantity, weight-derived inventory data, and consumable uses.
- Preserve replacement semantics for initial equipment selection.
- Add individual inventory add/remove/read/use operations.
- Define structured equipment metadata for weight, tags, and uses per unit.
- Add safe schema migration and 2–3 test catalog records only after implementation is verified.

## Constraints

- Do not invent unrelated Prisma relationships or alter completed domains.
- Reuse existing character and Prisma transaction patterns.
- Do not expose raw Prisma structures when a response mapper is appropriate.
- Current uncommitted user changes must remain intact.
- Database changes must be applied deliberately and only within this equipment scope.

## Authorized scope

- Repository: `dungen-world-api`
- Feature branch: `feature/equipment-inventory`
- Database: read/write equipment schema and test records only; no destructive changes to unrelated data.

## Tasks

- [x] EQ-01 Map current routes, DTOs, Prisma schema, migration state, and response contracts.
- [x] EQ-02 Add global equipment catalog and class-option relationship.
- [x] EQ-03 Add character equipment state for quantity and consumable uses.
- [x] EQ-04 Implement catalog/class availability and character inventory endpoints.
- [x] EQ-05 Implement atomic consumable use rollover and final deletion.
- [x] EQ-06 Add structured metadata mapping for weight, tags, category, and uses per unit.
- [x] EQ-07 Apply schema/database changes and insert 3 safe test equipment records.
- [x] EQ-08 Run formatter, build, unit/e2e checks where applicable, and inspect the diff.
- [x] EQ-09 Commit the completed work unit with a Conventional Commit message.
- [x] EQ-10 Change individual equipment removal to decrement quantity and delete only the final unit.
- [x] EQ-11 Remove unused `code`, `version`, and `slug` fields from classContent and slug from equipment, including migration and API mapping.

## Acceptance criteria

- Generic equipment can exist without a class creation option.
- Class creation suggestions contain only equipment linked to that class.
- Character equipment supports add, remove, replace, quantity, and read operations.
- Consumable use decrements the current unit, rolls quantity when exhausted, and deletes the state when the final unit is consumed.
- Multi-table operations are atomic.
- Weight and tags are represented structurally rather than parsed from description text.
- Existing non-equipment behavior and user changes are preserved.

## Applicable checks

- `npm run format`
- `npm run build`
- `npm test`
- `npm run test:e2e`
- Read-only database verification before and after the scoped seed.

## Progress

- Route: delegated direct implementation after repository/schema exploration.
- TDD: disabled by project configuration; ordinary functional checks required.
- Delivery strategy: single-pr.
- Current task: commit authorized by the user.

## Verification evidence

- `npm exec --yes --package=prisma@7.9.1 -- prisma format --schema prisma/schema.prisma` — passed.
- `npm exec --yes --package=prisma@7.9.1 -- prisma validate --schema prisma/schema.prisma` — passed.
- `npm exec --yes --package=prisma@7.9.1 -- prisma generate --schema prisma/schema.prisma` — passed.
- `npm run build` — passed.
- `npm test -- --runInBand` — no tests found (repository has no unit spec files).
- `npm run test:e2e -- --runInBand` — blocked before test execution because Jest cannot resolve Prisma's generated `.js` imports from TypeScript (`src/generated/prisma/client.ts`); no live database mutation was attempted.
- `npm run build` — passed in parent spot check after the correction.
- `npm exec --yes --package=prisma@7.9.1 -- prisma migrate deploy --schema prisma/schema.prisma` — applied migration `20260919180000_remove_unused_content_identifiers`.
- Live read-only verification — requested columns are absent from `class_content` and `equipment`; all three seeded equipment rows and the class link remain intact.
- The original live data inspection found `class_content` equipment ids 7 (grouping/instruction) and 10 (item), with no canonical ids to link. The migration therefore creates the catalog and nullable link without inventing records or deleting legacy rows.
- `npm exec --yes --package=prisma@7.9.1 -- prisma migrate deploy --schema prisma/schema.prisma` — applied migration `20260919170000_equipment_inventory`.
- Live database verification — created/updated `Espada Larga`, `Ración`, and `Flechas` in `equipment`; linked `class_content.id=10` to `equipment.id=1`; preserved grouping row `class_content.id=7` unlinked.
- `npm run build` — passed in parent spot check after mapper normalization.
- Live read-only verification — `removeEquipment` currently deletes the complete characterEquipment row; the requested behavior is quantity decrement followed by final-row deletion.
- Live read-only verification — classContent currently has populated code/version values, and seeded equipment has slugs; values are not referenced by application modules and require an explicit destructive schema migration.
- `prisma/migrations/20260919180000_remove_unused_content_identifiers/migration.sql` — created after the applied equipment migration; drops only the requested class_content columns/unique index and equipment slug column/unique index without deleting rows. Applied successfully.
- Correction implementation — individual equipment removal now decrements quantity above one and deletes only the final row; consumable use rollover is unchanged.
- `npm exec --yes --package=prisma@7.9.1 -- prisma format --schema prisma/schema.prisma` — passed.
- `npm exec --yes --package=prisma@7.9.1 -- prisma validate --schema prisma/schema.prisma` — passed.
- `npm exec --yes --package=prisma@7.9.1 -- prisma generate --schema prisma/schema.prisma` — passed.
- `npm run build` — passed.
- `npm test -- --runInBand` — no tests found (repository has no unit spec files; command exits 1).
- `npm run test:e2e -- --runInBand` — blocked before test execution because Jest cannot resolve Prisma's generated `.js` imports from TypeScript (`src/generated/prisma/client.ts`); no live database mutation was attempted.

## Risks

- Existing grouping row `class_content.id=7` remains intentionally unlinked and must not become inventory.
- Removing code/version/slug is irreversible at the schema level; the current values were inspected before the requested removal.
- Existing package changes point Prisma CLI at a platform CLI. The repository build required a config compatibility adjustment and the e2e Jest harness still has the generated-client module-resolution issue.

## Commit evidence
- Included in the authorized work-unit commit `feat: add equipment inventory and character bonds`.

## Next step

The equipment implementation, migrations, seed data, and verification are complete; commit is authorized by the user.
