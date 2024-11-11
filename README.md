# SuperViz Realtime AI Game

This project showcases the power of SuperViz's Realtime library combined with AI, creating an interactive multiplayer game inspired by Infinite Craft.

This Next.js application demonstrates real-time collaboration using SuperViz's Realtime library and OpenAI for element generation. Players combine elements to create new ones, competing for points in a shared game space.

For a detailed explanation of the project and its implementation, please refer to our blog post: ["Realtime meets AI: How we used gaming to showcase our new library"](https://dev.to/superviz/realtime-meets-ai-how-we-used-gaming-to-showcase-our-new-library-now-open-souce-3fgm).

## Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose
- PostgreSQL
- OpenAI API key
- SuperViz API key

## How to Run

1. Clone the repository:
    
    ```bash
    git clone https://github.com/SuperViz/sv-activiation-app.git
    cd realtime-ai-game
    ```
    
2. Create a .env file in the root directory with the following variables:
    
    ```
    DATABASE_URL=postgresql://username:password@localhost:5432/database_name
    AZURE_OPEN_AI=your_openai_api_key
    NEXT_PUBLIC_DEVELOPER_KEY=your_superviz_api_key
    ```
    

1. Start the Docker containers:
    
    ```bash
    docker-compose up -d
    ```
    
2. Install dependencies:
    
    ```bash
    npm install
    ```
    
3. Run database migrations:
    
    ```bash
    npm run migrate
    ```
    
4. Start the development server:
    
    ```bash
    npm run dev
    ```
    
5. Open your browser and navigate to http://localhost:3000

## Features

- Real-time notification using SuperViz Realtime library
- AI-powered element generation with Azure OpenAI
- Dynamic dashboard for tracking player progress
- Presence indicators for online/offline status

## License

This project is open source and available under the MIT License.