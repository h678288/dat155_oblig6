import * as THREE from "../lib/three.module.js";
import LavaShader from "../materials/LavaShader.js";

export default class Lava extends THREE.Mesh {
    constructor(width = 10, height = 11) {
        let geometry = new THREE.PlaneGeometry(width, height);
        let material = new LavaShader({
            vertexShader: LavaShader.vertexShader,
            fragmentShader: LavaShader.fragmentShader,
            uniforms: {
                time: 1.0,
                noiseMap: new THREE.TextureLoader().load('./resources/textures/noise.png'),
                diffuseMap: new THREE.TextureLoader().load('./resources/textures/lava.jpg')
            }
        })

        super(geometry, material);
        this.rotation.x = -Math.PI / 2;
        this.position.set(25, 16, 0);

    }

    animate() {
        this.material.uniforms['time'].value += 0.01;
    }
}
