import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// Helper interface for resource
interface Resource {
  name: string;
  alias: string;
  type: 'api' | 'client'; // Updated to include 'client' type
  method?: string; // Add HTTP method to distinguish different route types
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

function convertPathToAlias(routePath: string, moduleName: string, method: string = 'GET'): string {
  const cleanPath = routePath.replace(/^\//, '').replace(/\/:[^/]+/g, '');

  // Capitalize module name (singular form)
  const moduleNameSingular = moduleName.replace(/s$/, '');
  const capitalizedModule =
    moduleNameSingular.charAt(0).toUpperCase() + moduleNameSingular.slice(1);

  // Determine action based on route path and method
  switch (true) {
    case cleanPath === 'all' && method === 'get':
      return `Get All ${capitalizedModule}s`;
    case cleanPath === 'create' && method === 'post':
      return `Create ${capitalizedModule}`;
    case cleanPath.includes('update') && method === 'patch':
      return `Update ${capitalizedModule}`;
    case cleanPath.includes('update') && method === 'put':
      return `Update ${capitalizedModule}`;
    case cleanPath.includes('delete') && method === 'delete':
      return `Delete ${capitalizedModule}`;
    case cleanPath === '' || cleanPath === ':id':
      return method === 'get'
        ? `Get ${capitalizedModule} By ID`
        : `${method.toUpperCase()} ${capitalizedModule}`;
    default:
      return `${method.toUpperCase()} ${capitalizedModule} - ${cleanPath}`;
  }
}

function extractResourcesFromRouteFile(filePath: string): Resource[] {
  const resources: Resource[] = [];
  const uniqueResourcePaths = new Set<string>();

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // More comprehensive regex to match router method calls
    const routeRegex = /router\.(get|post|put|patch|delete)\(['"]([^'"]+)['"].*\)/g;

    // Extract module name
    const moduleName = path.basename(filePath, '.routes.ts').replace('.', '');

    let match;
    while ((match = routeRegex.exec(fileContent)) !== null) {
      const [, method, routePath] = match;

      // Construct full route path
      const fullRoutePath = `/api/v1/${moduleName}${routePath}`;

      // Create a unique key to prevent duplicates
      const uniqueKey = `${method}:${fullRoutePath}`;

      if (!uniqueResourcePaths.has(uniqueKey)) {
        const resource: Resource = {
          name: fullRoutePath,
          alias: convertPathToAlias(routePath, moduleName, method),
          type: 'api',
          method: method.toUpperCase()
        };

        resources.push(resource);
        uniqueResourcePaths.add(uniqueKey);
      }
    }

    return resources;
  } catch (error) {
    console.error(chalk.red(`Error processing file ${filePath}:`), error);
    return [];
  }
}

function generateClientResources(moduleName: string): Resource[] {
  // Define common client-side resources for a typical CRUD module
  const clientResources: Resource[] = [
    {
      name: `/dashboard/${moduleName}`,
      alias: `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Dashboard`,
      type: 'client'
    },
    {
      name: `/dashboard/${moduleName}/list`,
      alias: `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} List View`,
      type: 'client'
    },
    {
      name: `/dashboard/${moduleName}/create`,
      alias: `Create New ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`,
      type: 'client'
    },
    {
      name: `/dashboard/${moduleName}/edit`,
      alias: `Edit ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`,
      type: 'client'
    },
    {
      name: `/${moduleName}/view`,
      alias: `View ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Details`,
      type: 'client'
    }
  ];

  return clientResources;
}

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
            // Extract API resources
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
              // Create a unique key to prevent duplicates
              const uniqueKey = `${resource.method}:${resource.name}`;

              if (!uniqueResourcePaths.has(uniqueKey)) {
                uniqueResourcePaths.add(uniqueKey);
                allResources.push(resource);
              }
            });

            // Generate client-side resources
            const moduleName = path.basename(filePath, '.routes.ts').replace('.', '');
            const clientResources = generateClientResources(moduleName);

            clientResources.forEach((clientResource) => {
              if (!uniqueResourcePaths.has(clientResource.name)) {
                uniqueResourcePaths.add(clientResource.name);
                allResources.push(clientResource);
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

    return allResources;
  }

  return findRouteFiles(modulesPath);
}

function generatePermissions(resources: Resource[]): Permission[] {
  // Generate permissions for both API and client resources
  return resources.map((resource) => ({
    resourceName: resource.name,
    resourceAlias: resource.alias,
    roleName: 'superadmin',
    roleAlias: 'Superadmin',
    isAllowed: true,
    isDisabled: false
  }));
}

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
  convertPathToAlias,
  generateClientResources
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
