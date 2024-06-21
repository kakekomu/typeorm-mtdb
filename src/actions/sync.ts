import { Config } from "../utils";
import { platformDataSource } from "../sources";

export default async function sync(this: Config) {
    const providerConnection = await platformDataSource.then((x) =>
        x.initialize()
    );
}
