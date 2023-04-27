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

  useEnvVars: boolean = false;

  constructor(private SecretStoreService?: ISecretStore, options:any = {}) {
    this.useEnvVars = options.useEnvVars || false;
  }

  protected getSecret(key: string): string {
    if (this.useEnvVars) {
      return this.getSecretEnvVar(key);
    } else {
      return this.getSecretDirect(key);
    }
  }

  /**
   * Support binding values directly from a secret store.
   * @param key 
   * @returns 
   */
  private getSecretDirect(key: string):string {
    //NOTE: this will need an adapter interface to support different secret stores.
    const secretStoreKey = FabrOutputs[key]

    if (!this.SecretStoreService) throw new Error("'SecretStoreService' argument not set");
    if (!secretStoreKey || !secretStoreKey.isSecret) throw new Error(`Secret ${key} not found in fabr.outputs.json or 'isSecret=false'`);

    const secretValue = this.SecretStoreService.getSecret(secretStoreKey.value);
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
   private getSecretEnvVar(key: string):string {
    //FabrOutputs[key]
    const varName = `FI_BIND_${key.toUpperCase()}`;
    const connectionString = "postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]";
    return connectionString;
  }
}


// This is an example design of a class that will be generated from the fabr.outputs.json file.
export class MySecrets extends Secrets {
  database1() {
    return this.getSecret("database1");
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

new MySecrets(new FakeSecretService()).database1(); // returns the secret value from the secret store.
