import { Command, program } from '@commander-js/extra-typings';
import { createDecipheriv } from 'crypto';

program
  .version('0.0.1')
  .description('FABR Infra Admin CLI')
  .action(() => {
    console.log('Hello World!');
  });


const codegen = new Command('codegen');

codegen
  .command("codegen")  
  .description('Generate code from a schema')
  .option("--language <string>", "Language to generate code in")
  .action((options) => {
    console.log(`Hello World! ${options.language}`);
  });

codegen.parse(process.argv);

