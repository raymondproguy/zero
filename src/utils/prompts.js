import inquirer from 'inquirer';

export const prompts = {
  projectSetup: () => inquirer.prompt([
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
  ])
};
