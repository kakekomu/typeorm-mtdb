# typeorm-multitenant-db

Multitenant management system based on TypeOrm.

Provides utilities with CLI

- [Prerequisite](#prerequisite)
- [Usage](#usage)
  - [doctor](#mtdb-doctor-target)


### Prerequisite

In this library, there are two concepts: `platform` and `tenant`.

A platform is a parent entity that provides services to multiple tenants.
The database of a platform is basically the same as a regular database, but it has a table with information about the tenants.

There are as many tenants as there are records in the table.
Also, each tenant has a schema with the same structure.

The main purpose of this library is to efficiently manage migration and synchronization in multi-tenant structure.

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
