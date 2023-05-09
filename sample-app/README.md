# Sample App

Used for end2end testing the fabr-bind-cli.

- `node ../../fabr-bind-cli/dist/index.js client-gen --language=typescript` Run the `client-gen` CLI in the `src` to add the generated secret binding class. Then reference it in `index.ts`.

- `npm i && npm run build && node dist/index.js` Build and run the sample app.
