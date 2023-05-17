import { Command, program } from '@commander-js/extra-typings';
import { clientgenHandler } from './command-handlers/clientgen';
import { setenvHandler } from './command-handlers/setenv';
//@ts-ignore
import p from '../package.json';



program
  .version(p.version)
  .description('FABR Cloud Bind CLI - A CLI for generating code that binds code to infrastructure via a secret store.')
  // .action(() => {
  //   console.log('Hello World!');
  // });

program
  .command("client-gen")  
  .description('Generate client code to accessing infrastrcutre secrets, from a secret store, in your app code.')
  .option("--language <string>", "Language to generate code in")
  .option("--params-file <string>", "relative path to a params.fabr.json file.")
  .option("--secret-service <string>", "A valid secret store service implementation if the app code is to pull values directly from the store service. This adds an external dependency. If not specified, the app code will pull values from environment variables which can be set by the fabr-bind set-env command.")
  .action(clientgenHandler);

program
  .command("set-env")
  .description("Pull values from a secret store and set as environment variables for secure access in your application code via the fabr-bind client lib")
  .option("--params-file <string>", "relative path to a params.fabr.json file.")
  .option("--secret-service <string>", "A valid secret store service implementation if the app code is to pull values directly from the store service. This adds an external dependency. If not specified, the app code will pull values from environment variables which can be set by the fabr-bind set-env command.")
  .action(setenvHandler)

program.parse(process.argv);

