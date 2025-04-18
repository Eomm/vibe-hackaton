import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import OpenAI from 'openai';

// OpenAI API setup
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Use Vite's import.meta.env for environment variables
  dangerouslyAllowBrowser: true,
});

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Placeholder objects for Rock, Paper, Scissors
const rock = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x808080 })
);
rock.position.set(-3, 1, 0);
scene.add(rock);

const paper = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 0.1, 1),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
paper.position.set(0, 1, 0);
scene.add(paper);

const scissors = new THREE.Mesh(
  new THREE.ConeGeometry(0.5, 2, 32),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
scissors.position.set(3, 1, 0);
scene.add(scissors);

// Ensure bounding volumes are updated for all objects
rock.geometry.computeBoundingBox();
rock.geometry.computeBoundingSphere();

paper.geometry.computeBoundingBox();
paper.geometry.computeBoundingSphere();

scissors.geometry.computeBoundingBox();
scissors.geometry.computeBoundingSphere();

// Visualize the bounding box of the rock
const rockBoundingBoxHelper = new THREE.BoxHelper(rock, 0xff0000); // Red color for bounding box
scene.add(rockBoundingBoxHelper);

// Visualize the bounding sphere of the rock
const rockBoundingSphere = rock.geometry.boundingSphere;
let sphereMesh;
if (rockBoundingSphere) {
  const sphereGeometry = new THREE.SphereGeometry(rockBoundingSphere.radius, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }); // Blue wireframe for bounding sphere
  sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.copy(rockBoundingSphere.center);
  scene.add(sphereMesh);
}

// Visualize the bounding box and bounding sphere of the paper
const paperBoundingBoxHelper = new THREE.BoxHelper(paper, 0xff0000); // Red color for bounding box
scene.add(paperBoundingBoxHelper);

const paperBoundingSphere = paper.geometry.boundingSphere;
let paperSphereMesh;
if (paperBoundingSphere) {
  const sphereGeometry = new THREE.SphereGeometry(paperBoundingSphere.radius, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }); // Blue wireframe for bounding sphere
  paperSphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  paperSphereMesh.position.copy(paperBoundingSphere.center);
  scene.add(paperSphereMesh);
}

// Visualize the bounding box and bounding sphere of the scissors
const scissorsBoundingBoxHelper = new THREE.BoxHelper(scissors, 0xff0000); // Red color for bounding box
scene.add(scissorsBoundingBoxHelper);

const scissorsBoundingSphere = scissors.geometry.boundingSphere;
let scissorsSphereMesh;
if (scissorsBoundingSphere) {
  const sphereGeometry = new THREE.SphereGeometry(scissorsBoundingSphere.radius, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }); // Blue wireframe for bounding sphere
  scissorsSphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scissorsSphereMesh.position.copy(scissorsBoundingSphere.center);
  scene.add(scissorsSphereMesh);
}

// Physics world setup
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Create a ground plane
const groundBody = new CANNON.Body({
  mass: 0, // mass = 0 makes the body static
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// Create a visual representation for the ground plane
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x228B22 }) // Green color for the ground
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Add physics to Rock
const rockBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Sphere(1),
});
rockBody.position.set(-3, 1, 0);
world.addBody(rockBody);

// Add physics to Paper
const paperBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(0.75, 0.05, 0.5)),
});
paperBody.position.set(0, 1, 0);
world.addBody(paperBody);

// Add physics to Scissors
const scissorsBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Cylinder(0.5, 0.5, 2, 32),
});
scissorsBody.position.set(3, 1, 0);
world.addBody(scissorsBody);

// Raycaster and mouse setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let selectedBody = null;
let initialMousePosition = new THREE.Vector2();

// Update the displayResult function to ensure proper centering
function displayResult (userChoice, aiChoice, result) {
  const resultContainer = document.createElement('div');
  resultContainer.style.position = 'fixed'; // Use fixed positioning for consistent centering
  resultContainer.style.top = '50%';
  resultContainer.style.left = '50%';
  resultContainer.style.transform = 'translate(-50%, -50%)'; // Center the element
  resultContainer.style.textAlign = 'center';
  resultContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  resultContainer.style.color = 'white';
  resultContainer.style.padding = '20px';
  resultContainer.style.borderRadius = '10px';
  resultContainer.style.zIndex = '1000';

  const resultText = document.createElement('h1');
  resultText.textContent = result;
  resultContainer.appendChild(resultText);

  const choicesText = document.createElement('p');
  choicesText.textContent = `🕹️ ${userChoice.toUpperCase()} VS ${aiChoice.toUpperCase()} 🤖`;
  resultContainer.appendChild(choicesText);

  document.body.appendChild(resultContainer);

  setTimeout(() => {
    document.body.removeChild(resultContainer);
  }, 3000); // Remove the result after 3 seconds
}

// Function to determine the winner
function determineWinner (userChoice, aiChoice) {
  if (userChoice === aiChoice) return 'DRAW';
  if (
    (userChoice === 'rock' && aiChoice === 'scissors') ||
    (userChoice === 'paper' && aiChoice === 'rock') ||
    (userChoice === 'scissors' && aiChoice === 'paper')
  ) {
    return 'YOU WIN';
  }
  return 'YOU LOSE';
}

// Event listener for mouse down (start dragging)
window.addEventListener('mousedown', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([rock, paper, scissors]);

  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;
    if (selectedObject === rock) selectedBody = rockBody;
    else if (selectedObject === paper) selectedBody = paperBody;
    else if (selectedObject === scissors) selectedBody = scissorsBody;

    if (selectedBody) {
      initialMousePosition.set(event.clientX, event.clientY);
      controls.enabled = false; // Disable camera movement
    }
  }
});

// Event listener for mouse move (dragging)
window.addEventListener('mousemove', (event) => {
  if (selectedBody) {
    const deltaX = (event.clientX - initialMousePosition.x) * 0.01;
    const deltaY = (event.clientY - initialMousePosition.y) * 0.01;

    selectedBody.position.x += deltaX;
    selectedBody.position.y += deltaY;

    initialMousePosition.set(event.clientX, event.clientY);
  }
});

// Event listener for mouse up (release and apply force)
window.addEventListener('mouseup', async (event) => {
  if (selectedBody) {
    const force = new CANNON.Vec3(
      (event.clientX - initialMousePosition.x) * 0.1, // Force based on mouse movement
      5, // Upward force
      (event.clientY - initialMousePosition.y) * 0.1
    );
    selectedBody.applyImpulse(force, selectedBody.position);

    // Determine user choice
    let userChoice;
    if (selectedBody === rockBody) userChoice = 'rock';
    else if (selectedBody === paperBody) userChoice = 'paper';
    else if (selectedBody === scissorsBody) userChoice = 'scissors';

    // Call OpenAI API to get AI choice
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Choose one of rock, paper, or scissors randomly. Answer with just one string.' },
        ],
      });

      const aiChoice = response.choices[0].message.content.trim().toLowerCase();

      // Determine the result
      const result = determineWinner(userChoice, aiChoice);

      // Display the result
      displayResult(userChoice, aiChoice, result);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    }

    selectedBody = null;
    controls.enabled = true; // Re-enable camera movement
  }
});

// Add a flag to toggle wireframe visibility
let showWireframes = !true; // Set to false to hide wireframes

// Update wireframe visibility based on the flag
function updateWireframeVisibility () {
  rockBoundingBoxHelper.visible = showWireframes;
  if (sphereMesh) sphereMesh.visible = showWireframes;

  paperBoundingBoxHelper.visible = showWireframes;
  if (paperSphereMesh) paperSphereMesh.visible = showWireframes;

  scissorsBoundingBoxHelper.visible = showWireframes;
  if (scissorsSphereMesh) scissorsSphereMesh.visible = showWireframes;
}

// Synchronize physics and graphics
function updatePhysics () {
  world.step(1 / 60);

  rock.position.copy(rockBody.position);
  rock.quaternion.copy(rockBody.quaternion);

  paper.position.copy(paperBody.position);
  paper.quaternion.copy(paperBody.quaternion);

  scissors.position.copy(scissorsBody.position);
  scissors.quaternion.copy(scissorsBody.quaternion);
}

// Update bounding box and bounding sphere helpers in the animation loop
function updateHelpers () {
  rockBoundingBoxHelper.update();
  paperBoundingBoxHelper.update();
  scissorsBoundingBoxHelper.update();

  if (rockBoundingSphere) {
    sphereMesh.position.copy(rock.position);
  }

  if (paperBoundingSphere) {
    paperSphereMesh.position.copy(paper.position);
  }

  if (scissorsBoundingSphere) {
    scissorsSphereMesh.position.copy(scissors.position);
  }
}

// Update loop
function animate () {
  requestAnimationFrame(animate);
  updatePhysics();
  updateHelpers(); // Synchronize helpers
  updateWireframeVisibility(); // Update wireframe visibility
  controls.update();
  renderer.render(scene, camera);
}

animate();
