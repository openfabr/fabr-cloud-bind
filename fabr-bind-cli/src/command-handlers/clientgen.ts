import Handlebars from "handlebars";
import fs from "fs";
import path from 'path';
//import p from './params.fabr.json'
import { IFabrParams } from "../libs/IFabrParams";

export const clientgenHandler = (nameArg: string | undefined, options: any) => {
  console.log(`clientgenHandler fired --language=${options.language} --params-file=${options.paramsFile}`);

  // Logic for taking the fabr.outputs.json genrate code using handlebarjs

  // copy ./libs-src to ./libs
  // run handlebars template for the language specified
  // output to a folder in the root of the project called ./fabr-bind

  if (!options.paramsFile) throw new Error("'--params-file' option is required");
  if (!options.language) throw new Error("'--language' option is required");

  const className = nameArg || "MySecrets";

  const cwd = process.cwd();
  const src = path.dirname(__dirname);
  const destBase = options.outputPath ? path.join(cwd, options.outputPath) : cwd;

  const fabrfoldername = options.language === "python" ? "fabr_bind" : "fabr-bind"; //TODO: hack, make fabr-bind folder part of the libs-src folder structure
  
  const dest = `${destBase}/${fabrfoldername}`;

  console.log(`cwd: ${cwd}`)
  console.log(`src: ${src}`)
  console.log(`dest: ${dest}`)

  copyFolderRecursive(`${src}/libs-src/${options.language}`, `${dest}`)
  //copyFolderRecursive(`${src}/secret-services-src/${options.language}`, `${dest}/secret-services`)

  const data = fs.readFileSync(`${src}/client-templates/${options.language}/MySecrets.tmpl`, "utf8");
  if (!data) throw new Error("Could not read template file")

  const template = Handlebars.compile(data);

  loadParamsData(path.join(cwd , options.paramsFile)).then((params) => {
    console.log("params>> ", params);
    
    const result = template({params: params, className: className}); //TODO: move the isSecrets filter out of the template into code here.
    console.log(result);
    
    const fileExt = langFileExtension(options.language);

    fs.writeFileSync(`${dest}/${className}.${fileExt}`, result, "utf8");
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

function langFileExtension(language: string): string {
  switch (language) {
    case "typescript":
      return "ts";
    case "python":
      return "py";
    case "csharp":
      return "cs";
    case "java":
      return "java";
    case "go":
      return "go";
    case "rust":
      return "rs";
    case "ruby":
      return "rb";
    case "php":
      return "php";
    default:
      throw new Error(`Unsupported language '${language}'`);
  }
}
