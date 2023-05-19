# Why is the TypeScript source code not here?

TypeScript source files are in the CLI source folder rather than here because it's also used in the CLI logic.
See [/src/libs](../../src/libs) and [/src/secret-services](../../src/secret-services)

This folder is populated by copying the files over during the build step. See the `build` in package.json.

