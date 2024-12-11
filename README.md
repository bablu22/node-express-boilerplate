# 🚀 **Node.js Express TypeScript Boilerplate**

## 📝 **Project Overview**

This boilerplate is a robust, production-ready Node.js and Express.js project template designed to supercharge your backend development. Equipped with TypeScript, advanced authentication mechanisms, Role-Based Access Control (RBAC), flexible querying capabilities, and seamless integrations with MongoDB and Redis, it ensures a smooth and efficient development experience.

---

## ✨ **Key Features**

### 🔐 **Advanced Authentication**

- Multi-factor authentication (MFA) support
- JWT-based authentication for secure sessions
- Comprehensive Role-Based Access Control (RBAC)

### 🛠 **Powerful Development Tools**

- **TypeScript**: Ensure type safety and reduce runtime errors
- **ESLint**: Maintain code quality
- **Prettier**: Enforce consistent code formatting
- **Husky**: Leverage Git hooks for streamlined workflows

### 📦 **Modular Architecture**

- Automatic module scaffolding
- Effortless route integration
- Simplified resource and permission management

### 💾 **Flexible Storage Options**

- Local file system storage
- Cloudinary integration for cloud-based storage

### 🔍 **Dynamic Querying**

- QueryBuilder for flexible and advanced data retrieval
- Comprehensive filtering, searching, sorting, and population options

---

## 🛠 **Prerequisites**

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB
- Redis

---

## 🚦 **Quick Start**

### 1. Clone the Repository

```bash
git clone https://github.com/bablu22/node-express-boilerplate.git
cd node-express-boilerplate
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Copy the environment template
cp .env.example .env

# Update .env with your configuration
vim .env
```

---

## 📋 **Available Scripts**

| Script                    | Description                                  |
| ------------------------- | -------------------------------------------- |
| `npm run dev`             | Start the development server with hot reload |
| `npm run build`           | Compile TypeScript into JavaScript           |
| `npm start`               | Launch the production server                 |
| `npm run lint`            | Perform code quality checks with ESLint      |
| `npm run format`          | Apply Prettier formatting rules              |
| `npm run generate:module` | Create a new module scaffold                 |
| `npm run db:seed`         | Seed the database with initial data          |

---

## 🔧 **Module Generation**

Easily generate a new module with a predefined scaffold:

```bash
npm run generate:module
```

This command generates the following structure in `src/modules/<moduleName>/`:

- `<moduleName>.interface.ts`
- `<moduleName>.service.ts`
- `<moduleName>.model.ts`
- `<moduleName>.routes.ts`
- `<moduleName>.controller.ts`
- `<moduleName>.validation.ts`

🔔 **Note**: Generated modules are automatically integrated into the application's route system.

---

## 🔐 **Authentication & Authorization**

### Standard Authentication

```typescript
// Use authenticateJWT for basic JWT authentication
router.get('/route', authenticateJWT, Controller.method);
```

### Role-Based Access Control (RBAC)

```typescript
// Use authorizeRequest for role-based access
router.post(
  '/create',
  authenticateJWT,
  authorizeRequest(['Admin', 'Editor']),
  Controller.createMethod
);
```

---

## 🔍 **QueryBuilder Usage**

### Basic Search

```typescript
const products = await new QueryBuilder(Product, {
  searchTerm: 'smartphone',
  page: 1,
  limit: 10
})
  .search(['name', 'description'])
  .execute();
```

### Advanced Filtering

```typescript
const filteredProducts = await new QueryBuilder(Product, {
  sort: '-price',
  page: 1,
  limit: 20
})
  .advancedFilter({
    price: { $gte: 100, $lte: 1000 },
    brand: { $in: ['Apple', 'Samsung'] },
    inStock: true
  })
  .execute();
```

---

## 💾 **Storage Configuration**

Set up your preferred storage solution in the `.env` file:

```env
# Local File System
STORAGE_TYPE=local

# Cloudinary Integration
STORAGE_TYPE=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 **Deployment**

### 1. Build the Project

```bash
npm run build
```

### 2. Launch the Production Server

```bash
npm start
```

---

## 🤝 **Contributing**

1. Fork the repository.
2. Create a new feature branch:

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. Commit your changes:

   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. Push the branch:

   ```bash
   git push origin feature/AmazingFeature
   ```

5. Submit a Pull Request.

---

## 📄 **License**

This project is licensed under the MIT License. See `LICENSE.md` for details.

---

## 🙌 **Acknowledgements**

- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Mongoose](https://mongoosejs.com/)
- [Passport.js](http://www.passportjs.org/)

---

**Happy Coding! 💻🚀**
