import { FakeSecretService } from "./fabr-bind/secret-services/FakeSecretService";
import { AwsSecretsManagerService } from "./fabr-bind/secret-services/AwsSecretsManagerService";
// import { IFabrParams } from "./fabr-bind/libs/IFabrParams";

import { smSecrets } from "./fabr-bind/smSecrets";
import { psSecrets } from "./fabr-bind/psSecrets";

import {fromEnv, fromSSO } from "@aws-sdk/credential-providers"
import { AwsParameterStoreService } from "./fabr-bind/secret-services/AwsParameterStoreService";


// For local dev, if using SSO. 
// aws sso login --profile <sso profile same>
const creds = fromSSO({profile: "fabrexp"}); 

const creds2 = fromEnv(); // In production, use env vars or roles

const fromSecretsManager = new smSecrets(new AwsSecretsManagerService({region: "eu-west-1", credentials: creds})); 

fromSecretsManager.api1().then((value) => {
  console.log(`call1: Value from secret param 'api1' ${value}`);
});

setTimeout(() => {
  fromSecretsManager.api1().then((value) => {
    console.log(`call2(cached): Value from secret param 'api1' ${value}`);
  });
  

}, 1000);


const fromParameterStore = new psSecrets(new AwsParameterStoreService({region: "eu-west-1", credentials: creds}));



fromParameterStore.api1().then((value) => {
  console.log(`call1: Value from secret param 'api1' ${value}`);
} );

setTimeout(() => {
  fromParameterStore.api1().then((value) => {
    console.log(`call2(cached): Value from secret param 'api1' ${value}`);
  });
  

} , 1000);
