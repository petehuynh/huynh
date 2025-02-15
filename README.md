# Huynh

AI-driven UI optimization package for React applications.

## Features

- 🤖 AI-powered UI optimization
- 🔄 Automated A/B testing
- 🛡️ Built-in rollback system
- 📊 Performance metrics tracking
- 💰 Budget management
- 🔒 Type-safe development

## Installation

```bash
npm install huynh
```

## Quick Start

```typescript
import { createRollbackSystem } from 'huynh';

// Initialize the rollback system
const rollback = createRollbackSystem({
  maxHistoryVersions: 5,
  autoRollbackThreshold: 0.1, // 10% error rate
  backupInterval: 60 // 60 minutes
});

// Take a snapshot of your application state
await rollback.takeSnapshot(currentState);

// Restore a previous version if needed
await rollback.restoreSnapshot(version);
```

## Development

### Prerequisites

- Node.js >= 16.x
- npm >= 7.x

### Setup

1. Clone the repository:
```bash
git clone https://github.com/username/huynh.git
cd huynh
```

2. Install dependencies:
```bash
npm install
```

3. Run tests:
```bash
npm test
```

### Available Scripts

- `npm run build` - Build the package
- `npm test` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

For security concerns, please open an issue or contact the maintainers directly.

## Support

For support, please open an issue in the GitHub repository.
```
