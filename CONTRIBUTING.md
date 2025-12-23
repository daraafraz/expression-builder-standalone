# Contributing to Expression Builder

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## How to Contribute

We welcome contributions of all kinds:
- Bug fixes
- New features
- Documentation improvements
- UI/UX enhancements
- Performance optimizations
- Test coverage

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun
- Git

### Setting Up the Project Locally

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/expression-builder-standalone.git
   cd expression-builder-standalone
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** to [http://localhost:3000](http://localhost:3000)

### Running Tests and Linting

Currently, the project uses ESLint for code quality:

```bash
# Run linting
npm run lint
```

The project will automatically check types during build:

```bash
# Build and type-check
npm run build
```

## Making Changes

### Development Workflow

1. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following the project's coding standards:
   - Use TypeScript for all new code
   - Add JSDoc comments for public APIs
   - Follow existing code style and patterns
   - Keep functions focused and modular

3. **Test your changes**:
   - Ensure the app runs without errors
   - Test the functionality you've added or modified
   - Run `npm run build` to check for type errors

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```
   
   Use clear, descriptive commit messages. Examples:
   - `fix: resolve issue with tag validation`
   - `feat: add support for custom operators`
   - `docs: update README with new examples`

### Code Style

- **TypeScript**: Use strict typing, avoid `any` when possible
- **Components**: Use functional components with hooks
- **Naming**: Use descriptive, camelCase names for variables and functions
- **Comments**: Add JSDoc comments for exported functions and types
- **Formatting**: The project uses ESLint for code formatting

### Project Structure

```
├── app/              # Next.js app directory
├── components/       # React components
│   ├── expression/   # Expression-specific components
│   └── ui/          # Reusable UI components
├── lib/             # Utility functions and business logic
├── types/           # TypeScript type definitions
├── constants/       # Application constants
└── public/          # Static assets
```

When adding new code:
- Place utilities in `lib/`
- Add types to `types/index.ts`
- Add constants to `constants/index.ts`
- Create reusable components in `components/ui/`
- Keep expression-specific components in `components/expression/`

## Submitting a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub:
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots if your changes affect the UI
   - Explain what your changes do and why

3. **Wait for review**:
   - Maintainers will review your PR
   - Address any feedback or requested changes
   - Be patient - maintainers may have limited availability

### PR Checklist

Before submitting, ensure:
- [ ] Code follows project style guidelines
- [ ] All TypeScript types are correct
- [ ] No linting errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Changes are tested manually
- [ ] Documentation is updated if needed
- [ ] Commit messages are clear and descriptive

## What Kinds of Contributions Are Welcome

### Good First Issues

Look for issues labeled `good first issue` - these are designed for first-time contributors:
- Small bug fixes
- Documentation improvements
- UI polish
- Adding examples

### Feature Requests

Before implementing a major feature:
1. Open an issue to discuss the feature
2. Get feedback from maintainers
3. Ensure it aligns with project goals

### Bug Reports

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS information (if relevant)
- Screenshots (if applicable)

## Communication

- **Issues**: Use GitHub issues for bug reports and feature requests
- **Pull Requests**: Use PR comments for discussion about changes
- **Questions**: Open a GitHub discussion or issue with the `question` label

## Expectations

- **Response Time**: Maintainers may take a few days to respond. Please be patient.
- **Scope**: Keep PRs focused on a single issue or feature when possible
- **Respect**: Be respectful and constructive in all communications
- **Learning**: It's okay to ask questions - we're all learning

## Questions?

If you have questions about contributing:
- Check existing issues and discussions
- Open a new issue with the `question` label
- Review the README for project overview

Thank you for contributing to Expression Builder! 🎉

