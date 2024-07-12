# typeorm-mtdb
[日本語](./docs/REAMDE-ja.md)

`typeorm-mtdb` is a CLI tool designed to facilitate the management of schema-based multi-tenant databases. This tool is built on TypeORM and provides a mechanism to efficiently manage multiple tenants.

## Overview

`typeorm-mtdb` manages databases using the following three concepts:

1. **Platform DB**
2. **Tenant Class DB**
3. **Tenant Instance DB**

### Platform DB

The Platform DB is treated as a standard TypeORM database. It is used for overall database management and holds common information such as the tenant list.

### Tenant DB

Tenant DBs are managed in a way that each tenant has its own schema. These are further divided into:

-   **Class Schema (Tenant Class DB)**
-   **Instance Schema (Tenant Instance DB)**

### Class Schema and Instance Schema

Tenant entities and migrations are initially executed on the Class Schema. Subsequently, the migration state of the Class Schema is reflected in each Tenant's Instance Schema. This mechanism allows for synchronization of multiple tenant schemas.

## Command Usage Examples

### 1. Generate migration files by comparing the differences in the Tenant Class Schema DB

```sh
mtdb generate tenant
```

### 2. Apply migrations to the Tenant Class Schema

```sh
mtdb migrate tenant
```

### 3. Generate a new Tenant Instance Schema

```sh
mtdb spawn
```

### 4. Distribute and synchronize the migration state of the Tenant Class DB to the Instance DBs

```sh
mtdb distribute
```

### 5. `generate` and `migrate` commands can also be executed on the Platform DB

```sh
mtdb generate platform
mtdb migrate platform
```

## Configuration

Set `mtdb.config.json` in your project root.

```jsonc
{
    // Configuration for the Platform DB
    "platform": {
        "database": "platform",
        "entities": "src/db/entities/platform/*.ts",
        "migrations": ["src/db/migrations/platform/*.ts"],
        // `create` and `generate` commands will create files in this folder
        "migrationOutDir": "src/db/migrations/platform"
    },
    // Configuration for the Tenant DB
    "tenant": {
        "classDbName": "tenant_class",
        // The name of the Tenant Instance DB will be `#{relations.tenantTable[relation.keyColumn]}`.
        // If the tenant ID is my_tenant, a schema named `#my_tenant` will be created.
        "prefix": "#",
        "entities": "src/db/entities/tenant/*.ts",
        "migrations": ["src/db/migrations/tenant/*.ts"],
        // `create` and `generate` commands will create files in this folder
        "migrationOutDir": "src/db/migrations/tenant"
    },
    // Common settings
    "common": {
        // Specify the name of the TypeORM migration table
        "migrationTableName": "typeorm_migrations"
    },
    // Define where the tenant information is located
    // This setting means that `platform.tenants` is the list of tenants, and the `id` will be used as the name of the tenant instance schema.
    "relation": {
        "tenantTable": "tenants",
        "keyColumn": "id"
    }
}
```
