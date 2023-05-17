import Handlebars from "handlebars";
import fs from "fs";
import path from 'path';
//import p from './params.fabr.json'
import { IFabrParams } from "../libs/IFabrParams";

export const clientgenHandler = (options: any) => {
  console.log(`clientgenHandler fired --language=${options.language} --params-file=${options.paramsFile}`);

  // Logic for taking the fabr.outputs.json genrate code using handlebarjs

  // copy ./libs-src to ./libs
  // run handlebars template for the language specified
  // output to a folder in the root of the project called ./fabr-bind

  const cwd = process.cwd();
  const src = path.dirname(__dirname);
  const dest = `${cwd}/fabr-bind`;

  console.log(`cwd: ${cwd}`)
  console.log(`src: ${src}`)

  copyFolderRecursive(`${src}/libs-src/${options.language}`, `${dest}/libs`)
  copyFolderRecursive(`${src}/secret-services-src/${options.language}`, `${dest}/secret-services`)

  const data = fs.readFileSync(`${src}/client-templates/${options.language}/MySecrets.tmpl`, "utf8");
  if (!data) throw new Error("Could not read template file")

  const template = Handlebars.compile(data);

  loadParamsData(path.join(cwd , options.paramsFile)).then((params) => {
    console.log("params>> ", params);
    
    const result = template({params: params}); //TODO: move the isSecrets filter out of the template into code here.
    console.log(result);
    
    fs.writeFileSync(`${dest}/MySecrets.ts`, result, "utf8");
  }).catch((err) => {
    console.error(err);
  });

}


async function loadParamsData(paramsFilePath: string): Promise<IFabrParams> {
  const { default: paramsData } = await import(paramsFilePath);
  return paramsData as IFabrParams;
}


function copyFolderRecursive(source: string, destination: string): void {
  // Check if source exists and is a directory
  if (!fs.existsSync(source) || !fs.lstatSync(source).isDirectory()) {
    throw new Error(`Source folder '${source}' does not exist or is not a directory`);
  }

  // Check if destination exists and is a directory
  if (!fs.existsSync(destination) || !fs.lstatSync(destination).isDirectory()) {
    //throw new Error(`Destination folder '${destination}' does not exist or is not a directory`);
    fs.mkdirSync(destination, { recursive: true });
  }

  // Read the contents of the source folder
  const files = fs.readdirSync(source);

  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      // Recursively copy subdirectories
      copyFolderRecursive(sourcePath, destinationPath);
    } else {
      // Copy files
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}
