import { Secrets } from "./libs/Secrets";

export class smSecrets extends Secrets {
      private _api1: string | undefined;
      async api1() {
        if (!this._api1) {
          this._api1 = await this.getSecret("fabrbind/test/myapisecret")
        }
        return this._api1;    
      }
}
