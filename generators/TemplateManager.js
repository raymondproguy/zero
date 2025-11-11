import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '../templates');

export class TemplateManager {
  static async getTemplate(templateName) {
    const templatePath = path.join(TEMPLATES_DIR, templateName);
    
    if (!await fs.pathExists(templatePath)) {
      throw new Error(`Template "${templateName}" not found`);
    }
    
    return templatePath;
  }

  static async copyTemplate(sourcePath, targetPath, variables = {}) {
    await fs.ensureDir(targetPath);
    await this.copyRecursive(sourcePath, targetPath, variables);
  }

  static async copyRecursive(source, target, variables) {
    const files = await fs.readdir(source);
    
    for (const file of files) {
      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);
      const stat = await fs.stat(sourcePath);

      if (stat.isDirectory()) {
        await fs.ensureDir(targetPath);
        await this.copyRecursive(sourcePath, targetPath, variables);
      } else {
        let content = await fs.readFile(sourcePath, 'utf8');
        
        // Replace template variables
        content = content.replace(/{{(\w+)}}/g, (match, key) => {
          return variables[key] || match;
        });
        
        await fs.writeFile(targetPath, content);
      }
    }
  }
}
