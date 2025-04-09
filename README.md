# vibe-coding: Rock-Paper-Scissors 3D Game

This is an interactive 3D web application where users can play Rock-Paper-Scissors against an AI. The game is built using Three.js for 3D rendering and cannon-es for physics simulation. The AI opponent is powered by OpenAI's GPT-3.5-turbo model.

## How to Play
1. Drag and release one of the 3D objects (Rock, Paper, or Scissors) to make your choice.
2. The AI will randomly select Rock, Paper, or Scissors.
3. The result (Win, Lose, or Draw) will be displayed on the screen along with the choices made by both the user and the AI.

## Setup Instructions

### Prerequisites
- Node.js (v20 or higher)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vibe-hackaton
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```bash
   cp .env.example .env
   ```
   Replace `your-secret-key` in the `.env` file with your actual OpenAI API key.

4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the application in your browser at `http://localhost:3000`.

## Environment Variables
The application requires the following environment variable:
- `VITE_OPENAI_API_KEY`: Your OpenAI API key.

## Technologies Used
- [Three.js](https://threejs.org/): 3D rendering
- [cannon-es](https://github.com/pmndrs/cannon-es): Physics engine
- [OpenAI API](https://openai.com/): AI opponent
- [Vite](https://vitejs.dev/): Build tool

## The prompt

```
Build a 3D web app using Three.js and a physics engine like cannon-es or ammo.js. The goal is to create an interactive scene where users can throw 3D rock/paper/scissor models with their mouse. Here's the step-by-step breakdown:

1. Initialize the Project
- Set up a basic HTML/CSS/JS project using Vite, Parcel, or plain HTML.
- Install three and a physics engine (e.g., cannon-es).
- Create a basic scene with: Camera, Lighting, Renderer attached to the DOM, OrbitControls for camera movement

2. Load & Display 3D Models
- Import or create 3D models for Rock, Paper, and Scissors (use .glb or .gltf).
- Use GLTFLoader to load models and add them to the scene.
- Position the models in an easy-to-reach area in 3D space.
- Display each object with a small hover animation or visual cue to indicate interactivity.

3. Add Gravity & Physics
- Initialize the physics world using cannon-es.
- Add rigid bodies for each model:
- Give appropriate mass, shape (box/sphere/convex), and material.
- Enable gravity in the world.
- Synchronize Three.js mesh positions with physics body positions in the render loop.
- Add a simple floor plane for them to land on.

4. Add Mouse Interaction (Click & Throw)
- Detect when the user clicks on an object (use Raycaster).
- On mousedown, record mouse position.
- On mouseup, calculate mouse delta (movement vector).
- Convert the 2D movement into a 3D force vector.
- Apply that force to the physics body of the clicked object using .applyImpulse() or .applyForce().
```

## License
This project is licensed under the MIT License.