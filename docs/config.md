# Configuration

### Config with `mtdb.config.json`

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

### Config with `mtdb.config.ts`

```ts
import { MtdbConfig } from "typeorm-mtdb";

const config: MtdbConfig = {
    platform: {
        database: "00_provider",
        migrations: ["dist/temp/migrations/provider/*.js"],
        migrationOutDir: "src/temp/migrations/provider",
        entities: "dist/temp/entities/provider/*.js",
    },
    tenant: {
        masterDbName: "01_consumer",
        prefix: "02_",
        migrations: ["dist/temp/migrations/consumer/*.js"],
        migrationOutDir: "src/temp/migrations/consumer",
        entities: "dist/temp/entities/consumer/*.js",
    },
    common: {
        migrationTableName: "typeorm_migrations",
    },
    relation: {
        tenantTable: "client",
        keyColumn: "id",
    },
};

export default config;
```
