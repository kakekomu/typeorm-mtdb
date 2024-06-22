# typeorm-multitenant-db

typeormベースのCLIマルチテナント管理ツール

本ライブラリの主な目的はマイグレーション管理とテナントDBの同期を効率的に管理することにあります。

## コンセプト

ここで採用するマルチテナントの方式は、各テナントがそれぞれ同じ構造の固有空間のスキーマをもつ`スキーマベース`の方式です。

単一の`platform`と複数の`tenant`両者間の構成を想定しており、テナントがテナントを持つことはできません。

テナントはそれぞれのスキーマを保有しますが、マイグレーションを管理するために`マスターテナント`スキーマを用います。

### テナントのスキーマを同期させる方法

platformは通常のmigrationとentityを使うデータベースの管理方式と基本的に同じです。

しかし、tenantは１つのmigratioを複数のスキーマで共有して使います。

ここでは、`マスターテナント`スキーマを用いて解決します。

マスターテナントは単一スキーマで、他のすべてのテナントの基準となります。

テナントのマイグレーションやエンティティをまず`マスターテナント`に反映したあと、`distribute` というコマンドを利用してそれぞれのテナントスキーマを同期させます。

`revert`や`migrate`においても同じやり方で管理します。

マスターテナントはテナントが一個しかない開発環境でも有効に活用できます。

ローカルではマスターテナントに対して開発を行い、製品環境では通常のテナントスキーマを向けさせることができます。

### テナントを管理する方法

platformスキーマに特定のテーブルを指定して、このレコードとテナントスキーマを同期させます。
`spawn`コマンドを利用すると、テーブルをもとにスキーマが生成されます。

# Contents 
- [コンセプト](#コンセプト)
- [Usage](#usage)
  - [doctor](#mtdb-doctor-target)


## Usage

The CLI is available through the `mtdb` command.

Every `<target>` in this document is `platform` or `tenant`. Specify the target on which you want to execute the action.

## オリジナル機能

### [`mtdb spawn`](./actions/spawn-ja.md)

テナントスキーマとプラットフォームのテナントレコードを同期させます。
必要に応じてスキーマを作成します。

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


## Configuration
Set `mtdb.config.json` in your project root.
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
