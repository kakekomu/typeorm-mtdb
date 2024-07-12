# typeorm-mtdb

`typeorm-mtdb`は、スキーマベースのマルチテナントデータベースを簡単に管理するためのCLIツールです。このツールはTypeORMをベースにしており、複数のテナントを効率的に管理するための仕組みを提供します。

## 概要

`typeorm-mtdb`は、以下の3つの概念を使ってデータベースを管理します：

1. **プラットフォームDB**
2. **テナントクラスDB**
3. **テナントインスタンスDB**

### プラットフォームDB
プラットフォームDBは、標準的なTypeORMデータベースとして扱われます。これは、全体のデータベース管理に使用され、テナントリストなどの共通情報を保持します。

### テナントDB
テナントDBは、各テナントが独自のスキーマを持つ形で管理されます。これをさらに以下の2つに分けて管理します：

- **クラススキーマ（テナントクラスDB）**
- **インスタンススキーマ（テナントインスタンスDB）**

### クラススキーマとインスタンススキーマ
テナントのエンティティとマイグレーションは、まずクラススキーマに対して実行されます。その後、クラススキーマのマイグレーション状態が各テナントのインスタンススキーマに反映されます。この仕組みにより、複数のテナントスキーマを同期させることができます。

## コマンドの使用例

### 1. テナントクラススキーマDBの差分を比較してマイグレーションファイルを生成
```sh
mtdb generate tenant
```

### 2. テナントクラススキーマにマイグレーションを反映
```sh
mtdb migrate tenant
```

### 3. 新しいテナントインスタンススキーマを生成
```sh
mtdb spawn
```

### 4. テナントクラスDBのマイグレーション状態をインスタンスDBに配布して同期
```sh
mtdb distribute
```

### 5. `generate`と`migrate`はプラットフォームDBに対しても実行可能
```sh
mtdb generate platform
mtdb migrate platform
```

## Configuration
Set `mtdb.config.json` in your project root.
```jsonc
{
    // プラットフォームDBの設定
    "platform": { 
        "database": "platform",
        "entities": "src/db/entities/platform/*.ts",
        "migrations": ["src/db/migrations/platform/*.ts"],
        // `create` `generate` コマンドはここにファイルを生成します
        "migrationOutDir": "src/db/migrations/platform"
    },
    // テナントDBの設定
    "tenant": {
        "classDbName": "tenant_class",
        // テナントインスタンスDBの名前は `#{relations.tenantTable[relation.keyColumn]}`になります。
        // テナントのidがmy_tenantである場合、`#my_tenant`というスキーマが作成されます。
        "prefix": "#",
        "entities": "src/db/entities/tenant/*.ts",
        "migrations": ["src/db/migrations/tenant/*.ts"],
        // `create` `generate` command creates file in this folder
        "migrationOutDir": "src/db/migrations/tenant"
    },
    // 共通設定
    "common": {
        // typeormのマイグレーションテーブルの名前を指定します。
        "migrationTableName": "typeorm_migrations"
    },
    // テナントの情報がどこにあるかを定義します。
    // この設定では`platform.tenants`がテナントのリストであり、テナントインスタンススキーマの名前としてidを使うことを意味しています。
    "relation": {
        "tenantTable": "tenants",
        "keyColumn": "id"
    }
}
```
