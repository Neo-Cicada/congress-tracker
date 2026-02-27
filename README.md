# Nexus Alpha

A comprehensive web application that tracks stock trades made by members of the U.S. Congress. Stay informed about the financial activities of politicians, track their trading performance, and save interesting trades for your own research.

## Features

- **Politician Watchlist**: Add politicians to your personal watchlist to easily track their trading activities.
- **Saved Alpha**: Save specific trades that catch your eye to your profile for quick reference and analysis.
- **Interactive Dashboards**: Visualize trading data and portfolio impacts using interactive charts (powered by Recharts).
- **Secure Authentication**: Supports both local email/password registration and Google OAuth for seamless login.
- **Automated Data Fetching**: The backend uses the Quiver Quantitative API for congressional trading activity and Yahoo Finance API for market data, automated via scheduled cron jobs.

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: Custom JWT Authentication & Google OAuth (`@react-oauth/google`)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Authentication**: JWT & `google-auth-library`
- **Data & Scheduling**: `axios` (Quiver API), `yahoo-finance2`, and `node-cron`

## Architecture Overview

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:white,font-weight:bold
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:white,font-weight:bold
    classDef database fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:white,font-weight:bold
    classDef external fill:#6b7280,stroke:#374151,stroke-width:2px,color:white,font-weight:bold
    classDef component fill:#eff6ff,stroke:#93c5fd,stroke-width:1px,color:#1e3a8a

    %% Nodes
    USER((User\\nBrowser))
    
    subgraph Frontend [Next.js Frontend]
        UI[UI Components\\nTailwind & Recharts]
        AUTH_CTX[Auth Context]
        API_SVC[API Services]
        
        UI --> AUTH_CTX
        UI --> API_SVC
    end
    
    subgraph Backend [Node/Express Backend]
        API_ROUTES[API Routes\\nControllers]
        AUTH_MW[Auth Middleware]
        CRON[Cron Jobs\\nData Fetching]
        DB_MODELS[Mongoose Models]
        
        API_ROUTES --> AUTH_MW
        API_ROUTES --> DB_MODELS
        CRON --> DB_MODELS
    end
    
    subgraph Storage [Database]
        MONGO[(MongoDB)]
    end
    
    subgraph External_Services [External APIs]
        GOOGLE[Google OAuth]
        QUIVER[Quiver Quantitative API\\nCongress Trades]
        YAHOO[Yahoo Finance API\\nMarket Data]
    end

    %% Connections
    USER <--> Frontend
    USER --> GOOGLE
    
    API_SVC <-->|REST API / JWT| API_ROUTES
    AUTH_CTX <-->|Validate Token| GOOGLE
    AUTH_MW <-->|Verify JWT| AUTH_CTX
    
    DB_MODELS <--> MONGO
    
    CRON -->|Fetch Trades| QUIVER
    CRON -->|Fetch Prices| YAHOO

    %% Apply Classes
    class Frontend,UI,AUTH_CTX,API_SVC frontend
    class Backend,API_ROUTES,AUTH_MW,CRON,DB_MODELS backend
    class Storage,MONGO database
    class External_Services,GOOGLE,QUIVER,YAHOO external
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Google Cloud Console account (for Google OAuth Client ID)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nexus-alpha
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   QUIVER_API_KEY=your_quiver_api_key
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **View the Application**
   Open your browser and navigate to `http://localhost:3000`.

## License

This project is licensed under the ISC License.
