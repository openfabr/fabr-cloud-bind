import { ISecretStore } from "../libs/ISecretStore";

import { GetSecretValueCommandOutput, SecretsManager, SecretsManagerClientConfig } from "@aws-sdk/client-secrets-manager";


export class AwsSecretsManagerService implements ISecretStore {
  _secretsManager: SecretsManager;
  /**
   * 
   * @param options SecretsManagerClientConfig passed directly to the SecretsManager constructor
   * 
   * AWS SDK v3 @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-secrets-manager/
   */
  constructor(config: SecretsManagerClientConfig) {
    this._secretsManager = new SecretsManager(config);
  }

  async getSecret(key: string): Promise<string | undefined> {

    // default AWS stage labels AWSCURRENT and AWSPREVIOUS
    const secretVersion = "AWSCURRENT";

    let paramValue: string | undefined;

    const result = new Promise<string | undefined>((resolve, reject) => { 

    this._secretsManager.getSecretValue({ SecretId: key, VersionStage: secretVersion, }, (err: any, data?: GetSecretValueCommandOutput) => {
      if (err) {
        console.error(`key: ${key}`, err);
        reject(err);
      }
      
      paramValue = data?.SecretString;

      resolve(paramValue);
    });

  });

    return result;
  }


}
