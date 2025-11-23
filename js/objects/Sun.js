"use strict";

import * as THREE from '../lib/three.module'

export default class Sun extends THREE.Group {
    constructor(radius = 5, distance = 70, orbitSpeed = 0.001) {
        super();

        this.orbitSpeed = orbitSpeed;
        this.distance = distance;
        this.radius = radius;
        this.angle = 0;

        const texture = new THREE.TextureLoader().load('resources/textures/2k_sun.jpg');

        const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            emissive: new THREE.Color(0xffaa33),
            emissiveIntensity: 1.5,
            emissiveMap: texture
        });

        this.sunMesh = new THREE.Mesh(geometry, material);

        this.sunMesh.position.set(this.distance, 50, 0);
        this.add(this.sunMesh);


        this.lightSource = new THREE.PointLight(0xffffff, 3, 300);
        this.lightSource.position.copy(this.sunMesh.position);
        this.lightSource.castShadow = false;
        this.add(this.lightSource);

    }

    animate() {
        this.angle += this.orbitSpeed;

        const x = Math.cos(this.angle) * this.distance;
        const z = Math.sin(this.angle) * this.distance;

        this.sunMesh.position.set(x, 50, z);
        this.lightSource.position.copy(this.sunMesh.position);

        this.sunMesh.rotation.y += 0.003;
    }
}
