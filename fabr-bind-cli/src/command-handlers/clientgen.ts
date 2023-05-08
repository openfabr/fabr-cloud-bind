import Handlebars from "handlebars";
import fs from "fs";
import { error } from "console";

export const clientgenHandler = (options: any) => {
  console.log(`clientgenHandler fired --language=${options.language} --params-file=${options.paramsFile}`);

  // Logic for taking the fabr.outputs.json genrate code using handlebarjs

  // copy ./libs-src to ./libs
  // run handlebars template for the language specified
  // output to a folder in the root of the project called ./fabr-bind

    const data = fs.readFileSync("./client-templates/typescript/MySecrets.ts.tmpl", "utf8");
    if (!data) throw new Error("Could not read template file")

    const template = Handlebars.compile(data);
    const result = template({ secrets: ["database1", "database2"] });
    console.log(result);
    fs.writeFileSync("./client-templates/typescript/MySecrets.ts", result, "utf8");

}

/**
 * 
 * @param filename patch to a file
 */
function readTemplateFile(filename: string): string {
  // read in the template file
  // return the template string
  let result = fs.readFileSync(filename, 'utf8')
  return result;
}

async function writeTemplateFile(filename: string) {
  // write the template file to the ./fabr-bind folder
  
}