# Node.js Express TypeScript Boilerplate

## Project Overview

This is a robust Node.js Express.js boilerplate project configured with TypeScript, ESLint, Prettier, and Husky for consistent code quality and development experience.

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

## Project Structure

```
project-root/
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── app.ts
│
├── tests/
├── config/
├── logs/
├── .husky/
├── dist/
│
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
├── .env.example
└── README.md
```

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
