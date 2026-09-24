# Class damage dice

## Objective

Store the damage die value for each class in `classes.damage_dice`.

## Problem and rationale

Classes need a persistent numeric damage-die value. The requested seed values are class 1 = 10 and class 2 = 4.

## Scope

- Add the Prisma field `damageDice` mapped to `damage_dice` on `classes`.
- Add an append-only Prisma migration that backfills the requested values for class IDs 1 and 2.
- Do not change API mappers or unrelated class data.

## Authorized scope

- `prisma/schema.prisma`
- `prisma/migrations/*_add_class_damage_dice/migration.sql`
- `odd/tasks/class-damage-dice.md`

## Tasks

- [x] CD-001 Add the schema field and migration backfill.
- [x] CD-002 Validate the schema, generate the client, and inspect the migration diff.

## Acceptance criteria

- `classes` has a numeric `damage_dice` column represented by Prisma as `damageDice`.
- Class ID 1 has value 10 and class ID 2 has value 4 after migration.
- Existing class rows remain valid and no unrelated files are changed.

## Checks

- `npx prisma validate`
- `npx prisma generate`
- `npx prisma migrate status`
- Structural readback of the schema and migration.

## Route

- CD-001: delegated direct writer, because the authorized change spans the Prisma schema and migration.
- CD-002: delegated direct verification after implementation.

## Progress

- Branch created: `feature/class-damage-dice`.
- CD-001 completed: `damageDice` maps to `damage_dice`; class 1 is backfilled to 10 and class 2 to 4.
- CD-002 completed structurally and with `git diff --check`.
- Prisma CLI checks are pending environment repair because installed Prisma 8.0.0-rc.15 rejects the repository's commands and differs from `@prisma/client` 7.10.0.
- Work-unit commit pending.
