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
  .option('--auth', 'Include authentication foundation')
  .option('--db <database>', 'Database type: postgres, mongodb, or sqlite')
  .action(createProject);

program.parse();
