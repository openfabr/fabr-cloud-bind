import { ISecretStore } from "./ISecretStore";




export class FakeSecretService implements ISecretStore {
  getSecret(key: string): string {
    const secretDatabaseConnection = `{ //sample data. this what get's pulled from a secret store.
      connectionString: "postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]",
      username: "postgres",
      password: "postgres",
      host: "localhost",
      port: 5432,
      databaseName: "postgres"
    }`;

    return secretDatabaseConnection;
  }

}
