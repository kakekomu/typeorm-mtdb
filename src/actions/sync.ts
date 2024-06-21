import { Config, Target } from "../utils";
import { platformDataSource } from "../sources";

export default async function sync(this: Config, target: Target) {
    const providerConnection = await platformDataSource.then((x) =>
        x.initialize()
    );
}
