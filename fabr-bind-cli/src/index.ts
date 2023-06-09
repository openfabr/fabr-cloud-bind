import { Command, program } from '@commander-js/extra-typings';
import { clientgenHandler } from './command-handlers/clientgen';
import { setenvHandler } from './command-handlers/setenv';
//@ts-ignore
import p from '../package.json';



program
  .version(p.version)
  .description('FABR Cloud Bind CLI - A CLI for generating code that binds code to infrastructure via a secret store. The CLI aims to be automation friendly, for example in CI/CD. The client libs aims to make access easy for app devs.')
  // .action(() => {
  //   console.log('Hello World!');
  // });

program
  .command("client-gen")  
  .argument("[name]", "Name of the generated client code file and class. Defaults to 'MySecrets'")
  .description('Generate client code to access secrets, from a secret store, in your app code.')
  .option("--language <string>", "Language to generate code in")
  .option("--params-file <string>", "relative path to a params.fabr.json file.")
  .option("--secret-service <string>", "A valid secret store service implementation if the app code is to pull values directly from the store service. This adds an external dependency. If not specified, the app code will pull values from environment variables which can be set by the fabr-bind set-env command.")
  .option("--output-path [string]", "the folder to put the generated code files. Files are placed in a folder called `fabr-bind` within this folder. (default) value is `.`, the current working directory")
  .action(clientgenHandler);

program
  .command("set-env")
  .description("Pull values from a secret store and set as environment variables for secure access in your application code via the fabr-bind client lib")
  .option("--params-file <string>", "relative path to a params.fabr.json file.")
  .option("--secret-service <string>", "A valid secret store service implementation if the app code is to pull values directly from the store service. This adds an external dependency. If not specified, the app code will pull values from environment variables which can be set by the fabr-bind set-env command.")
  .action(setenvHandler)

program.parse(process.argv);

