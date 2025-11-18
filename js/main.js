import {
    PerspectiveCamera,
    WebGLRenderer,
    PCFSoftShadowMap,
    Scene,
    Mesh,
    TextureLoader,
    RepeatWrapping,
    DirectionalLight,
    Vector3,
    AxesHelper,
    CubeTextureLoader,
    PlaneBufferGeometry,
    Fog,
    FogExp2
} from './lib/three.module.js';

import Utilities from './lib/Utilities.js';
import MouseLookController from './controls/MouseLookController.js';

import TextureSplattingMaterial from './materials/TextureSplattingMaterial.js';
import TerrainBufferGeometry from './terrain/TerrainBufferGeometry.js';
import { GLTFLoader } from './loaders/GLTFLoader.js';
import { SimplexNoise } from './lib/SimplexNoise.js';
import { Ocean } from './lib/Ocean.js';
import Parrot from './objects/Parrot.js';

async function main() {

    const scene = new Scene();



    const axesHelper = new AxesHelper(15);
    scene.add(axesHelper);

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    /**
     * Handle window resize:
     *  - update aspect ratio.
     *  - update projection matrix
     *  - update renderer size
     */
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    /**
     * Add canvas element to DOM.
     */
    document.body.appendChild(renderer.domElement);

    /**
     * Add light
     */
    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(300, 400, 0);

    directionalLight.castShadow = true;

    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 2000;

    scene.add(directionalLight);

    // Set direction
    directionalLight.target.position.set(0, 15, 0);
    scene.add(directionalLight.target);

    camera.position.z = 70;
    camera.position.y = 55;
    camera.rotation.x -= Math.PI * 0.25;



    // add skybox

    const skyBox = new CubeTextureLoader();
    scene.background = skyBox.load([
        "resources/images/skybox/Daylight Box_Right.bmp",
        "resources/images/skybox/Daylight Box_Left.bmp",
        "resources/images/skybox/Daylight Box_Top.bmp",
        "resources/images/skybox/Daylight Box_Bottom.bmp",
        "resources/images/skybox/Daylight Box_Front.bmp",
        "resources/images/skybox/Daylight Box_Back.bmp"
    ])

    /**
     * Add terrain:
     * 
     * We have to wait for the image file to be loaded by the browser.
     * There are many ways to handle asynchronous flow in your application.
     * We are using the async/await language constructs of Javascript:
     *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
     */
    const heightmapImage = await Utilities.loadImage('resources/images/heightmap4.png');
    const width = 100;

    const simplex = new SimplexNoise();
    const terrainGeometry = new TerrainBufferGeometry({
        width,
        heightmapImage,
        // noiseFn: simplex.noise.bind(simplex),
        numberOfSubdivisions: 128,
        height: 20
    });

    const grassTexture = new TextureLoader().load('resources/textures/grass_02.png');
    grassTexture.wrapS = RepeatWrapping;
    grassTexture.wrapT = RepeatWrapping;
    grassTexture.repeat.set(5000 / width, 5000 / width);

    const snowyRockTexture = new TextureLoader().load('resources/textures/snowy_rock_01.png');
    snowyRockTexture.wrapS = RepeatWrapping;
    snowyRockTexture.wrapT = RepeatWrapping;
    snowyRockTexture.repeat.set(1500 / width, 1500 / width);


    const splatMap = new TextureLoader().load('resources/images/splatmap4.png');

    const terrainMaterial = new TextureSplattingMaterial({
        color: 0xffffff,
        shininess: 0,
        textures: [snowyRockTexture, grassTexture],
        splatMaps: [splatMap]
    });

    const terrain = new Mesh(terrainGeometry, terrainMaterial);

    terrain.castShadow = true;
    terrain.receiveShadow = true;

    scene.add(terrain);

    const fog = new FogExp2(0xFFFFFF, 0.03);
    scene.fog = fog;


    // water
    const waterGeometry = new PlaneBufferGeometry(100, 100);

    const water = new Ocean(100, 100, 'resources/images/waternormals.jpg');
    water.position.y = 6;
    scene.add(water);

    const lava = new Ocean(9, 9, 'resources/images/lava.jpg');
    lava.position.y = 17;
    lava.position.x = 25;
    scene.add(lava);



    /**
     * Add trees
     */

    // instantiate a GLTFLoader:
    const loader = new GLTFLoader();

    async function loadTreeModel(path) {
        const gltf = await loader.loadAsync(path);
        return gltf.scene.children[0];
    }

    const treeModels = [
        await loadTreeModel("resources/models/kenney_nature-kit-ny/Models/GLTF format/tree_palmTall.glb"),
        await loadTreeModel("resources/models/kenney_nature-kit-ny/Models/GLTF format/tree_palm.glb"),
        await loadTreeModel("resources/models/kenney_nature-kit-ny/Models/GLTF format/tree_palmShort.glb"),
        await loadTreeModel("resources/models/kenney_nature-kit-ny/Models/GLTF format/tree_palmDetailedShort.glb"),
        await loadTreeModel("resources/models/kenney_nature-kit-ny/Models/GLTF format/stone_tallA.glb"),
        await loadTreeModel("resources/models/kenney_nature-kit-ny/Models/GLTF format/stone_tallC.glb"),
        await loadTreeModel("resources/models/kenney_nature-kit-ny/Models/GLTF format/stone_tallD.glb"),
        await loadTreeModel("resources/models/kenney_nature-kit-ny/Models/GLTF format/stump_old.glb")



    ];


    for (let i = 0; i < 4000; i++) {

        // Random world position
        const x = (Math.random() - 0.5) * terrainGeometry.width;
        const z = (Math.random() - 0.5) * terrainGeometry.width;

        // Height of terrain at this point
        const y = terrainGeometry.getHeightAt(x, z);

        // Avoid tall peaks + low valleys
        if (y < 5 || y > 11) continue;

        // Pick random tree model
        const baseTree = treeModels[Math.floor(Math.random() * treeModels.length)];
        const tree = baseTree.clone(true);

        // Set tree position
        tree.position.set(x, y, z);

        // Variety in rotation
        tree.rotation.y = Math.random() * Math.PI * 2;

        // Scale randomness
        tree.scale.multiplyScalar(0.7 + Math.random() * 1.8);

        scene.add(tree);
    }



    /**
     * Set up camera controller:
     */

    const mouseLookController = new MouseLookController(camera);

    // We attach a click lister to the canvas-element so that we can request a pointer lock.
    // https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
    const canvas = renderer.domElement;

    canvas.addEventListener('click', () => {
        canvas.requestPointerLock();
    });

    let yaw = 0;
    let pitch = 0;
    const mouseSensitivity = 0.001;

    function updateCamRotation(event) {
        yaw += event.movementX * mouseSensitivity;
        pitch += event.movementY * mouseSensitivity;
    }

    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement === canvas) {
            canvas.addEventListener('mousemove', updateCamRotation, false);
        } else {
            canvas.removeEventListener('mousemove', updateCamRotation, false);
        }
    });

    let move = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        speed: 0.01
    };

    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyW') {
            move.forward = true;
            e.preventDefault();
        } else if (e.code === 'KeyS') {
            move.backward = true;
            e.preventDefault();
        } else if (e.code === 'KeyA') {
            move.left = true;
            e.preventDefault();
        } else if (e.code === 'KeyD') {
            move.right = true;
            e.preventDefault();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.code === 'KeyW') {
            move.forward = false;
            e.preventDefault();
        } else if (e.code === 'KeyS') {
            move.backward = false;
            e.preventDefault();
        } else if (e.code === 'KeyA') {
            move.left = false;
            e.preventDefault();
        } else if (e.code === 'KeyD') {
            move.right = false;
            e.preventDefault();
        }
    });

    const velocity = new Vector3(0.0, 0.0, 0.0);

    let then = performance.now();
    function loop(now) {

        water.animateOcean();
        lava.animateOcean();
        const delta = now - then;
        then = now;

        const moveSpeed = move.speed * delta;

        velocity.set(0.0, 0.0, 0.0);

        if (move.left) {
            velocity.x -= moveSpeed;
        }

        if (move.right) {
            velocity.x += moveSpeed;
        }

        if (move.forward) {
            velocity.z -= moveSpeed;
        }

        if (move.backward) {
            velocity.z += moveSpeed;
        }

        // update controller rotation.
        mouseLookController.update(pitch, yaw);
        yaw = 0;
        pitch = 0;

        // apply rotation to velocity vector, and translate moveNode with it.
        velocity.applyQuaternion(camera.quaternion);
        camera.position.add(velocity);

        // render scene:
        renderer.render(scene, camera);

        requestAnimationFrame(loop);

    };

    loop(performance.now());

}

main(); // Start application