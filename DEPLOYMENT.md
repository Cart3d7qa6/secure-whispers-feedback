# Deployment Guide for Secure Whispers Feedback

## Prerequisites

- Node.js 18+ and npm
- Vercel account
- GitHub repository
- WalletConnect Project ID

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# Contract addresses (update after deployment)
VITE_CONTRACT_ADDRESS_SEPOLIA=0x...
VITE_CONTRACT_ADDRESS_MAINNET=0x...

# FHE Network configuration
VITE_FHE_RPC_URL=https://rpc.fhenix.xyz
VITE_FHE_CHAIN_ID=42069
```

## Deployment Steps

### 1. Deploy Smart Contract

1. Install Hardhat dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Deploy to Sepolia testnet:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. Update contract addresses in `src/lib/contract-abi.ts`

### 2. Deploy Frontend to Vercel

#### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

#### Option B: Deploy via GitHub Integration

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### 3. Configure Environment Variables in Vercel

In your Vercel dashboard, add the following environment variables:

- `VITE_WALLET_CONNECT_PROJECT_ID`
- `VITE_CONTRACT_ADDRESS_SEPOLIA`
- `VITE_CONTRACT_ADDRESS_MAINNET`
- `VITE_FHE_RPC_URL`
- `VITE_FHE_CHAIN_ID`

### 4. Update Wallet Configuration

Update `src/lib/wallet-config.ts` with your WalletConnect Project ID:

```typescript
export const config = getDefaultConfig({
  appName: 'Secure Whispers Feedback',
  projectId: process.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [sepolia, mainnet],
  ssr: false,
});
```

## Post-Deployment Checklist

- [ ] Smart contract deployed and verified
- [ ] Contract addresses updated in frontend
- [ ] Environment variables configured
- [ ] WalletConnect Project ID set
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active
- [ ] Frontend accessible and functional
- [ ] Wallet connection working
- [ ] Contract interactions working

## Troubleshooting

### Common Issues

1. **Wallet Connection Fails**
   - Check WalletConnect Project ID
   - Verify network configuration
   - Ensure wallet is unlocked

2. **Contract Calls Fail**
   - Verify contract address
   - Check network (Sepolia vs Mainnet)
   - Ensure sufficient gas fees

3. **Build Errors**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify all dependencies

### Support

For issues related to:
- **FHE Integration**: Check FHE network status
- **Wallet Connection**: Verify WalletConnect configuration
- **Contract Deployment**: Review Hardhat configuration
- **Frontend Issues**: Check browser console for errors

## Security Considerations

- Never commit private keys or sensitive data
- Use environment variables for all secrets
- Verify smart contracts before deployment
- Enable HTTPS in production
- Regular security audits recommended

## Monitoring

- Monitor contract events and transactions
- Set up error tracking (Sentry, etc.)
- Monitor wallet connection success rates
- Track user engagement metrics
