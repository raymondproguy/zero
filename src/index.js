#!/usr/bin/env node

import { Command } from 'commander';
import { createProject } from './commands/create.js';
import { logger } from './utils/logger.js';

const program = new Command();

program
  .name('zero')
  .description('🚀 Create backends in seconds')
  .version('1.0.0');

program
  .command('create <project-name>')
  .description('Create a new project')
  .action(createProject);

// Show help if no commands
if (process.argv.length === 2) {
  program.outputHelp();
  logger.info('\n💡 Example: zero create my-app');
}

program.parse();
