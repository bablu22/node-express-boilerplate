# Node.js Express TypeScript Boilerplate

## Project Overview

This is a robust Node.js Express.js boilerplate project configured with TypeScript, ESLint, Prettier, and Husky for consistent code quality and development experience.

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

## Setup Instructions

1. Clone the repository

```bash
git clone https://your-repo-url.git
cd your-project-name
```

2. Install dependencies

```bash
npm install
```

3. Create .env file

```bash
cp .env.example .env
```

4. Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Run compiled production server
- `npm run lint`: Run ESLint
- `npm run format`: Run Prettier
- `npm test`: Run tests

## QueryBuilder Use Cases

### 1. Product Controller with Advanced Querying

```typescript
import { Request, Response } from 'express';
import QueryBuilder from '../utils/QueryBuilder';
import Product from '../models/Product';

class ProductController {
  // Flexible Product Search with Multiple Filters
  async getAllProducts(req: Request, res: Response) {
    try {
      const queryBuilder = new QueryBuilder<IProduct>(Product, {
        // Query parameters from request
        ...req.query,
        // Configure population
        populate: [
          {
            path: 'category',
            select: 'name description',
          },
          {
            path: 'manufacturer',
            select: 'name country',
          },
        ],
      });

      const result = await queryBuilder
        .search(['name', 'description'])
        .advancedFilter({
          // Example of advanced filtering
          price: { $gte: 10, $lte: 500 },
          inStock: true,
        })
        .execute();

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  }

  // Example of specific product retrieval with advanced options
  async getProductsWithSpecificCriteria(req: Request, res: Response) {
    try {
      const queryBuilder = new QueryBuilder<IProduct>(Product, {
        // Specific field selection
        fields: 'name,price,category,ratings',
        // Custom sorting
        sort: '-price,ratings',
        // Pagination
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        // Additional filters
        category: req.query.category,
        populate: {
          path: 'category',
          select: 'name',
        },
      });

      const result = await queryBuilder.search(['name', 'description']).execute();

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  }
}
```

### 2. Example Route Implementation

```typescript
import express from 'express';
import ProductController from '../controllers/ProductController';

const router = express.Router();
const productController = new ProductController();

// GET all products with flexible querying
router.get('/products', productController.getAllProducts);

// GET products with specific criteria
router.get('/products/filtered', productController.getProductsWithSpecificCriteria);
```

### 3. Query Builder Usage Examples

#### Basic Search

```typescript
const products = await new QueryBuilder(Product, {
  searchTerm: 'smartphone',
  page: 1,
  limit: 10,
})
  .search(['name', 'description'])
  .execute();
```

#### Advanced Filtering

```typescript
const filteredProducts = await new QueryBuilder(Product, {
  sort: '-price',
  page: 1,
  limit: 20,
})
  .advancedFilter({
    price: { $gte: 100, $lte: 1000 },
    brand: { $in: ['Apple', 'Samsung'] },
    inStock: true,
  })
  .execute();
```

#### Complex Population

```typescript
const productsWithDetails = await new QueryBuilder(Product, {
  populate: [
    {
      path: 'category',
      select: 'name description',
      populate: {
        path: 'parentCategory',
        select: 'name',
      },
    },
    {
      path: 'reviews',
      select: 'rating comment',
      match: { rating: { $gte: 4 } },
    },
  ],
}).execute();
```

## Development Workflow

- Write code in `src/` directory
- Husky will run lint and format checks on pre-commit
- TypeScript provides type safety
- ESLint ensures code quality
- Prettier maintains consistent code formatting

## Deployment

1. Build the project

```bash
npm run build
```

2. Start the production server

```bash
npm start
```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
