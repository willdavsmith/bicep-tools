#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Platform configurations
const PLATFORMS = {
  'linux-x64': {
    nodeUrl: 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-linux-x64.tar.xz',
    nodeBinary: 'node-v20.11.0-linux-x64/bin/node',
    outputName: 'manifest-to-bicep-extension-linux-amd64',
    postjectArgs: ['NODE_SEA_BLOB', 'sea-prep.blob', '--sentinel-fuse', 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2']
  },
  'linux-musl-x64': {
    nodeUrl: 'https://unofficial-builds.nodejs.org/download/release/v20.11.0/node-v20.11.0-linux-x64-musl.tar.xz',
    nodeBinary: 'node-v20.11.0-linux-x64-musl/bin/node',
    outputName: 'manifest-to-bicep-extension-linux-musl-amd64',
    postjectArgs: ['NODE_SEA_BLOB', 'sea-prep.blob', '--sentinel-fuse', 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2']
  },
  'darwin-x64': {
    nodeUrl: 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-darwin-x64.tar.gz',
    nodeBinary: 'node-v20.11.0-darwin-x64/bin/node',
    outputName: 'manifest-to-bicep-extension-darwin-x64',
    postjectArgs: ['NODE_SEA_BLOB', 'sea-prep.blob', '--sentinel-fuse', 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2', '--macho-segment-name', 'NODE_SEA']
  },
  'linux-arm64': {
    nodeUrl: 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-linux-arm64.tar.xz',
    nodeBinary: 'node-v20.11.0-linux-arm64/bin/node',
    outputName: 'manifest-to-bicep-extension-linux-arm64',
    postjectArgs: ['NODE_SEA_BLOB', 'sea-prep.blob', '--sentinel-fuse', 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2']
  },
  'darwin-x64': {
    nodeUrl: 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-darwin-x64.tar.gz',
    nodeBinary: 'node-v20.11.0-darwin-x64/bin/node',
    outputName: 'manifest-to-bicep-extension-darwin-amd64',
    postjectArgs: ['NODE_SEA_BLOB', 'sea-prep.blob', '--sentinel-fuse', 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2', '--macho-segment-name', 'NODE_SEA']
  },
  'darwin-arm64': {
    nodeUrl: 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-darwin-arm64.tar.gz',
    nodeBinary: 'node-v20.11.0-darwin-arm64/bin/node',
    outputName: 'manifest-to-bicep-extension-darwin-arm64',
    postjectArgs: ['NODE_SEA_BLOB', 'sea-prep.blob', '--sentinel-fuse', 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2', '--macho-segment-name', 'NODE_SEA']
  },
  'win32-x64': {
    nodeUrl: 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-win-x64.zip',
    nodeBinary: 'node-v20.11.0-win-x64/node.exe',
    outputName: 'manifest-to-bicep-extension-win-amd64.exe',
    postjectArgs: ['NODE_SEA_BLOB', 'sea-prep.blob', '--sentinel-fuse', 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2']
  }
};

function detectCurrentPlatform() {
  const platform = os.platform();
  const arch = os.arch();
  
  if (platform === 'linux' && arch === 'x64') return 'linux-x64';
  if (platform === 'darwin' && arch === 'x64') return 'darwin-x64';
  if (platform === 'darwin' && arch === 'arm64') return 'darwin-arm64';
  if (platform === 'win32' && arch === 'x64') return 'win32-x64';
  
  throw new Error(`Unsupported platform: ${platform}-${arch}`);
}

function downloadAndExtract(url, targetDir) {
  console.log(`Downloading Node.js from ${url}...`);
  
  const filename = path.basename(url);
  const downloadPath = path.join(targetDir, filename);
  
  // Download
  execSync(`curl -L -o "${downloadPath}" "${url}"`, { stdio: 'inherit' });
  
  // Extract based on file extension
  if (filename.endsWith('.tar.xz')) {
    execSync(`tar -xf "${downloadPath}" -C "${targetDir}"`, { stdio: 'inherit' });
  } else if (filename.endsWith('.tar.gz')) {
    execSync(`tar -xzf "${downloadPath}" -C "${targetDir}"`, { stdio: 'inherit' });
  } else if (filename.endsWith('.zip')) {
    execSync(`unzip -q "${downloadPath}" -d "${targetDir}"`, { stdio: 'inherit' });
  }
  
  // Clean up download file
  fs.unlinkSync(downloadPath);
}

function buildSEA(targetPlatform) {
  const config = PLATFORMS[targetPlatform];
  if (!config) {
    throw new Error(`Unknown platform: ${targetPlatform}`);
  }
  
  console.log(`Building SEA for ${targetPlatform}...`);
  
  const workDir = path.resolve('.');
  const distDir = path.join(workDir, 'dist');
  const tempDir = path.join(distDir, '.temp');
  
  // Ensure directories exist
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  
  // Check if SEA blob exists
  const blobPath = path.join(workDir, 'sea-prep.blob');
  if (!fs.existsSync(blobPath)) {
    throw new Error('SEA blob not found. Run "yarn build:sea-blob" first.');
  }
  
  try {
    // Download and extract Node.js binary if not already present
    const nodeBinaryPath = path.join(tempDir, config.nodeBinary);
    if (!fs.existsSync(nodeBinaryPath)) {
      downloadAndExtract(config.nodeUrl, tempDir);
    }
    
    // Copy Node.js binary to output location
    const outputPath = path.join(distDir, config.outputName);
    fs.copyFileSync(nodeBinaryPath, outputPath);
    
    // Make executable (Unix systems)
    if (process.platform !== 'win32') {
      fs.chmodSync(outputPath, 0o755);
    }
    
    // Remove signature for macOS
    if (targetPlatform.startsWith('darwin')) {
      try {
        execSync(`codesign --remove-signature "${outputPath}"`, { stdio: 'inherit' });
        console.log('Removed macOS code signature');
      } catch (err) {
        console.warn('Warning: Could not remove macOS signature:', err.message);
      }
    }
    
    // Inject SEA blob using postject
    console.log('Injecting SEA blob...');
    const postjectCmd = ['npx', 'postject', outputPath, ...config.postjectArgs];
    execSync(postjectCmd.join(' '), { stdio: 'inherit' });
    
    console.log(`✅ SEA binary created: ${outputPath}`);
    
    // Optionally re-sign for macOS (requires developer certificate)
    if (targetPlatform.startsWith('darwin')) {
      try {
        execSync(`codesign --sign - "${outputPath}"`, { stdio: 'inherit' });
        console.log('Re-signed macOS binary with ad-hoc signature');
      } catch (err) {
        console.warn('Warning: Could not re-sign macOS binary:', err.message);
      }
    }
    
  } catch (error) {
    console.error(`Failed to build SEA for ${targetPlatform}:`, error.message);
    process.exit(1);
  }
}

// Main execution
const targetPlatform = process.argv[2] || detectCurrentPlatform();

console.log(`Building Single Executable Application for ${targetPlatform}`);
buildSEA(targetPlatform);