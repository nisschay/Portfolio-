#!/usr/bin/env node
/**
 * Wrapper to run Next.js dev server with stdin kept open
 * This prevents the server from exiting in non-TTY environments
 */
const { spawn } = require('child_process');
const path = require('path');

const nextBin = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

const child = spawn('node', [nextBin, 'dev', '-p', '3000'], {
  cwd: __dirname,
  stdio: ['pipe', 'inherit', 'inherit'],
  env: { ...process.env, FORCE_COLOR: '1' }
});

// Keep stdin open
process.stdin.resume();
process.stdin.pipe(child.stdin);

child.on('exit', (code) => {
  process.exit(code || 0);
});

process.on('SIGINT', () => {
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});
