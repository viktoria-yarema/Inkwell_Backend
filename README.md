# Inkwell Backend

Welcome to the Inkwell Backend repository, the server-side component of the Inkwell platform.

## Overview

Inkwell is a modern platform designed for writers and content creators to publish, share, and monetize their written content. This repository contains the backend API and services that power the Inkwell platform.

## Technologies

- Node.js
- Express.js
- MongoDB
- Authentication with JWT
- RESTful API architecture

## Features

- User authentication and authorization
- Content management (articles, stories, posts)
- User profiles and preferences
- Analytics for content creators
- Payment processing integration
- Comment and engagement systems

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/Inkwell_Backend.git
   cd Inkwell_Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/inkwell
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

## API Documentation

The API documentation is available at `/api/docs` when the server is running.

## Project Structure

```
Inkwell_Backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middlewares
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── app.js          # Express app setup
├── tests/              # Test files
├── .env                # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/viktoria-yarema/Inkwell_Backend](https://github.com/viktoria-yarema/Inkwell_Backend)

## Google Cloud Storage Setup

To use the image upload functionality with Google Cloud Storage:

1. Create a Google Cloud Storage bucket with the name `inkwell_bucket` (or update the `INKWELL_GOOGLE_STORAGE_BUCKET` environment variable with your bucket URL)
2. Create a service account with Storage Admin permissions for the bucket
3. Download the service account key as JSON
4. Save the key as `google-credentials.json` in the root of the project
5. Set the following environment variable to point to your credentials file:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
   ```

## API Endpoints for Image Upload

The following endpoints are available for image management:

- `POST /api/images/upload` - Upload a new image (requires authentication)
  - Request: Multipart form with an `image` field
  - Optional: `articleId` field to associate with an article
  - Response: Image metadata including URL

- `GET /api/images` - Get all images for the authenticated user
  - Response: Array of image metadata

- `DELETE /api/images/:id` - Delete an image by ID
  - Response: Success message

## Environment Variables

Add this to your .env file:

```
INKWELL_GOOGLE_STORAGE_BUCKET=https://storage.cloud.google.com/inkwell_bucket/
```

