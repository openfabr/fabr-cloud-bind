import { Secrets } from "./libs/Secrets";

// This is an example design of a class that will be generated from the fabr.outputs.json file.

export class MySecrets extends Secrets {
      private _api1: string | undefined;
      async api1() {
        if (!this._api1) {
          this._api1 = await this.getSecret("fabrbind/test/myapisecret")
        }
        return this._api1;    
      }
}
