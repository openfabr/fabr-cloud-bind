import { ISecretStore } from "../libs/ISecretStore";
import { GetParameterCommandOutput, SSM, SSMClientConfig } from '@aws-sdk/client-ssm';


export class AwsParameterStoreService implements ISecretStore {
  _ssm: SSM;
  constructor(config: SSMClientConfig) {
    this._ssm = new SSM(config);
  }

  async getSecret(key: string): Promise<string | undefined> {

    const paramOptions = {
      Name: key,
      WithDecryption: true // If the parameter is encrypted, set this to true to decrypt it
    };
    
    let paramValue: string | undefined;

    const p = new Promise<string | undefined>((resolve, reject) => {


    this._ssm.getParameter(paramOptions, (err: any, data?: GetParameterCommandOutput) => {
      if (err) {
        console.error(err);
        reject(err);
      }
    
      paramValue = data?.Parameter?.Value;
      
      resolve(paramValue);
    });

  });

    return p;
  }

}
