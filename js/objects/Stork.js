"use strict";

import { Object3D, AnimationMixer, AxesHelper } from "../lib/three.module.js";
import { GLTFLoader } from "../loaders/GLTFLoader.js";

export default class Stork {
    constructor(scene) {

        this.orbitNode = new Object3D();
        this.orbitNode.position.set(26, 20, 1);

        // const axes = new AxesHelper(2);
        // this.orbitNode.add(axes);
        scene.add(this.orbitNode);

        this.mixer = null;

        const loader = new GLTFLoader();
        loader.load(
            'resources/models/Stork.glb',
            (gltf) => {
                const storkObj = gltf.scene.children[0];

                this.orbitNode.add(storkObj);
                storkObj.rotation.y = -Math.PI;
                storkObj.rotation.z = -Math.PI / 4;
                storkObj.position.x = 20;
                storkObj.scale.multiplyScalar(0.03);
                storkObj.castShadow = true;


                if (gltf.animations && gltf.animations.length > 0) {
                    this.mixer = new AnimationMixer(storkObj);

                    const action = this.mixer.clipAction(gltf.animations[0]);
                    action.play();
                }

            },
            (xhr) => {
                console.log(((xhr.loaded / xhr.total) * 100) + "% loaded");
            },
            (error) => {
                console.error("Error loading model.", error);
            }
        );
    }

    animate(delta) {
        this.rotateObject(this.orbitNode, [0.0, 0.3 * delta, 0.0]);

        if (this.mixer) this.mixer.update(delta);
    }

    rotateObject(object, rotation) {
        object.rotation.x += rotation[0];
        object.rotation.y += rotation[1];
        object.rotation.z += rotation[2];
    }
}
