// ...existing code...
# Blood Connect

A lightweight web app to connect blood donors and recipients. Built with Vite, React, TypeScript, Tailwind CSS and shadcn-ui. Designed for fast local development and easy deployment.

## Project overview

Blood Connect helps users:
- Register as donors or requesters
- Search for donors by blood group and location
- View donor profiles and availability
- (Optional) Admin dashboard to manage users and requests

This repository contains the frontend application. Backend or AI components (if any) are separate or integrated via APIs.

## Features

- Donor / Recipient registration forms
- Search and filtering by blood group, city, distance
- Responsive UI using shadcn-ui + Tailwind
- TypeScript for type safety
- Ready for integration with REST or GraphQL APIs

## Tech stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui (components)
- Node.js & npm

## Getting started (local)

Prerequisites:
- Node.js (16+ recommended)
- npm or yarn

Steps:

1. Install dependencies
```bash
npm install
```

2. Start dev server
```bash
npm run dev
```

3. Open the app
- Visit http://localhost:5173 (or URL shown by Vite)

## Available scripts

- npm run dev — start development server
- npm run build — produce optimized production build
- npm run preview — preview production build locally
- npm test — run unit tests (if configured)
- npm run lint — run linters (if configured)

Adjust scripts in package.json if different.

## Environment variables

If the app calls external APIs (backend, maps, notifications), create a .env file at project root and add keys (example):

```
VITE_API_BASE_URL=https://api.example.com
VITE_MAPS_API_KEY=your_maps_key
```

Restart the dev server after changing env vars.

## Deployment

Build and deploy the app to your preferred static host:

1. Build:
```bash
npm run build
```

2. Deploy the contents of the `dist/` folder to:
- Vercel, Netlify, GitHub Pages, or any static hosting
- (If deploying to Azure Static Web Apps or Azure App Service, follow Azure best practices)

## Contributing

- Fork the repo
- Create a feature branch
- Open a pull request with a clear description
- Keep commits small and focused

## Notes

- This README focuses on the frontend. If your project includes backend services, machine learning models, or Azure deployments, add a dedicated README or sections for those components with instructions and required environment variables.
- Replace placeholder URLs and API keys with your actual services.

## License & contact

Specify your license (e.g., MIT) in LICENSE file.

For questions or updates, open an issue or contact the repository owner.
