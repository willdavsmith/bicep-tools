# Contributing Code: Building

This repository uses corepack and Yarn v4. Corepack is included with NodeJs and will automatically download the correct version of Yarn.

## Prerequisites

- Install NodeJs 20+
- Run `corepack enable`
- Clone the repository with submodules
  - `git submodule update --init --recursive`
- Build the `bicep-types` module`
  - `cd bicep-types/src/bicep-types`
  - `npm ci && npm run build`

## Building

```sh
yarn run build:all
```

## Formatting

```sh
yarn run format:all
```

## Linting

```sh
yarn run lint:all
```

## Testing

```sh
yarn run test:all
```
