import { DataSource } from "typeorm";
import { MySqlContainer, StartedMySqlContainer } from "@testcontainers/mysql";
import { checkDatabase } from "typeorm-extension";

describe("hello", () => {
    let dataSource: DataSource;
    let container: StartedMySqlContainer;

    beforeAll(async () => {
        container = await new MySqlContainer().start();
        const ds = new DataSource({
            type: "mysql",
            host: container.getHost(),
            port: container.getPort(),
            database: "test",
            username: container.getUsername(),
            password: container.getUserPassword(),
        });
        dataSource = await ds.initialize();
    }, 1000 * 60 * 5);

    it("should initialized", async () => {
        expect(dataSource.isInitialized).toBeTruthy();
    });

    it("has a database", async () => {
        expect(await checkDatabase({ dataSource })).toBeTruthy();
    });

    afterAll(async () => {
        await dataSource.destroy();
        await container.stop();
    });
});
