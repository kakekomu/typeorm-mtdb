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


### `mtdb doctor <target>`

Displays the execution status of the target's migrations in yaml format.
When executed for a tenant, it will be displayed along with the presence or absence of each schema.

The results are displayed on standard output.

So you can save the output to file like this:

```
mtdb doctor tenant >> tenant.yml
```
