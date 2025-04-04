# README

[![CI/CD](https://github.com/this-oliver/template-node/actions/workflows/cicd.yaml/badge.svg)](https://github.com/this-oliver/template-node/actions/workflows/cicd.yaml)

This is a template for javascript or typescript projects.

Apart from the usual stuff, the repo also includes:

- [typescript config](tsconfig.json)
- [linting for code](eslint.config.mjs)
- [linting for commits](.commitlintrc.js) that enforces [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
- git hooks for lints
- github automations for [linting and security workflows](.github/workflows/cicd.yaml) and [dependabot config](.github/dependabot.yml)

## Usage

Pre-requisites:

- [nodejs](https://nodejs.org/en/) v23 or later
- [pnpm](https://pnpm.io/) v10 or later

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run
node dist/index.js
```
