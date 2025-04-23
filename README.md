# Inkwell Backend

Welcome to the Inkwell Backend repository, the server-side component of the Inkwell platform.

## Overview

Inkwell is a modern platform designed for writers and content creators to publish, share, and monetize their written content. This repository contains the backend API and services that power the Inkwell platform, built with TypeScript and following clean architecture principles.

## Technology Stack

### Core Technologies

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Google Cloud Storage
- **API Architecture**: RESTful

### Development Tools

- **Code Quality**: ESLint, Prettier
- **Type Safety**: TypeScript
- **Version Control**: Git with Husky pre-commit hooks
- **Package Management**: npm/yarn
- **Development Server**: tsx (TypeScript execution)
- **Build Tool**: tsc (TypeScript Compiler)

## Features

- User authentication and authorization
- Content management (articles, stories, posts)
- User profiles and preferences
- File upload and management with Google Cloud Storage
- Rate limiting and request throttling
- Input validation and sanitization
- Cookie-based session management
- Image processing with Sharp
- CORS support
- Environment-based configuration

## Project Architecture

The project follows a clean architecture pattern with clear separation of concerns:

```
Inkwell_Backend/
├── src/                      # Source code
│   ├── configs/             # Configuration files and constants
│   ├── controllers/         # Request handlers and route logic
│   ├── middlewares/        # Express middleware functions
│   ├── models/             # MongoDB/Mongoose models and schemas
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic and external service integration
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions and helpers
│   └── app.ts              # Application entry point
├── scripts/                 # Build and deployment scripts
├── .github/                 # GitHub Actions and workflows
├── .husky/                 # Git hooks configuration
├── build/                  # Compiled JavaScript output
├── .env                    # Environment variables
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project dependencies and scripts
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google Cloud Storage account and credentials
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/Inkwell_Backend.git
   cd Inkwell_Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/inkwell
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLOUD_STORAGE_BUCKET=your_bucket_name
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Development

- `npm run dev`: Start development server with hot-reload
- `npm run build`: Build the TypeScript project
- `npm run start`: Start the production server
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check code formatting

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: [https://github.com/viktoria-yarema/Inkwell_Backend](https://github.com/viktoria-yarema/Inkwell_Backend)
