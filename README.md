# Bicep Tools

This repo contains the tooling for Bicep support for Radius types. The tools in this repository can be used to:

- Generate a Bicep Extension from a Radius type manifest.

## Installation

### Using NPM (requires Node.js)

```bash
npx @radius-project/manifest-to-bicep-extension@alpha generate <manifest> <output>
```

### Using Standalone Binary (no Node.js required)

Download the appropriate binary for your platform from the [releases page](https://github.com/radius-project/bicep-tools/releases):

- Linux: `manifest-to-bicep-extension-linux-x64`
- Linux (musl): `manifest-to-bicep-extension-linux-musl-x64`
- macOS (Intel): `manifest-to-bicep-extension-darwin-x64`
- macOS (Apple Silicon): `manifest-to-bicep-extension-darwin-arm64`
- Windows: `manifest-to-bicep-extension-win-x64.exe`

```bash
# Linux/macOS
chmod +x manifest-to-bicep-extension-*
./manifest-to-bicep-extension-<platform> generate <manifest> <output>

# Windows
manifest-to-bicep-extension-win-x64.exe generate <manifest> <output>
```

## Summary

Browse our guides for how to [understand the code](./docs/contributing/contributing-code/contributing-code-organization/)
and [build the code](./docs/contributing/contributing-code/contributing-code-building/).
For information on how to contribute to Radius visit [Contributing](https://docs.radapp.dev/contributing/).
For any other general information on Radius Visit [Radius](https://github.com/radius-project/radius)

## Security

Please refer to our guide on [Reporting security vulnerabilities](SECURITY.md)

## Code of conduct

Please refer to our [Radius community code of conduct](CODE_OF_CONDUCT.md)
