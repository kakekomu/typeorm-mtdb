### `mtdb doctor <target>`

Displays the execution status of the target's migrations in yaml format.
When executed for a tenant, it will be displayed along with the presence or absence of each schema.

The results are displayed on standard output.

So you can save the output to file like this:

```
mtdb doctor tenant >> tenant.yml
```
