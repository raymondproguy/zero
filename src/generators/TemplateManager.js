import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class TemplateManager {
  constructor(options = {}) {
    this.templatesPath = path.join(__dirname, '../../templates');
    this.options = options;
  }

  /**
   * Get the correct template path based on options
   */
  getTemplatePath() {
    let templateType = 'base';
    
    if (this.options.auth && this.options.db) {
      templateType = `auth-${this.options.db}`;
    } else if (this.options.auth) {
      templateType = 'auth-enabled';
    } else if (this.options.db) {
      templateType = `db-${this.options.db}`;
    }
    
    const language = this.options.language === 'TypeScript' ? 'typescript' : 'javascript';
    return path.join(this.templatesPath, templateType, language);
  }

  /**
   * Copy templates to project directory
   */
  async copyTemplates(destinationPath) {
    const templatePath = this.getTemplatePath();
    
    if (!await fs.pathExists(templatePath)) {
      throw new Error(`Template path not found: ${templatePath}`);
    }

    await fs.copy(templatePath, destinationPath);
    
    // Rename _gitignore to .gitignore if it exists
    const gitignorePath = path.join(destinationPath, '_gitignore');
    if (await fs.pathExists(gitignorePath)) {
      await fs.move(gitignorePath, path.join(destinationPath, '.gitignore'));
    }
  }

  /**
   * Update package.json with project name
   */
  async updatePackageJson(projectPath, projectName) {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = projectName;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  }
}
