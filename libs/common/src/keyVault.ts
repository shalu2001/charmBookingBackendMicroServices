import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

let secretClient: SecretClient | null = null;
const secretsCache = new Map<string, string>();
let isInitialized = false;

/**
 * Initialize Azure Key Vault client
 * Uses DefaultAzureCredential which supports:
 * - Azure CLI authentication (az login)
 * - Environment variables (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET)
 * - Managed Identity (when deployed to Azure)
 */
export const initializeKeyVault = (): void => {
  const vaultUrl = process.env.AZURE_KEY_VAULT_URL;

  if (!vaultUrl) {
    console.warn(
      'AZURE_KEY_VAULT_URL not set. Will use environment variables only.',
    );
    isInitialized = true;
    return;
  }

  try {
    const credential = new DefaultAzureCredential();
    secretClient = new SecretClient(vaultUrl, credential);
    console.log(`✓ Connected to Azure Key Vault: ${vaultUrl}`);
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize Azure Key Vault:', error);
    throw new Error(
      `Key Vault initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Load all secrets from Azure Key Vault into cache
 * This should be called once at application startup
 */
export const loadAllSecrets = async (): Promise<void> => {
  if (!isInitialized) {
    initializeKeyVault();
  }

  if (!secretClient) {
    console.log('Key Vault not configured. Using environment variables only.');
    return;
  }

  try {
    console.log('Loading secrets from Azure Key Vault...');
    let secretCount = 0;
    // List all secrets from Key Vault
    for await (const secretProperties of secretClient.listPropertiesOfSecrets()) {
      if (secretProperties.enabled && secretProperties.name) {
        try {
          const secret = await secretClient.getSecret(secretProperties.name);
          if (secret.value) {
            // Convert Key Vault naming convention (e.g., "DB-HOST") to env var convention (e.g., "DB_HOST")
            const envVarName = secretProperties.name.replace(/-/g, '_');
            secretsCache.set(envVarName, secret.value);
            secretCount++;
          }
        } catch (error) {
          console.warn(
            `Failed to load secret "${secretProperties.name}":`,
            error instanceof Error ? error.message : 'Unknown error',
          );
        }
      }
    }

    console.log(`✓ Loaded ${secretCount} secrets from Azure Key Vault`);
  } catch (error) {
    console.error('Failed to load secrets from Key Vault:', error);
    throw new Error(
      `Failed to load secrets: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Get a secret value from Azure Key Vault cache or environment variables
 * Priority: Key Vault cache > Environment variables
 *
 * @param name - Secret name (use underscore convention, e.g., "DB_HOST")
 * @returns Secret value or undefined if not found
 */
export const getSecret = (name: string): string | undefined => {
  // First, check Key Vault cache
  if (secretsCache.has(name)) {
    return secretsCache.get(name);
  }

  // Fallback to environment variable
  return process.env[name];
};

/**
 * Get a secret value and throw error if not found
 *
 * @param name - Secret name (use underscore convention, e.g., "DB_HOST")
 * @returns Secret value
 * @throws Error if secret is not found
 */
export const getRequiredSecret = (name: string): string => {
  const value = getSecret(name);
  if (!value) {
    throw new Error(
      `Required secret "${name}" is missing from both Azure Key Vault and environment variables`,
    );
  }
  return value;
};

/**
 * Check if Key Vault is initialized
 */
export const isKeyVaultInitialized = (): boolean => {
  return isInitialized;
};

/**
 * Get all loaded secrets (for debugging purposes)
 * WARNING: Use with caution as this exposes secret names
 */
export const getLoadedSecretNames = (): string[] => {
  return Array.from(secretsCache.keys());
};
