# Azure Key Vault Integration - Usage Guide

## Overview

Your application now supports loading secrets from Azure Key Vault with automatic fallback to environment variables. This provides a secure way to manage sensitive configuration in production while maintaining local development flexibility.

## How It Works

1. **Secret Loading Priority:**
   - **Azure Key Vault** (preferred): Secrets are loaded from your Key Vault
   - **Environment Variables** (fallback): If Key Vault is not available, uses `.env` file or system environment variables

2. **Automatic Validation:**
   - When `getConfig()` is called, it validates that all required secrets are present
   - If any required secret is missing, the application **will not start** and shows a detailed error message

## Setup Instructions

### 1. Configure Your Key Vault URL

Add to your `.env` file:
```bash
AZURE_KEY_VAULT_URL=https://your-key-vault-name.vault.azure.net/
```

### 2. Add Secrets to Azure Key Vault

Secrets in Azure Key Vault should use **hyphens** instead of underscores. The system automatically converts them:

| Key Vault Secret Name | Environment Variable | Description |
|-----------------------|---------------------|-------------|
| `DB-HOST` | `DB_HOST` | Database host |
| `DB-USERNAME` | `DB_USERNAME` | Database username |
| `DB-PASSWORD` | `DB_PASSWORD` | Database password |
| `JWT-SECRET` | `JWT_SECRET` | JWT signing secret |
| `JWT-EXPIRATION` | `JWT_EXPIRATION` | JWT token expiration |
| `PH-MERCHANT-ID` | `PH_MERCHANT_ID` | PayHere merchant ID |
| `PH-MERCHANT-SECRET` | `PH_MERCHANT_SECRET` | PayHere merchant secret |
| `PH-APP-ID` | `PH_APP_ID` | PayHere app ID |
| `PH-APP-SECRET` | `PH_APP_SECRET` | PayHere app secret |
| `FRONTEND-URL` | `FRONTEND_URL` | Frontend URL |
| `BACKEND-URL` | `BACKEND_URL` | Backend URL |

**Example: Adding a secret via Azure CLI**
```bash
az keyvault secret set --vault-name your-key-vault-name --name DB-HOST --value "your-database-host"
az keyvault secret set --vault-name your-key-vault-name --name DB-USERNAME --value "your-username"
az keyvault secret set --vault-name your-key-vault-name --name DB-PASSWORD --value "your-password"
```

### 3. Authentication Methods

The system uses `DefaultAzureCredential` which supports multiple authentication methods (in order):

#### A. Azure CLI (for local development - **RECOMMENDED**)
```bash
az login
```
✅ This is already configured since you've logged in

#### B. Environment Variables
```bash
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
```

#### C. Managed Identity (for Azure deployments)
Automatically works when deployed to Azure services (App Service, Container Apps, etc.)

## Usage in Code

### Application Startup (Already Implemented)

All your `main.ts` files now automatically:
1. Load all secrets from Key Vault
2. Validate required secrets
3. Exit with error if secrets are missing

```typescript
async function bootstrap() {
  // Load secrets from Azure Key Vault
  await loadAllSecrets();
  
  // Get validated configuration
  const config = getConfig();
  
  // Start application...
}
```

### Using Secrets Directly

If you need to access secrets in other parts of your code:

```typescript
import { getSecret, getRequiredSecret } from '@charmbooking/common';

// Get a secret (returns undefined if not found)
const apiKey = getSecret('SOME_API_KEY');

// Get a required secret (throws error if not found)
const criticalSecret = getRequiredSecret('CRITICAL_SECRET');
```

## Running Your Application

### Local Development (with Azure Key Vault)

1. Ensure you're logged in to Azure CLI:
   ```bash
   az login
   ```

2. Set your Key Vault URL in `.env`:
   ```bash
   AZURE_KEY_VAULT_URL=https://your-key-vault-name.vault.azure.net/
   ```

3. Start your services:
   ```bash
   pnpm run start:dev
   ```

### Local Development (without Azure Key Vault)

If you don't want to use Key Vault locally:

1. **Don't set** `AZURE_KEY_VAULT_URL` in your `.env`
2. Ensure all required secrets are in your `.env` file:
   ```bash
   DB_HOST=localhost
   DB_USERNAME=root
   DB_PASSWORD=password
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=1d
   # ... etc
   ```

3. Start your services:
   ```bash
   pnpm run start:dev
   ```

## Validation & Error Handling

### Required Secrets

The following secrets are **required** and must be present (from either Key Vault or environment variables):

- `DB_HOST`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `PH_MERCHANT_ID`
- `PH_MERCHANT_SECRET`
- `PH_APP_ID`
- `PH_APP_SECRET`
- `FRONTEND_URL`
- `BACKEND_URL`

### Error Messages

If secrets are missing, you'll see a clear error message:

```
╔════════════════════════════════════════════════════════════════╗
║  CONFIGURATION ERROR: Missing Required Secrets                 ║
╚════════════════════════════════════════════════════════════════╝

The following required configuration values are missing:
  ✗ DB_HOST
  ✗ JWT_SECRET

These secrets must be provided via:
  1. Azure Key Vault (recommended): Add secrets with names like "DB-HOST"
  2. Environment variables: Set in .env file or system environment
```

## Testing Your Setup

### Check if Key Vault is connected:

```typescript
import { isKeyVaultInitialized, getLoadedSecretNames } from '@charmbooking/common';

if (isKeyVaultInitialized()) {
  console.log('Key Vault is initialized');
  console.log('Loaded secrets:', getLoadedSecretNames());
}
```

### Test secret loading:

Run your application and look for these console messages:

✅ Success:
```
✓ Connected to Azure Key Vault: https://your-vault.vault.azure.net/
✓ Loaded 11 secrets from Azure Key Vault
✓ Secrets loaded successfully
✓ API Gateway running on port 3000
```

❌ Failure (missing secrets):
```
CONFIGURATION ERROR: Missing Required Secrets
...
```

## Best Practices

1. **Production**: Always use Azure Key Vault with Managed Identity
2. **Development**: Use Azure CLI authentication (`az login`)
3. **CI/CD**: Use Service Principal (environment variables)
4. **Never commit** `.env` files with actual secrets to version control
5. **Rotate secrets** regularly in Key Vault
6. **Use different Key Vaults** for different environments (dev, staging, prod)

## Troubleshooting

### Issue: "AZURE_KEY_VAULT_URL not set"
**Solution**: Add the Key Vault URL to your `.env` file or ensure your `.env` file is being loaded

### Issue: "Failed to initialize Azure Key Vault"
**Solution**: 
- Ensure you're logged in: `az login`
- Verify Key Vault URL is correct
- Check you have proper permissions on the Key Vault

### Issue: "Missing Required Secrets"
**Solution**: 
- Add the missing secrets to Key Vault or `.env` file
- Verify secret names match (use hyphens in Key Vault, underscores in env vars)

### Issue: "getSecret is not defined"
**Solution**: Make sure you're importing from `@charmbooking/common`:
```typescript
import { getSecret, loadAllSecrets } from '@charmbooking/common';
```

## Security Notes

- Secrets are loaded once at startup and cached in memory
- The `getLoadedSecretNames()` function only returns secret names, not values
- Never log secret values in production
- Always use HTTPS for Key Vault communication (handled automatically)
- DefaultAzureCredential handles token refresh automatically

## Next Steps

1. Create your Azure Key Vault (if you haven't already)
2. Add all required secrets to the Key Vault
3. Update your `.env` file with the Key Vault URL
4. Test locally with `az login` authentication
5. Deploy to Azure with Managed Identity for production
