// This script is used to start the application on Render.com
// It ensures that the environment is properly configured

import { spawn } from 'child_process';
import fs from 'fs';

// Check if the build directory exists
if (!fs.existsSync('./dist/index.js')) {
  console.error('Error: Build directory not found. Make sure to run the build command first.');
  process.exit(1);
}

// Set environment variables if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

console.log('Starting EcoShiftConnect in production mode...');
console.log(`Server will be available on port ${process.env.PORT || 5000}`);

// Start the application
const child = spawn('node', ['dist/index.js'], { 
  stdio: 'inherit',
  env: process.env
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`Application exited with code ${code}`);
    process.exit(code);
  }
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Received SIGINT signal, shutting down gracefully...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down gracefully...');
  child.kill('SIGTERM');
});
