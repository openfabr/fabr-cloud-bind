

export interface ISecretStore {
  /**
   * 
   * @param key 
   * @returns secret value if one matching the key is found, otherwise undefined.
   */
  getSecret(key: string): Promise<string | undefined>;
}
