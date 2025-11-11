import fs from 'fs-extra';
import path from 'path';
import { TemplateManager } from './TemplateManager.js';
import { logger } from '../utils/logger.js';

export class ProjectGenerator {
  constructor(projectName, options = {}) {
    this.projectName = projectName;
    this.options = options;
    this.projectPath = path.join(process.cwd(), projectName);
  }

  async generate() {
    await this.validate();
    await this.createProjectStructure();
    await this.generatePackageJson();
    await this.generateSourceFiles();
    await this.generateConfigFiles();
    await this.generateReadme();
    
    if (this.options.initGit) {
      await this.initGit();
    }

    this.showSuccessMessage();
  }

  async validate() {
    if (await fs.pathExists(this.projectPath)) {
      throw new Error(`Folder "${this.projectName}" already exists!`);
    }
    
    await fs.ensureDir(this.projectPath);
    logger.success(`Created project folder: ${this.projectName}`);
  }

  async createProjectStructure() {
    const dirs = [
      'src',
      'src/config',
      'src/middleware', 
      'src/routes',
      'src/utils'
    ];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(this.projectPath, dir));
    }
  }

  async generatePackageJson() {
    const isTypeScript = this.options.language === 'TypeScript';
    
    const packageJson = {
      name: this.projectName,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: isTypeScript ? 'tsx src/index.ts' : 'node --watch src/index.js',
        start: isTypeScript ? 'node dist/index.js' : 'node src/index.js',
      },
      dependencies: {
        express: '^4.18.0',
        cors: '^2.8.5',
        dotenv: '^16.3.0'
      },
      devDependencies: isTypeScript ? {
        typescript: '^5.0.0',
        tsx: '^4.0.0',
        '@types/express': '^4.17.0',
        '@types/node': '^20.0.0'
      } : {}
    };

    await fs.writeJson(path.join(this.projectPath, 'package.json'), packageJson, { spaces: 2 });
    logger.file('package.json');
  }

  async generateSourceFiles() {
    const isTypeScript = this.options.language === 'TypeScript';
    const extension = isTypeScript ? 'ts' : 'js';
    
    // Main server file
    const mainFile = `
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to ${this.projectName}',
    timestamp: new Date().toISOString(),
    language: '${this.options.language}'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: '✅ Healthy',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log('🚀 Server running on http://localhost:' + PORT);
});
`.trim();

    await fs.writeFile(path.join(this.projectPath, `src/index.${extension}`), mainFile);
    logger.file(`src/index.${extension}`);
  }

  async generateConfigFiles() {
    const isTypeScript = this.options.language === 'TypeScript';
    
    // Environment file
    await fs.writeFile(
      path.join(this.projectPath, '.env'),
      'PORT=3000\nNODE_ENV=development\n'
    );
    logger.file('.env');

    // Gitignore
    await fs.writeFile(
      path.join(this.projectPath, '.gitignore'),
      `node_modules/\n${isTypeScript ? 'dist/\\n' : ''}.env\n.DS_Store\n`
    );
    logger.file('.gitignore');

    // TypeScript config
    if (isTypeScript) {
      const tsConfig = {
        compilerOptions: {
          target: "ES2020",
          module: "ESNext",
          moduleResolution: "node",
          outDir: "./dist",
          rootDir: "./src",
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true
        },
        include: ["src/**/*"],
        exclude: ["node_modules", "dist"]
      };

      await fs.writeJson(path.join(this.projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });
      logger.file('tsconfig.json');
    }
  }

  async generateReadme() {
    const readme = `# ${this.projectName}

🚀 Generated with ZeroAPI CLI

## Getting Started

1. Install dependencies:
\\\`\\\`\\\`bash
npm install
\\\`\\\`\\\`

2. Start development server:
\\\`\\\`\\\`bash
npm run dev
\\\`\\\`\\\`

3. Open http://localhost:3000

## API Endpoints

- GET / - Welcome message
- GET /api/health - Health check

Built with ${this.options.language} 💙
`;

    await fs.writeFile(path.join(this.projectPath, 'README.md'), readme);
    logger.file('README.md');
  }

  async initGit() {
    logger.info('Initializing Git repository...');
    logger.info('Git repository ready to initialize');
  }

  showSuccessMessage() {
    logger.success('\n🎉 Project created successfully!\n');
    
    logger.section('Next steps');
    logger.command(`cd ${this.projectName}`);
    logger.command('npm install');
    logger.command('npm run dev');
    
    console.log('');
    console.log('💡 Your API will be available at http://localhost:3000');
    
    if (this.options.initGit) {
      console.log('\n📝 Remember to run: git init && git add . && git commit -m "Initial commit"');
    }
    
    console.log('');
  }
}
