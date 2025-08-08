# Ethereum Transaction Builder Playground

An interactive visual tool for building and executing complex Ethereum transactions with multiple contract calls.

## Features

- **Visual Transaction Builder**: Drag-and-drop interface for creating and organizing contract calls
- **Contract Integration**: Import contract ABIs and dynamically generate function forms
- **Flow Visualization**: See the execution order of your contract calls with connecting arrows
- **Wallet Connection**: Connect MetaMask or other Web3 wallets to execute transactions
- **Save/Load**: Export and import your transaction configurations
- **Real-time Editing**: Edit contract calls, functions, and arguments on the fly

## Getting Started

### Prerequisites

- Bun runtime installed
- MetaMask or another Web3 wallet browser extension

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask
2. **Add Nodes**: Click "Add Node" to create a new contract call
3. **Configure Node**: Click the settings icon on a node to:
   - Set contract address
   - Import contract ABI
   - Select function to call
   - Set function arguments
   - Set ETH value (if payable)
4. **Connect Nodes**: Drag from the bottom handle of one node to the top handle of another to create execution order
5. **Execute**: Click "Execute" to send the transaction(s) to the blockchain
6. **Save/Load**: Save your configuration for later use

## Technology Stack

- **React** + **TypeScript**: Core framework
- **Vite**: Build tool and dev server
- **React Flow**: Node-based graph visualization
- **ethers.js**: Ethereum blockchain interaction
- **Tailwind CSS**: Styling
- **@dnd-kit**: Drag and drop functionality

## Project Structure

```
src/
├── components/
│   ├── Playground.tsx    # Main canvas component
│   ├── Node.tsx          # Contract call node
│   └── NodeEditor.tsx    # Node configuration modal
├── lib/
│   └── ethereum.ts       # Ethereum/Web3 utilities
├── types/
│   └── index.ts         # TypeScript definitions
└── App.tsx              # Root component
```

## Development

```bash
# Run development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```