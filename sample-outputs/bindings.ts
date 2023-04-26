import outputs from "./fabr.outputs.json";



export interface IFabrOutput {
  [name: string]: {
    value: string,
    isSecret: boolean,
  }
}

const FabrOutputs = outputs as IFabrOutput;


interface ISecretStore {
  getSecret(key: string): string;
}

/**
 * Generated infra stack specific class extend this class and add the binding specific to the infra based on the fabr.outputs.json file.
 */
export abstract class Secrets {

  constructor(private SecretStoreStore: ISecretStore) {
  }

  /**
   * Support binding values directly from a secret store.
   * @param key 
   * @returns 
   */
  getSecretDirect(key: string) {
    //NOTE: this will need an adapter interface to support different secret stores.
    const secretStoreKey = FabrOutputs[key]

    if (!secretStoreKey || !secretStoreKey.isSecret) throw new Error(`Secret ${key} not found in fabr.outputs.json or 'isSecret=false'`);

    const secretValue = this.SecretStoreStore.getSecret(secretStoreKey.value);
    return secretValue;

  }

  /**
   * Support binding values via environment variables.
   * This options grabs the values from environment variable passed into the application at run time.
   * This option enables removing the runtime dependency on a external secret store service increasing reliability
   * However this a trade off against security for actual secret values as env vars are viewable for example via Docker commands
   * @param key key name of a secret in fabr.outputs.json
   * @returns 
   */
  static getSecretEnvVar(key: string) {
    FabrOutputs[key]
    const connectionString = "postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]";
    return connectionString;
  }
}


// This is an example design of a class that will be generated from the fabr.outputs.json file.
export class MySecrets extends Secrets {
  database1() {
    return this.getSecretDirect("database1");
  }
}


export class FakeSecretService implements ISecretStore {
  getSecret(key: string): string {
    const secretDatabaseConnection = `{ //sample data. this what get's pulled from a secret store.
      connectionString: "postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]",
      username: "postgres",
      password: "postgres",
      host: "localhost",
      port: 5432,
      databaseName: "postgres"
    }`

    return secretDatabaseConnection;
  }

}

