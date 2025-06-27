module.exports = {
  build: true,
  flags: ['--enable-source-maps'],
  fakeArgv: true,
  patches: [
    async (compiler, next) => {
      // Set a clean command name for yargs help text
      // 
      // The fakeArgv option preserves the script path but we want a specific
      // command name "manifest-to-bicep-extension" to appear in help text.
      // This makes the CLI usage cleaner: 
      // "Usage: manifest-to-bicep-extension <command> [options]"
      // instead of showing the full binary path.
      // lib/_third_party_main.js is nexe's internal entry point wrapper
      await compiler.setFileContentsAsync(
        'lib/_third_party_main.js',
        'process.argv.splice(1, 0, "manifest-to-bicep-extension");'
      );
      return next();
    }
  ],
  targets: [
    {
      platform: 'linux',
      arch: 'x64',
      nodeVersion: '20.18.1',
      output: 'dist/manifest-to-bicep-extension-linux-x64'
    },
    {
      platform: 'alpine',
      arch: 'x64',
      nodeVersion: '20.18.1',
      output: 'dist/manifest-to-bicep-extension-linux-musl-x64'
    },
    {
      platform: 'darwin',
      arch: 'x64',
      nodeVersion: '20.18.1',
      output: 'dist/manifest-to-bicep-extension-darwin-x64'
    },
    {
      platform: 'darwin',
      arch: 'arm64',
      nodeVersion: '20.18.1',
      output: 'dist/manifest-to-bicep-extension-darwin-arm64'
    },
    {
      platform: 'windows',
      arch: 'x64',
      nodeVersion: '20.18.1',
      output: 'dist/manifest-to-bicep-extension-win-x64.exe'
    }
  ]
};