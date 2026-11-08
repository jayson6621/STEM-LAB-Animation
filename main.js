import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const container = document.getElementById('container');

// Animation mixer
let mixer = null;

// Create scene
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x101b35);

// Create camera
const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.set(0, 0, 8);

// Create renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

container.appendChild(renderer.domElement);

// Add lighting
const light = new THREE.DirectionalLight(0xffffff, 3);

light.position.set(5, 5, 5);

scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);

scene.add(ambientLight);

// Load 3D model
const modelPath = `${import.meta.env.BASE_URL}loop.glb`;

console.log('Loading model from:', modelPath);

loader.load(
    modelPath,

    function (gltf) {

        console.log('3D model loaded successfully!');

        const model = gltf.scene;

        scene.add(model);

        // Play animation
        if (gltf.animations.length > 0) {

            mixer = new THREE.AnimationMixer(model);

            const action = mixer.clipAction(gltf.animations[0]);

            action.setLoop(THREE.LoopRepeat);

            action.play();

        } else {

            console.warn('No animation found in the GLB file.');

        }

    },

    undefined,

    function (error) {

        console.error('Error loading model:', error);

    }
);

// Animation clock
const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (mixer !== null) {

        mixer.update(delta);

    }

    renderer.render(scene, camera);

}

animate();

// Responsive screen
window.addEventListener('resize', function () {

    camera.aspect = container.clientWidth / container.clientHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

});