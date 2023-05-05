

export interface ISecretStore {
  getSecret(key: string): string;
}
