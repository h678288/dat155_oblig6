"use strict";

import { GLTFLoader } from "../loaders/GLTFLoader.js";
// Added Box3 and Vector3 to imports
import { AnimationMixer, Object3D, MathUtils, Box3, Vector3 } from "../lib/three.module.js";

export default class Shark {

    constructor(scene) {

        this.mesh = null;
        this.mixer = null;

        this.speed = 5; 
        this.direction = 1; 
        this.maxZ = 40; 
        this.minZ = -40;  

        this.group = new Object3D();
        this.group.position.set(0, 5.8, this.minZ); 
        scene.add(this.group);

        let loader = new GLTFLoader();
        loader.load(
            'resources/models/shark.glb',
            (gltf) => {
                this.mesh = gltf.scene.children[0];

                this.mesh.scale.multiplyScalar(0.06);
                this.mesh.castShadow = true;
                
                // 
                const box = new Box3().setFromObject(this.mesh);
                const center = box.getCenter(new Vector3());

                this.mesh.position.sub(center);

                this.group.add(this.mesh);

                if (gltf.animations && gltf.animations.length > 0) {
                    this.mixer = new AnimationMixer(this.mesh);
                    const action = this.mixer.clipAction(gltf.animations[0]);
                    action.play();
                }
            },
            (xhr) => {
                // console.log(((xhr.loaded / xhr.total) * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading model.', error);
            }
        );
    }

    animate(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }

        // Move the group (the pivot)
        this.group.position.z += this.speed * this.direction * delta;

        // Check boundaries
        if (this.group.position.z >= this.maxZ) {
            this.direction = -1;
            
            // Rotate the GROUP, which now rotates the shark perfectly around its center
            this.group.rotation.y = Math.PI; 
        } 
        else if (this.group.position.z <= this.minZ) {
            this.direction = 1;
            this.group.rotation.y = 0; 
        }
    }
}
