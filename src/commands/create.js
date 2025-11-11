import { prompts } from '../utils/prompts.js';
import { validator } from '../utils/validators.js';
import { ProjectGenerator } from '../generators/ProjectGenerator.js';
import { logger } from '../utils/logger.js';

export async function createProject(projectName) {
  try {
    logger.header('ZeroAPI - Creating your project');

    // Validate project name
    const validationResult = validator.projectName(projectName);
    if (validationResult !== true) {
      logger.error(validationResult);
      process.exit(1);
    }

    // Get user preferences
    const answers = await prompts.projectSetup();

    // Generate project
    const generator = new ProjectGenerator(projectName, answers);
    await generator.generate();

  } catch (error) {
    logger.error(`Failed to create project: ${error.message}`);
    process.exit(1);
  }
}
