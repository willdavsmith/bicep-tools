#!/usr/bin/env node
import { run } from './program'

// Error handling for nexe environment
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

// Run the CLI
run().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})