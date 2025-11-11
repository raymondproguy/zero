#!/usr/bin/env node

import { Command } from 'commander';
import pc from 'picocolors';
import { createProject } from './create.js';

const program = new Command();

// Colors for beautiful output
const log = {
  info: (text) => console.log(pc.blue('ℹ') + ' ' + text),
  success: (text) => console.log(pc.green('✅') + ' ' + text),
  error: (text) => console.log(pc.red('❌') + ' ' + text),
  file: (text) => console.log(pc.gray('📄') + ' ' + text),
  command: (text) => console.log(pc.cyan('➜') + ' ' + pc.bold(text)),
};

program
  .name('zero')
  .description('🚀 Create backends in seconds')
  .version('1.0.0');

program
  .command('create [project-name]')
  .description('Create a new project')
  .action(async (projectName) => {
    if (!projectName) {
      log.error('Please provide a project name');
      log.command('zero create my-app');
      process.exit(1);
    }
    
    await createProject(projectName);
  });

// Show help if no commands
if (process.argv.length === 2) {
  program.outputHelp();
  console.log(pc.blue('\n💡 Example:'));
  console.log(pc.cyan('  zero create my-app'));
}

program.parse();
