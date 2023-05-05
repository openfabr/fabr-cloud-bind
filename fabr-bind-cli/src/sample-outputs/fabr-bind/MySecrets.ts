import { Secrets } from "./libs/Secrets";

// This is an example design of a class that will be generated from the fabr.outputs.json file.

export class MySecrets extends Secrets {
  database1() {
    return this.getSecret("database1");
  }
}