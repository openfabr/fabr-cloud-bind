# FABR Cloud Bind

A tool that helps easily bind applicaton code with backend infrastrcture typically via a secret store like AWS Parameter Store or Hashi Vault.

You provide the CLI a simple config file with parameter key names. It generates a client library in your repo.

- [/fabr-cloud-bind](./fabr-cloud-bind) source code for the CLI. [See README](./fabr-bind-cli/README.md)
- [/sample-app](./sample-app) sample application to end2end test the genrated client lib.

## License

Copyright (C) 2023 Janaka Abeywardhana

This program is free software (all files in this repo): you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program [lisence text available here](./LICENSE.md). If not, see <https://www.gnu.org/licenses/>.
