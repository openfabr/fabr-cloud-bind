import { Command, program } from '@commander-js/extra-typings';
import { codegenHandler } from './command-handlers/codegen';
import { setenvHandler } from './command-handlers/setenv';

program
  .version('0.0.1')
  .description('FABR Infra Admin CLI')
  .action(() => {
    console.log('Hello World!');
  });


const codegen = new Command('client-gen');

codegen
  .command("codegen")  
  .description('Generate code from a schema')
  .option("--language <string>", "Language to generate code in")
  .option("--paras-file <string>", "relative path to a params.fabr.json file.")
  .action(codegenHandler);

codegen.parse(process.argv);

const setenv = new Command('setenv');

setenv
  .command("set-env")
  .description("Pull values from a secret store and set as environment variables for secure access in your application code via the fabr-bind client lib")
  .option("--param-file <string>", "relative path to a params.fabr.json file.")
  .action(setenvHandler)

setenv.parse(process.argv);