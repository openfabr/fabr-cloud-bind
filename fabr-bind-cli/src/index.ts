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
  .action(clientgenHandler);

program
  .command("set-env")
  .description("Pull values from a secret store and set as environment variables for secure access in your application code via the fabr-bind client lib")
  .option("--params-file <string>", "relative path to a params.fabr.json file.")
  .action(setenvHandler)

program.parse(process.argv);

