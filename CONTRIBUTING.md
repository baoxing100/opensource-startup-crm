# Contributing to AWCRM

Thank you for your interest in contributing to AWCRM! We're excited to have you join our community of developers working to make high-quality CRM software accessible to everyone.

This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [Coding Standards](#coding-standards)
- [Community](#community)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. 

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm, pnpm, or yarn package manager
- Git
- A database (PostgreSQL recommended)

### Setting Up Local Development

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/awcrm.git
   cd awcrm
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn
   ```
4. Configure your environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables as needed for your local environment
5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-you-are-fixing
   ```

2. Make your changes and commit them using descriptive commit messages:
   ```bash
   git commit -m "feat: add new feature X that does Y"
   ```
   We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard for commit messages.

3. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request from your branch to the main project repository.

## Pull Request Process

1. Ensure your code follows the project's coding standards.
2. Update the documentation as needed.
3. Add tests for new functionality.
4. Ensure the test suite passes by running:
   ```bash
   npm run test
   ```
5. Your pull request will be reviewed by maintainers, who may request changes or provide feedback.
6. Once approved, your pull request will be merged by a maintainer.

## Reporting Bugs

Please report bugs by opening an issue on our GitHub repository. When filing a bug report, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment information (OS, browser, etc.)

## Feature Requests

We welcome suggestions for new features! To suggest a feature:

1. Check if the feature has already been requested or is in development.
2. Open a new issue describing:
   - The feature you'd like to see
   - The problem it solves
   - How it should work
   - Why it would be valuable to most users

## Coding Standards

- We use ESLint and Prettier for code formatting and linting.
- Run `npm run lint` before submitting pull requests.
- Write meaningful comments and documentation.
- Follow the existing code style and patterns.
- Write tests for new functionality.

### Svelte Component Guidelines

- Each component should have a clear, single responsibility.
- Use Svelte's reactivity system effectively.
- Keep components reasonably sized; consider breaking large components into smaller ones.
- Use TypeScript for type safety when possible.

### API Development Guidelines

- Follow RESTful principles.
- Return consistent response structures.
- Handle errors gracefully and return appropriate status codes.
- Document new endpoints.

## Community

Join our community to discuss the project, get help, or just hang out with other AWCRM contributors:

- [GitHub Discussions](https://github.com/yourusername/bottlecrm/discussions)
- [Community Forum](#) (coming soon)
- [Discord Server](#) (coming soon)

## License

By contributing to AWCRM, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

---

Thank you for contributing to make CRM software accessible to everyone! ❤️
