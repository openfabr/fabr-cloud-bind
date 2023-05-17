import { FakeSecretService } from "./fabr-bind/secret-services/FakeSecretService";
import { AwsSecretsManagerService } from "./fabr-bind/secret-services/AwsSecretsManagerService";
// import { IFabrParams } from "./fabr-bind/libs/IFabrParams";
import { MySecrets } from "./fabr-bind/MySecrets";
import {fromEnv, fromSSO } from "@aws-sdk/credential-providers"


const creds = fromSSO({profile: "fabrexp"}); // For local dev, if using SSO

const creds2 = fromEnv(); // In production, use env vars or roles

const fromSecretsManager = new MySecrets(new AwsSecretsManagerService({region: "eu-west-1", credentials: creds})); 

fromSecretsManager.api1().then((value) => {
  console.log(`call1: Value from none secret param 'api1' ${value}`);
});

setTimeout(() => {
  fromSecretsManager.api1().then((value) => {
    console.log(`call2: Value from none secret param 'api1' ${value}`);
  });
  

}, 1000);




