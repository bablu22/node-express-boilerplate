import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { camelCase, upperFirst } from 'lodash';

// Template imports (these would be defined in separate files)
import { interfaceTemplate } from './templates/interface';
import { controllerTemplate } from './templates/controller';
import { serviceTemplate } from './templates/service';
import { modelTemplate } from './templates/model';
import { routesTemplate } from './templates/router';
import { validationTemplate } from './templates/validation';

// Utility interfaces
interface ModuleGenerationOptions {
  moduleName: string;
  folderName: string;
}

interface FileTemplate {
  name: string;
  template: string;
}

// Utility functions
export const utils = {
  validateInput: {
    /**
     * Validates if the input is a valid module name
     * @param input - Module name to validate
     * @returns boolean indicating if the name is valid
     */
    isValidModuleName: (input: string): boolean => {
      const moduleNameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;
      return moduleNameRegex.test(input);
    },
  },

  formatName: {
    /**
     * Converts string to camelCase
     * @param input - Input string to convert
     * @returns camelCased string
     */
    toCamelCase: (input: string): string => camelCase(input),

    /**
     * Converts string to UpperCamelCase (PascalCase)
     * @param input - Input string to convert
     * @returns UpperCamelCased string
     */
    toUpperCamelCase: (input: string): string => upperFirst(camelCase(input)),
  },
};

/**
 * Main module generation function
 * Generates a complete module structure with various files
 */
async function generateModule(): Promise<void> {
  console.log(chalk.blue('🚀 Node.js Module Generator'));

  try {
    // Prompt for module details
    const { moduleName, folderName } = await inquirer.prompt<ModuleGenerationOptions>([
      {
        type: 'input',
        name: 'moduleName',
        message: 'Enter the module name (e.g., user, product):',
        validate: (input: string) => {
          if (utils.validateInput.isValidModuleName(input)) {
            return true;
          }
          return 'Module name must start with a letter and contain only alphanumeric characters.';
        },
      },
      {
        type: 'input',
        name: 'folderName',
        message: 'Enter the folder name (optional, press enter to use module name):',
        default: (answers) => answers.moduleName,
      },
    ]);

    // Format names for consistency
    const moduleNameCamel = utils.formatName.toCamelCase(moduleName);
    const moduleNamePascal = utils.formatName.toUpperCamelCase(moduleName);

    // Ensure the folder name reflects the user's capitalization
    const folderNameSafe = /^[A-Z]+$/.test(folderName) ? folderName : folderName.toLowerCase();

    // Define the module folder path
    const moduleFolderPath = path.join(process.cwd(), 'src', 'modules', folderNameSafe);

    // Check if module folder already exists
    if (fs.existsSync(moduleFolderPath)) {
      console.error(chalk.red(`❌ Folder '${folderNameSafe}' already exists.`));
      process.exit(1);
    }

    // Define files to create
    const filesToCreate: FileTemplate[] = [
      { name: 'interface', template: interfaceTemplate },
      { name: 'controller', template: controllerTemplate },
      { name: 'service', template: serviceTemplate },
      { name: 'model', template: modelTemplate },
      { name: 'routes', template: routesTemplate },
      { name: 'validation', template: validationTemplate },
    ];

    // Create module folder
    fs.mkdirSync(moduleFolderPath, { recursive: true });

    // Generate files
    filesToCreate.forEach(({ name, template }) => {
      // Replace placeholders in template
      const fileContent = template
        .replace(/{{moduleName}}/g, moduleNameCamel)
        .replace(/{{ModuleName}}/g, moduleNamePascal);

      // Create file path
      const filePath = path.join(moduleFolderPath, `${moduleNameCamel}.${name}.ts`);

      // Write file
      fs.writeFileSync(filePath, fileContent, { encoding: 'utf8' });
      console.log(chalk.green(`✅ Created: ${path.basename(filePath)}`));
    });

    console.log(chalk.blue('🎉 Module generation completed successfully!'));
  } catch (error) {
    console.error(chalk.red('❌ An error occurred:'), error);
    process.exit(1);
  }
}

// Export as default for module usage
export default generateModule;

// Allow direct script execution
if (require.main === module) {
  generateModule().catch((error) => {
    console.error(chalk.red('❌ Unhandled error:'), error);
    process.exit(1);
  });
}
