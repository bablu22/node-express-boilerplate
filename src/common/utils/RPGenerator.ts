import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// Helper interface for resource
interface Resource {
  name: string;
  alias: string;
  type: string;
}

// Interface for Permission
interface Permission {
  resourceName: string;
  resourceAlias: string;
  roleName: string;
  roleAlias: string;
  isAllowed: boolean;
  isDisabled: boolean;
}

// Function to convert route path to a readable alias
function convertPathToAlias(routePath: string, moduleName: string): string {
  // Remove parameters like :id and initial /
  const cleanPath = routePath.replace(/^\//, '').replace(/\/:[^/]+/g, '');

  // Capitalize module name (singular form)
  const moduleNameSingular = moduleName.replace(/s$/, '');

  // Determine action based on route path
  switch (true) {
    case cleanPath === 'all':
      return `Get All ${moduleNameSingular.charAt(0).toUpperCase() + moduleNameSingular.slice(1)}s`;
    case cleanPath === 'create':
      return `Create ${moduleNameSingular.charAt(0).toUpperCase() + moduleNameSingular.slice(1)}`;
    case cleanPath.includes('update'):
      return `Update ${moduleNameSingular.charAt(0).toUpperCase() + moduleNameSingular.slice(1)}`;
    case cleanPath.includes('delete'):
      return `Delete ${moduleNameSingular.charAt(0).toUpperCase() + moduleNameSingular.slice(1)}`;
    default:
      return `Get ${moduleNameSingular.charAt(0).toUpperCase() + moduleNameSingular.slice(1)} By ID`;
  }
}

// Function to extract resources from a route file
function extractResourcesFromRouteFile(filePath: string): Resource[] {
  const resources: Resource[] = [];

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Regex to match router method calls
    const routeRegex = /router\.(get|post|put|patch|delete)\(['"]([^'"]+)['"].*\)/g;

    // Extract module name
    const moduleName = path.basename(filePath, '.routes.ts').replace('.', '');

    let match;
    while ((match = routeRegex.exec(fileContent)) !== null) {
      const [, , routePath] = match;

      // Construct full route path
      const fullRoutePath = `/api/v1/${moduleName}${routePath}`;

      resources.push({
        name: fullRoutePath,
        alias: convertPathToAlias(routePath, moduleName),
        type: 'api'
      });
    }

    return resources;
  } catch (error) {
    console.error(chalk.red(`Error processing file ${filePath}:`), error);
    return [];
  }
}

// Function to generate resources from all route files
function generateResources(modulesPath: string): Resource[] {
  const allResources: Resource[] = [];
  const uniqueResourcePaths = new Set<string>();

  // Recursively find route files
  function findRouteFiles(dir: string) {
    try {
      const files = fs.readdirSync(dir);

      files.forEach((file) => {
        const filePath = path.join(dir, file);

        try {
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            findRouteFiles(filePath);
          } else if (file.endsWith('.routes.ts')) {
            const fileResources = extractResourcesFromRouteFile(filePath);
            const filteredResources = fileResources.filter(
              (resource) =>
                !resource.name.includes('/auth/') &&
                !resource.name.includes('/session/') &&
                !resource.name.includes('/mfa/') &&
                !resource.name.includes('/resources') &&
                !resource.name.includes('/permissions')
            );

            filteredResources.forEach((resource) => {
              if (!uniqueResourcePaths.has(resource.name)) {
                uniqueResourcePaths.add(resource.name);
                allResources.push(resource);
              }
            });
          }
        } catch (fileError) {
          console.error(chalk.yellow(`Error processing file ${filePath}:`), fileError);
        }
      });
    } catch (dirError) {
      console.error(chalk.red(`Error reading directory ${dir}:`), dirError);
    }
  }

  findRouteFiles(modulesPath);
  return allResources;
}

// Function to generate permissions from resources
function generatePermissions(resources: Resource[]): Permission[] {
  // Generate permissions for non-filtered resources
  return resources.map((resource) => ({
    resourceName: resource.name,
    resourceAlias: resource.alias,
    roleName: 'superadmin',
    roleAlias: 'Superadmin',
    isAllowed: true,
    isDisabled: false
  }));
}

// Function to save resources and generate permissions
function generateResourcesAndPermissions(
  modulesPath: string,
  resourceOutputPath: string,
  permissionOutputPath: string
) {
  try {
    // Ensure output directories exist
    fs.mkdirSync(path.dirname(resourceOutputPath), { recursive: true });
    fs.mkdirSync(path.dirname(permissionOutputPath), { recursive: true });

    // Generate resources
    const resources = generateResources(modulesPath);

    // Sort resources for consistent output
    resources.sort((a, b) => a.name.localeCompare(b.name));

    // Write resources to file
    fs.writeFileSync(resourceOutputPath, JSON.stringify(resources, null, 2), 'utf-8');

    console.log(chalk.green(`✓ Resources generated successfully!`));
    console.log(chalk.blueBright(`Total Resources: ${resources.length}`));
    console.log(chalk.blue(`Saved to: ${resourceOutputPath}`));

    // Generate permissions
    const permissions = generatePermissions(resources);

    // Write permissions to file
    fs.writeFileSync(permissionOutputPath, JSON.stringify(permissions, null, 2), 'utf-8');

    console.log(chalk.green(`✓ Permissions generated successfully!`));
    console.log(chalk.blueBright(`Total Permissions: ${permissions.length}`));
    console.log(chalk.blue(`Saved to: ${permissionOutputPath}`));
  } catch (error) {
    console.error(chalk.red('✗ Failed to generate resources and permissions:'), error);
    process.exit(1);
  }
}

// Export for potential module usage
export {
  generateResourcesAndPermissions,
  generateResources,
  generatePermissions,
  convertPathToAlias
};

// If running as a script
if (require.main === module) {
  try {
    const modulesPath = path.resolve(__dirname, '../../modules');
    const resourceOutputPath = path.join(__dirname, '../../database/seed/resources.jsonc');
    const permissionOutputPath = path.join(__dirname, '../../database/seed/permissions.jsonc');

    console.log(chalk.cyan('Starting Resources and Permissions Generation...'));
    console.log(chalk.gray(`Modules Path: ${modulesPath}`));
    console.log(chalk.gray(`Resources Output Path: ${resourceOutputPath}`));
    console.log(chalk.gray(`Permissions Output Path: ${permissionOutputPath}`));

    generateResourcesAndPermissions(modulesPath, resourceOutputPath, permissionOutputPath);
  } catch (error) {
    console.error(chalk.red('✗ Unexpected error:'), error);
    process.exit(1);
  }
}
