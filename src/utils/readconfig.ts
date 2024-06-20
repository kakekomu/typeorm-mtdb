import { join } from "path";

type Config = {
  platform: {
    database: string;
    migrations: string[];
    entities: string[];
    tenantEntity: string;
  };
  tenant: {
    prefix: string;
    migrations: string[];
    entities: string[];
    masterDbName: string;
  };
};

export function readConfig() {
  const configfilepath = join(process.cwd(), "mtdb.config.json");
  const config = require(configfilepath);
  return config as Config;
}

readConfig();
