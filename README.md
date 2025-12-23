# Expression Builder

A powerful, no-code interface for building complex expressions with support for simple comparisons, nested calculations, and multiple output formats (JSON and JSONLogic).

![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=flat-square&logo=react)

## Features

- 🎯 **No-Code Interface**: Build complex expressions visually without writing code
- 🔢 **Nested Calculations**: Support for calculations like `Tag1 = (Tag2 + Tag3)`
- 📊 **Multiple Output Formats**: Generate both JSON and JSONLogic formats
- 🏷️ **Custom Tags**: Configure your own tag names for your data fields
- 💬 **Natural Language Preview**: See human-readable descriptions of your expressions
- 🎨 **Modern UI**: Clean, responsive interface with dark mode support
- ⚡ **Live Updates**: Real-time preview of expression output

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/daraafraz/expression-builder-standalone.git

# Navigate to the project directory
cd expression-builder-standalone

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
expression-builder-standalone/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout component
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── expression/        # Expression-specific components
│   │   ├── ExpressionPreview.tsx
│   │   ├── OutputDisplay.tsx
│   │   └── OutputTabs.tsx
│   └── ui/                # Reusable UI components
│       ├── combobox.tsx
│       ├── modal.tsx
│       ├── operator-combobox.tsx
│       └── smart-combobox.tsx
├── lib/                   # Utility functions and business logic
│   ├── expression-analyzer.ts    # Expression analysis utilities
│   ├── expression-generator.ts    # JSON/JSONLogic generators
│   ├── natural-language.tsx       # Natural language generation
│   └── tag-parser.ts              # Tag parsing utilities
├── types/                 # TypeScript type definitions
│   └── index.ts
├── constants/             # Application constants
│   └── index.ts
└── public/               # Static assets
```

## Usage

### Building Expressions

1. **Select a Tag**: Choose the left operand tag from the dropdown
2. **Choose an Operator**: Select a comparison operator (=, >, <, !=, >=, <=)
3. **Set the Right Value**: 
   - **Value Mode**: Enter a tag, number, or string constant
   - **Calculation Mode**: Build a nested calculation like `(Tag2 + Tag3)`

### Example Expressions

**Simple Comparison:**
```
WELL_B1_PRESSURE > 100
```

**Tag Comparison:**
```
WELL_B1_PRESSURE > WELL_B2_PRESSURE
```

**With Calculation:**
```
WELL_B1_PRESSURE = (WELL_B1_TEMP + 50)
```

### Output Formats

#### JSON Format
```json
{
  "type": "comparison",
  "left": {
    "type": "tag",
    "value": "WELL_B1_PRESSURE"
  },
  "operator": ">",
  "right": {
    "type": "constant",
    "value": 100
  }
}
```

#### JSONLogic Format
```json
{
  ">": [
    { "var": "WELL_B1_PRESSURE" },
    100
  ]
}
```

The JSONLogic format can be evaluated using libraries like [json-logic-js](https://github.com/jwadhams/json-logic-js).

## Configuration

### Custom Tags

Click the "Configure Tags" button to customize available tags. Tags should be comma-separated:

```
WELL_B1_PRESSURE, WELL_B1_TEMP, WELL_B2_PRESSURE, TANK_10_LEVEL
```

Tags are case-sensitive and should use descriptive names for your data fields.

## API Reference

### Types

All TypeScript types are exported from `@/types`:

```typescript
import type { ExpressionType, ValueMode, OutputFormat } from '@/types'
```

### Utilities

#### Expression Analysis
```typescript
import { analyzeRightValue, analyzeSimpleValue } from '@/lib/expression-analyzer'

const analysis = analyzeRightValue(expression, valueMode, availableTags)
```

#### Expression Generation
```typescript
import { generateJSON, generateJSONLogic } from '@/lib/expression-generator'

const json = generateJSON(expression, rightAnalysis)
const jsonLogic = generateJSONLogic(expression, rightAnalysis)
```

#### Tag Parsing
```typescript
import { parseTags, isValidTag } from '@/lib/tag-parser'

const tags = parseTags("tag1, tag2, tag3")
const isValid = isValidTag("tag1", availableTags)
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add JSDoc comments for public APIs
- Ensure all tests pass
- Update documentation as needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- JSONLogic format specification: [jsonlogic.com](https://jsonlogic.com/)

## Support

For issues, questions, or contributions, please open an issue on the [GitHub repository](https://github.com/daraafraz/expression-builder-standalone).
