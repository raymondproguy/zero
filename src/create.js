import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import pc from 'picocolors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const log = {
  info: (text) => console.log(pc.blue('ℹ') + ' ' + text),
  success: (text) => console.log(pc.green('✅') + ' ' + text),
  error: (text) => console.log(pc.red('❌') + ' ' + text),
  file: (text) => console.log(pc.gray('📄') + ' ' + text),
};

export async function createProject(projectName) {
  try {
    console.log(pc.bold(pc.blue('\n🚀 ZeroAPI - Creating your project...\n')));
    
    // 1. Ask simple questions
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'language',
        message: 'TypeScript or JavaScript?',
        choices: ['TypeScript', 'JavaScript'],
        default: 'TypeScript'
      },
      {
        type: 'confirm',
        name: 'initGit',
        message: 'Initialize Git repository?',
        default: true
      }
    ]);

    const projectPath = path.join(process.cwd(), projectName);
    
    // 2. Check if folder exists
    if (await fs.pathExists(projectPath)) {
      log.error(`Folder "${projectName}" already exists!`);
      process.exit(1);
    }

    // 3. Create project folder
    await fs.ensureDir(projectPath);
    log.success(`Created project folder: ${projectName}`);

    // 4. Generate basic files
    await generateProject(projectPath, projectName, answers);
    
    // 5. Initialize Git if requested
    if (answers.initGit) {
      await initGit(projectPath);
    }

    // 6. Show success message
    showSuccessMessage(projectName, answers);

  } catch (error) {
    console.log(pc.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

async function generateProject(projectPath, projectName, answers) {
  const isTypeScript = answers.language === 'TypeScript';
  
  // package.json
  const packageJson = {
    name: projectName,
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

  await fs.writeJson(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
  log.file('package.json');

  // Main server file
  const srcDir = path.join(projectPath, 'src');
  await fs.ensureDir(srcDir);

  if (isTypeScript) {
    // TypeScript version
    await fs.writeFile(
      path.join(srcDir, 'index.ts'),
      `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to ${projectName}',
    timestamp: new Date().toISOString(),
    language: 'TypeScript'
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
`
    );
    
    // tsconfig.json
    await fs.writeJson(path.join(projectPath, 'tsconfig.json'), {
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
    }, { spaces: 2 });
    log.file('tsconfig.json');
    
  } else {
    // JavaScript version
    await fs.writeFile(
      path.join(srcDir, 'index.js'),
      `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to ${projectName}',
    timestamp: new Date().toISOString(),
    language: 'JavaScript'
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
`
    );
  }
  log.file(`src/index.${isTypeScript ? 'ts' : 'js'}`);

  // Environment file
  await fs.writeFile(
    path.join(projectPath, '.env'),
    `PORT=3000\nNODE_ENV=development\n`
  );
  log.file('.env');

  // Gitignore
  await fs.writeFile(
    path.join(projectPath, '.gitignore'),
    `node_modules/\n${isTypeScript ? 'dist/\\n' : ''}.env\n.DS_Store\n`
  );
  log.file('.gitignore');

  // README - FIXED VERSION
  await fs.writeFile(
    path.join(projectPath, 'README.md'),
    `# ${projectName}

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

Built with ${answers.language} 💙
`
  );
  log.file('README.md');
}

async function initGit(projectPath) {
  log.info('Initializing Git repository...');
  log.info('Git repository ready to initialize');
}

function showSuccessMessage(projectName, answers) {
  console.log(pc.bold(pc.green('\n🎉 Project created successfully!\n')));
  
  console.log(pc.bold('📋 Next steps:'));
  console.log(pc.cyan('➜') + ' ' + pc.bold(`cd ${projectName}`));
  console.log(pc.cyan('➜') + ' ' + pc.bold('npm install'));
  console.log(pc.cyan('➜') + ' ' + pc.bold('npm run dev'));
  
  console.log(pc.gray('\n💡 Your API will be available at http://localhost:3000'));
  
  if (answers.initGit) {
    console.log(pc.yellow('\n📝 Remember to run: git init && git add . && git commit -m "Initial commit"'));
  }
  
  console.log('');
}
