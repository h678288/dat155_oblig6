"use strict";

import {
    Object3D
} from "../lib/three.module.js";
import {GLTFLoader} from "../loaders/GLTFLoader.js";

export default class FlyingParrot {
    constructor(scene) {


        this.orbitNode = new Object3D();

        this.orbitNode.position.x = 0
        this.orbitNode.position.y = 21
        this.orbitNode.position.z = 0
        scene.add(this.orbitNode)


        let loader = new GLTFLoader()
        loader.load(
            // resource URL
            'resources/models/shark.glb',
            // called when resource is loaded
            (object) => {
                const sharkObj = object.scene.children[0]


                this.orbitNode.add(sharkObj)
                sharkObj.rotation.set(0, 0, 0);
                sharkObj.rotation.y = Math.PI;

                sharkObj.position.x = 0.0001;
                sharkObj.scale.multiplyScalar(0.06)

                sharkObj.castShadow = true;


            },
            (xhr) => {
                console.log(((xhr.loaded / xhr.total) * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading model.', error);
            }
        );
    }

    animate() {

        this.rotateObject(this.orbitNode, [0.0, 0.001, 0.0]);


    }

    rotateObject(object, rotation){

        object.rotation.x += rotation[0];
        object.rotation.y += rotation[1];
        object.rotation.z += rotation[2];
    }

}