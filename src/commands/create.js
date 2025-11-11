import { prompts } from '../utils/prompts.js';
import { validator } from '../utils/validators.js';
import { ProjectGenerator } from '../generators/ProjectGenerator.js';
import { logger } from '../utils/logger.js';

export async function createProject(projectName, options) {
  try {
    logger.header('ZeroAPI - Creating your project');
    
    const validationResult = validator.projectName(projectName);
    if (validationResult !== true) {
      logger.error(validationResult);
      process.exit(1);
    }

    const answers = await prompts.projectSetup();
    
    // Merge CLI options with user answers
    const generatorOptions = {
      ...answers,
      auth: options.auth || false  // Pass the --auth flag
    };

    const generator = new ProjectGenerator(projectName, generatorOptions);
    await generator.generate();
    
  } catch (error) {
    logger.error(`Failed to create project: ${error.message}`);
    process.exit(1);
  }
}
