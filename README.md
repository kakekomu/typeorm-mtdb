# typeorm-multitenant-db

typeorm-based CLI multi-tenant management tool

The main purpose of this library is to efficiently manage migration management and synchronization of tenant DBs.

## Concepts

The multi-tenant scheme adopted here is a `schema-based` scheme where each tenant has its own unique space schema with the same structure.

It assumes a configuration between a single `platform` and multiple `tenants` both of which cannot have tenants.

Each tenant has its own schema, but uses the `master tenant` schema to manage migration.

### Synchronization of tenants' schemas

PLATFORM is basically the same as the usual database management scheme using migration and entity.

However, tenant uses one migratio shared by multiple schemas.

Here, we use the `master tenant` schema to solve this problem.

The master tenant is a single schema and is the basis for all other tenants.

Tenant migrations and entities are first reflected in the `master tenant`, then each tenant schema is synchronized using the command `distribute`.

The same method is used for `revert` and `migrate`.

The master tenant can also be used effectively in a development environment with only one tenant.

You can develop locally against the master tenant and have the production environment point to the normal tenant schema.

### Management of tenants

Specify a specific table in the platform schema and synchronize this record with the tenant schema.
The `spawn` command will generate a schema based on the table.

# Usage

The CLI is available through the `mtdb` command.

Every `<target>` in this document is `platform` or `tenant`. Specify the target on which you want to execute the action.

## Original features

### [`mtdb spawn`](./docs/actions/spawn.md)

Synchronize instances of tenant schema. If record exists `platform`, then creates schema for it.

Any migrations are not to be executed.

If you want to execute them, use `distribute`

### [`mtdb distribute`](./docs/actions/distribute.md)

Distribute migrations to all tenant schemas from master tenant schema.

This is key concept for managing mulit-tenant schema.

When manipulating the schema of tenants, the master tenant schema is manipulated first and then applied with distribute.

After distribute is executed, the master tenant schema and all tenants' schemas are synchronized.

For example, following actions can be performed using this concept

#### To revert a tenant's schema:

```
mtdb revert tenant
mtdb distribute
```

#### To migrate a tenant's schema: 

```
mtdb migrate tenant
mtdb distribute
```


### [`mtdb doctor <target>`](./docs/actions/doctor.md)

Displays the execution status of the target's migrations in yaml format.
When executed for a tenant, it will be displayed along with the presence or absence of each schema.
The results are displayed on standard output.

## Alias

Alias of typeorm commands but works with target you specified.

### [`mtdb generate <target>`](./docs/actions/generate.md)

Generate migrations on target database

Alias of [`typeorm migration:generate`](https://orkhan.gitbook.io/typeorm/docs/migrations#generating-migrations)

### `mtdb migrate <target>`

Run migrations on target database.


### `mtdb revert <target>`

Alias of [`typeorm migration:revert`](https://orkhan.gitbook.io/typeorm/docs/migrations#running-and-reverting-migrations)

### `mtdb create <target>`

Alias of [`typeorm migration:create`](https://orkhan.gitbook.io/typeorm/docs/migrations#creating-a-new-migration)


## [Configuration](./docs/config.md)
Set `mtdb.config.json` in your project root.

You can use [typescript config file](./docs/config.md#config-with-mtdbconfigts) if you want hints with comments.
```jsonc
{
    // Configuration for plaform
    "platform": { 
        "database": "00_provider",
        "entities": "src/db/entities/provider/*.ts",
        "migrations": ["src/db/migrations/provider/*.ts"],
        // `create` `generate` command creates file in this folder
        "migrationOutDir": "src/db/migrations/provider"
    },
    // Configuration for tenant
    "tenant": {
        "masterDbName": "01_consumer",
        // Name of tenant schema will be `02_{relations.tenantTable[relation.keyColumn]}`.
        // If there was record like {'id': 474, 'name': 'Happy tenant'}, schema will be named as `02_474`
        "prefix": "02_",
        "entities": "src/db/entities/consumer/*.ts",
        "migrations": ["src/db/migrations/consumer/*.ts"],
        // `create` `generate` command creates file in this folder
        "migrationOutDir": "src/db/migrations/consumer"
    },
    // Common settings
    "common": {
        // Define what table is used for migration management
        "migrationTableName": "typeorm_migrations"
    },
    // Define relations
    // This setting means that tenants are set in `client` table, and the key is set to `id`.
    // If records exists in, then tenant schema will be created with `spawn` command.
    "relation": {
        "tenantTable": "client",
        "keyColumn": "id"
    }
}
```
