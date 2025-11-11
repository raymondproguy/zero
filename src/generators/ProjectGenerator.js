import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { TemplateManager } from './TemplateManager.js';
import { logger } from '../utils/logger.js';

const execAsync = promisify(exec);

export class ProjectGenerator {
  constructor(projectName, options = {}) {
    this.projectName = projectName;
    this.options = options;
    this.projectPath = path.join(process.cwd(), projectName);
    this.templateManager = new TemplateManager(options);
  }

  async generate() {
    await this.validate();
    await this.createProjectStructure();
    await this.generateReadme();
    
    if (this.options.initGit) {
      await this.initGit();
    }
    
    if (this.options.installDeps) {
      await this.installDependencies();
    }
    
    this.showSuccessMessage();
  }

  async validate() {
    if (await fs.pathExists(this.projectPath)) {
      throw new Error(`Directory "${this.projectName}" already exists`);
    }
  }

  async createProjectStructure() {
    logger.info('Creating project structure...');
    
    // Copy the complete template (base or auth-enabled)
    await this.templateManager.copyTemplates(this.projectPath);
    
    // Update package.json with project name
    await this.templateManager.updatePackageJson(this.projectPath, this.projectName);
    
    logger.success('Project structure created');
  }

  async generateReadme() {
    // README is already included in the templates
    logger.success('README.md generated');
  }

  async initGit() {
    try {
      logger.info('Initializing Git repository...');
      await execAsync('git init', { cwd: this.projectPath });
      logger.success('Git repository initialized');
    } catch (error) {
      logger.warning('Could not initialize Git repository');
    }
  }

  async installDependencies() {
    try {
      logger.info('Installing dependencies...');
      await execAsync('npm install', { cwd: this.projectPath });
      logger.success('Dependencies installed');
    } catch (error) {
      logger.warning('Could not install dependencies automatically');
      logger.info('You can install them manually with: npm install');
    }
  }

  showSuccessMessage() {
    logger.success(`\n🎉 Project "${this.projectName}" created successfully!`);
    logger.info(`📍 Location: ${this.projectPath}`);
    
    if (this.options.auth) {
      logger.info('\n🔐 Authentication Foundation Ready!');
      logger.info('✅ JWT and bcryptjs dependencies added');
      logger.info('✅ Environment variables configured');
      logger.info('✅ Route structure prepared');
      logger.info('\n📚 Next steps:');
      logger.info('   1. Create auth routes in src/routes/');
      logger.info('   2. Uncomment auth code in src/server.js');
      logger.info('   3. Implement your database and business logic');
    }
    
    logger.info('\n🚀 Get started:');
    logger.info(`   cd ${this.projectName}`);
    
    if (!this.options.installDeps) {
      logger.info('   npm install');
    }
    
    logger.info('   npm run dev');
  }
}
