import { ISecretStore } from "./ISecretStore";

// export type ISecretOptions = {
//   useEnvVars?: boolean,
// }

/**
 * Generated infra stack specific class extend this class and add the binding specific to the infra based on the fabr.outputs.json file.
 */
export abstract class Secrets {

  useEnvVars: boolean;
  
  
  constructor(private SecretStoreService?: ISecretStore) {
    this.useEnvVars = SecretStoreService ? false : true;
  }

   protected getSecret(key: string) {
    if (this.useEnvVars) {
      const envName = `FI_PARAM_${key.toUpperCase()}`;
      return this.getEnvVar(envName);
    } else {
      return this.getSecretDirect(key);
    }
  }

  /**
   * Support binding values directly from a secret store.
   * @param secretStorekey - the key for the secret in the secret store. This the 'value' when 'isSecret=true' in 'param.fabr.json'
   * @returns the secret returned from the secret store.
   */
  private getSecretDirect(secretStorekey: string) {
    
    if (!this.SecretStoreService)
      throw new Error("'SecretStoreService' argument not set");
    
    const secretValue = this.SecretStoreService.getSecret(secretStorekey);
    return secretValue;

  }

  /**
   * Support binding values via environment variables.
   * This options grabs the values from environment variable passed into the application at run time.
   * This option enables removing the runtime dependency on a external secret store service increasing reliability
   * However this a trade off against security for actual secret values as env vars are viewable for example via Docker commands
   * @param envVar the name of the environment variable. 
   * @returns
   */
  private getEnvVar(envVar: string): string | undefined {
    
    const varName = envVar.toUpperCase();

    //const connectionString = "postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]";
    return process.env[varName];
  }

  /**
   * Sets an environment variable.
   * @param envVar name of the environment variable to set.
   * @param value the value to set the environment variable to.
   * @returns the name of the environment variable. Always converted to uppercase.
   */
  setEnvVar(envVar: string, value: string): string {
    const varName = envVar.toUpperCase();
    process.env[varName] = value;
    return varName;
  }
}
