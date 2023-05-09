import { FakeSecretService } from "./fabr-bind/libs/FakeSecretService";
// import { IFabrParams } from "./fabr-bind/libs/IFabrParams";
import { MySecrets } from "./fabr-bind/MySecrets";

//example of instantiating the generated class.
const mysecrets = new MySecrets(new FakeSecretService()); // returns the secret value from the secret store.

console.log(`Value from 'database1': ${mysecrets.database2()}`)

const api1Endpoint = mysecrets.api1();

console.log(`Value from none secret param 'api1' ${api1Endpoint}`);