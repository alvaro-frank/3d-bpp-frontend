![React](https://img.shields.io/badge/React-19.2%2B-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.183-black?logo=three.js&logoColor=white)

An interactive and high-performance frontend for the 3D Bin Packing optimization service. This application allows users to manually input custom boxes or auto-generate randomized test cases, sending them to the backend engine to calculate the optimal packing plan. The results are then visualized in an interactive 3D environment powered by **React Three Fiber** and **Three.js**.

## 📂 Project Structure
```text
├── public/                 # Static assets (Favicon, icons)
├── src/
│   ├── assets/             # Images and global UI assets
│   ├── components/         # Reusable UI components
│   │   ├── PackingForm.tsx # Form for manual box entry and auto-generation
│   │   └── PackingVisualizer.tsx # 3D Canvas rendering the packed boxes
│   ├── hooks/              # Custom React hooks
│   │   └── usePacking.ts   # Manages state and side-effects for API calls
│   ├── services/           # External API integrations
│   │   └── api.ts          # Fetch requests to the FastAPI backend
│   ├── types/              # TypeScript interfaces and DTOs
│   │   └── index.ts        # Type definitions for Containers, Boxes, and Responses
│   ├── App.tsx             # Main application layout and state orchestration
│   ├── main.tsx            # React application entry point
│   └── index.css           # Global CSS and CSS variables
├── package.json            # Project dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration and backend API proxying
```

## 🛠️ Setup & Requirements

- `Node.js 18+` (or a compatible modern version)
- `npm` (or `yarn` / `pnpm`)

1. **Clone the repository**
```bash
git clone [https://github.com/alvaro-frank/3d-bpp-frontend.git](https://github.com/alvaro-frank/3d-bpp-frontend.git)
cd 3d-bpp-frontend
```

2. **Install dependencies**
```bash
npm run install
```

## ⚡ Quick Start

To run the application locally in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the local port specified by Vite in your terminal).

_Note: For the application to work end-to-end, ensure the 3D-BPP Backend is running locally on `http://localhost:8000`. Vite is configured to proxy all /api requests directly to this port to avoid CORS issues._

## 🏃 Usage & Features

The interface is divided into two main panels:

**1. Packing Controls**
- **Manual Entry:** Add specific boxes by entering their dimensions (Width, Depth, and Height).
- **Auto-Generate:** Automatically create a randomized set of boxes using a recursive splitting algorithm that guarantees they fit within the volume.
- **Volume Tracking:** A real-time visual progress bar displays the current total volume of added boxes compared to the maximum container capacity.

**2. 3D Visualization**
- Once the backend returns the optimal packing coordinates, the `PackingVisualizer` renders the output.
- **Interactivity:** Scroll to zoom, and click-and-drag to orbit around the 3D bounding container to inspect the arrangement from any angle.

## 🧠 Methodology & Architecture

**Declarative 3D Rendering**
The 3D scene is rendered using `three.js` via the `@react-three/fiber` (R3F) wrapper. This allows the 3D graphics to be driven declaratively by the React component state. `@react-three/drei` is used for out-of-the-box orbit controls and wireframe edge rendering.

**State Management & API**
The component state and backend synchronization are abstracted into the `usePacking.ts` custom hook. This ensures the main UI remains clean and responsive during optimization calculations. The data types are strictly typed with TypeScript interfaces to map perfectly 1:1 with the backend's Pydantic schemas.

**Code Quality**
The repository is maintained with strict TypeScript rules and ESLint standard configurations to ensure clean, error-free code.

```bash
# Run the linter
npm run lint

# Build for production
npm run build
```

## ⚙️ CI/CD Pipeline

The project includes a GitHub Actions workflow (`ci.yml`) that automates the quality gate for the frontend application. On every push or pull request to the main branch, the pipeline executes the following checks:

- **Dependency Installation:** Fast and deterministic installs using `npm ci`.
- **Linting:** Runs ESLint to ensure code quality and consistent styling.
- **Build Verification:** Executes Vite's build process and TypeScript's type-checking to guarantee the application compiles successfully without errors before any code is merged.

## 🐳 Docker Support

The frontend application is optimized for containerized deployment using a multi-stage build process:

- **Build Stage**: Uses a lightweight `node:18-alpine` image to install dependencies and compile the Vite/React application.
- **Production Stage**: Uses `nginx:alpine` to serve the static compiled assets (`/dist`), resulting in a tiny, highly performant final image.
- **SPA Routing**: The Nginx server is pre-configured to fallback to `index.html`, ensuring seamless support for React client-side routing.

To build and run the Docker container locally:

```bash
# Build the Docker image
docker build -t 3d-bpp-frontend .

# Run the container (mapping port 8080 on your host to port 80 in the container)
docker run -p 8080:80 3d-bpp-frontend
```

The application will then be accessible in your browser at `http://localhost:8080`.
