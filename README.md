# Expression Builder

Build conditional logic for industrial operations without writing code.

## What Problem It Solves

Operations teams in oil & gas, manufacturing, and industrial settings need to configure conditions for alarms, triggers, and automated responses. Writing these conditions in code is error-prone and requires developer involvement. Expression Builder provides a visual, no-code interface that lets operators build complex conditional logic safely.

## Who It Is For

- **Operations Engineers** configuring alarm conditions in SCADA systems
- **Process Control Engineers** setting up automated triggers
- **Industrial Automation Teams** building rule-based logic
- **Developers** who need to generate JSONLogic expressions for rule engines

## Why This Exists

Industrial operations rely on conditional logic for safety and efficiency. Traditional approaches require:
- Writing code (error-prone, requires developers)
- Manual JSON/JSONLogic creation (tedious, syntax errors)
- Complex rule engine interfaces (steep learning curve)

Expression Builder removes these barriers by providing a visual interface that generates production-ready JSONLogic output. It was created to make conditional logic configuration accessible to operations teams who understand the business logic but shouldn't need to write code.

## What This Project Does

- **Visual Expression Building**: Create conditions through dropdowns and inputs, not code
- **Nested Calculations**: Support for expressions like `WELL_B1_PRESSURE = (WELL_B1_TEMP + 50)`
- **Multiple Output Formats**: Generate both JSON and JSONLogic formats
- **Custom Tag Configuration**: Configure your own sensor tags and data points
- **Natural Language Preview**: See human-readable descriptions of your expressions
- **Live Output**: Real-time preview of generated JSON/JSONLogic

## What This Project Does NOT Do

- **Execute Logic**: This tool generates expressions; it does not evaluate them
- **Connect to SCADA Systems**: It's a standalone tool for building expressions
- **Store Expressions**: No database or persistence layer
- **Handle Complex Logic**: Currently supports single conditions, not multi-condition rules (AND/OR)
- **Validate Against Real Data**: No connection to live sensor data

## Quick Start

### Install

```bash
git clone https://github.com/daraafraz/expression-builder-standalone.git
cd expression-builder-standalone
npm install
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Minimal Example

1. Select a tag (e.g., `WELL_B1_PRESSURE`)
2. Choose an operator (e.g., `>`)
3. Enter a value (e.g., `100`)
4. Copy the generated JSONLogic output

Result:
```json
{
  ">": [
    { "var": "WELL_B1_PRESSURE" },
    100
  ]
}
```

## Usage

### Building Simple Conditions

1. **Select Tag**: Choose the left operand from the dropdown
2. **Choose Operator**: Select comparison operator (=, >, <, !=, >=, <=)
3. **Set Value**: Enter a tag, number, or string constant

Example: `WELL_B1_PRESSURE > 100`

### Building Conditions with Calculations

1. Switch to "Calculation" mode
2. Build nested expressions like `WELL_B1_PRESSURE = (WELL_B1_TEMP + 50)`

### Customizing Tags

Click "Configure Tags" to add your own sensor tags. Use comma-separated format:
```
WELL_B1_PRESSURE, WELL_B1_TEMP, TANK_10_LEVEL
```

### Output Formats

- **JSONLogic** (default): Standard format for rule engines, compatible with [json-logic-js](https://github.com/jwadhams/json-logic-js)
- **JSON**: Structured format with type information

Switch between formats using the tabs in the output section.

## How It Works

Expression Builder is a Next.js application that:
1. Captures user input through visual controls
2. Analyzes the expression structure (tags vs constants, calculations)
3. Generates JSONLogic or JSON output in real-time
4. Provides natural language preview for validation

The generated expressions can be used directly in rule engines, SCADA systems, or any system that accepts JSONLogic format.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Quick contribution guide:**
1. Fork the repository
2. Create a branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Test with `npm run build`
5. Submit a pull request

For detailed instructions, examples, and expectations, please read [CONTRIBUTING.md](CONTRIBUTING.md).

## Project Status

**Status**: Stable and actively maintained

**Response Times**: 
- Issues: Typically within 3-5 business days
- Pull Requests: Review within 1 week
- Questions: Best effort, may take a few days

**Maintainer Availability**: Limited but committed to keeping the project healthy. If you need urgent support, please open an issue and we'll prioritize accordingly.

**Current Focus**: 
- Bug fixes and stability improvements
- Documentation enhancements
- Community contributions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/daraafraz/expression-builder-standalone/issues)
- **Questions**: Open an issue with the `question` label
- **Contributions**: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

Built with [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), and [React](https://react.dev/).
