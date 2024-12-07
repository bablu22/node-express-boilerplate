import config from '@/config/app.config';
import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const modulesPath = path.resolve(__dirname, '../modules');

interface ModuleRoute {
  path: string;
  routes: Router;
}

const loadRoutes = async (): Promise<ModuleRoute[]> => {
  const moduleRoutes: ModuleRoute[] = [];
  const moduleNames = fs.readdirSync(modulesPath);

  console.info(`📂 Starting to load routes from modules in directory: ${modulesPath}`);

  for (const moduleName of moduleNames) {
    const routesFilePath = path.join(modulesPath, moduleName, `${moduleName}.routes.js`);

    if (fs.existsSync(routesFilePath)) {
      try {
        // console.info(`📄 Found routes file for module "${moduleName}" at: ${routesFilePath}`);
        const { default: routes } = (await import(routesFilePath)) as { default: Router };

        moduleRoutes.push({
          path: `/${moduleName}`,
          routes
        });

        console.info(
          `✅ Successfully loaded routes for module: "${moduleName}" at path: /${moduleName}`
        );
      } catch (error: any) {
        console.error(`❌ Error loading routes for module "${moduleName}"`, {
          moduleName,
          routesFilePath,
          error: error.message,
          stack: error.stack
        });
      }
    } else {
      console.warn(`⚠️ Routes file not found for module "${moduleName}" at: ${routesFilePath}`);
    }
  }

  console.info(`📂 Finished loading routes. Total modules loaded: ${moduleRoutes.length}`);
  return moduleRoutes;
};

loadRoutes()
  .then((moduleRoutes) => {
    moduleRoutes.forEach((route) => {
      router.use(route.path, route.routes);
      if (config.NODE_ENV === 'development') {
        console.info(`🚀 Route registered: [${route.path}]`);
      }
    });
    console.log(' ');
  })
  .catch((error) => {
    console.error('❌ Critical error during route loading:', {
      message: error.message,
      stack: error.stack
    });
  });

export default router;
