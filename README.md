# vibe-coding


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