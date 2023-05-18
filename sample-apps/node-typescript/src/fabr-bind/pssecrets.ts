import { Secrets } from "./libs/Secrets";

// This is an example design of a class that will be generated from the fabr.outputs.json file.

export class psSecrets extends Secrets {
      private _api1: string | undefined;
      async api1() {
        if (!this._api1) {
          this._api1 = await this.getSecret("/fabrbindcli/test/api2")
        }
        return this._api1;    
      }
}
