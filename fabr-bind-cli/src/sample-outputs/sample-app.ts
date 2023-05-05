import { FakeSecretService } from "./fabr-bind/libs/FakeSecretService";
// import { IFabrParams } from "./fabr-bind/libs/IFabrParams";
import { MyParams, MySecrets } from "./fabr-bind";

//example of instantiating the generated class.
const db1ConnectionString = new MySecrets(new FakeSecretService()).database1(); // returns the secret value from the secret store.

console.log(`Value from 'database1': ${db1ConnectionString}`)

const api1Endpoint = MyParams.api1;

console.log(`Value from none secret param 'api1' ${api1Endpoint}`);