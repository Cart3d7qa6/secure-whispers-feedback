# Secure Whispers Feedback

A secure feedback platform built with Fully Homomorphic Encryption (FHE) to ensure complete privacy while enabling meaningful analysis of confidential feedback.

## Features

- 🔐 **Fully Homomorphic Encryption**: All feedback is encrypted using FHE technology
- 🌐 **Web3 Integration**: Connect with your wallet using RainbowKit
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS
- ⚡ **Fast Development**: Powered by Vite and React
- 🔒 **Privacy First**: Zero-knowledge architecture for maximum security

## Technologies

This project is built with:

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Web3**: Wagmi, RainbowKit, Viem
- **Encryption**: FHE (Fully Homomorphic Encryption)
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (MetaMask, WalletConnect, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Cart3d7qa6/secure-whispers-feedback.git
cd secure-whispers-feedback
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Connect Wallet**: Click the "Connect Wallet" button to connect your Web3 wallet
2. **Submit Feedback**: Use the feedback form to submit encrypted feedback
3. **View Comments**: Browse through encrypted feedback in the secure thread
4. **Privacy**: All data is encrypted using FHE technology

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── WalletConnect.tsx
├── lib/                # Utility functions and configs
├── pages/              # Page components
└── hooks/              # Custom React hooks
```

## Deployment

This project can be deployed to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

## Security

- All feedback is encrypted using Fully Homomorphic Encryption
- Wallet integration ensures secure user authentication
- Zero-knowledge architecture protects user privacy
- Smart contracts handle encrypted data processing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
