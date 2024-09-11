import { Config } from "../utils";
import * as utils from "../utils";
import { init } from ".";
import { config } from "dotenv";
import { testConfig } from "../test-utils/test-config";

config();

describe("init", () => {
    let config: Config;
    beforeEach(() => {
        jest.clearAllMocks();
        config = testConfig;
        jest.spyOn(utils, "readConfig").mockReturnValue(
            Promise.resolve(config)
        );

        jest.spyOn(process, "exit").mockImplementation((code) => {
            throw new Error(`Process exit with code ${code}`);
        });
    });

    it("should create platform db if it does not exist", async () => {
        const action = init(config);
        await expect(action).rejects.toThrow("Process exit with code 0");
    });
});
