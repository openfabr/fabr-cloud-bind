import { SSMClientConfig } from "@aws-sdk/client-ssm";
import { IFabrParams } from "../libs/IFabrParams";
import { ISecretStore } from "../libs/ISecretStore";
import { Secrets } from "../libs/Secrets";


export const setenvHandler = (options: any) => {
  console.log('setenvHandler ', options.language);

  // logic to pull secrets from a secret store and set them as environment variables
  // the fabr-bind clint bind to these based on naming convention.

  let secretSeviceInstance;

  import(options.paramsFile).then((paramsFile: IFabrParams) => {
    let region: string | undefined = undefined;
    if (options.secretService) {
      if (options.awsRegion) {
        region = options.awsRegion;
      } else if (process.env.AWS_REGION) {
        region = process.env.AWS_REGION;
      }
    }

    if(!region) {
      throw new Error("Region must be specified. Either --aws-region or AWS_REGION environment variable. Param overrides env var.");
    }

    switch (options.secretService) {
      case "aws-secrets-manager":

        break;
      case "aws-parameter-store":
        import("../secret-services/AwsParameterStoreService").then((secretServiceModule) => {
          const config: SSMClientConfig = {
            region: region
          };
          secretSeviceInstance = new secretServiceModule.AwsParameterStoreService(config);
        });

        break;
      case "azure-key-vault":

    }
  });




}


function setEnvVarsFromSecrets(secretService: ISecretStore, params: IFabrParams) {
  const s = new MySecrets(secretService);

  for (const key in params) {
    if (Object.prototype.hasOwnProperty(key)) {
      const prop = params[key];
      s.setEnvVar(key, prop.value)
    }
  }

}

// becuase secrets is an abstract class we need an concrete implementation to use it.
export class MySecrets extends Secrets {

}