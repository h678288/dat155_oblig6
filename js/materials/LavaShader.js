import { ShaderMaterial } from "../lib/three.module.js";
import * as THREE from "../lib/three.module.js";

export default class LavaShader extends ShaderMaterial {

    constructor({
        uniforms: {
            time = 'time',
            noiseMap = 'noiseMap',
            diffuseMap = 'diffuseMap',
            color = 'color'
        }
    }) {

        noiseMap.wrapS = noiseMap.wrapT = THREE.RepeatWrapping;
        diffuseMap.wrapS = diffuseMap.wrapT = THREE.RepeatWrapping;

        let vertexShader = `

            varying vec2 vUv;

            void main()
            {
                vUv = uv;
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                gl_Position = projectionMatrix * mvPosition;

            } `

        let fragmentShader = `

            uniform float time;

            uniform sampler2D noiseMap;
            uniform sampler2D diffuseMap;
            uniform vec3 color; 

            varying vec2 vUv;

            void main(void) {

                vec2 position = - 1.0 + 2.0 * vUv;

                vec4 noise = texture2D( noiseMap, vUv );
                vec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;
                vec2 T2 = vUv + vec2( - 0.5, 2.0 ) * time * 0.01;

                T1.x += noise.x * 2.0;
                T1.y += noise.y * 2.0;
                T2.x -= noise.y * 0.2;
                T2.y += noise.z * 0.2;

                float p = texture2D( noiseMap, T1 * 2.0 ).a;

                vec4 color = texture2D( diffuseMap, T2 * 2.0 );
                vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );

                if( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
                if( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }
                if( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }

                gl_FragColor = temp;
            }`

        super({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                time: {
                    value: time
                },
                noiseMap: {
                    value: noiseMap
                },
                diffuseMap: {
                    value: diffuseMap
                },
                color: {
                    value: color
                }

            }
        });

    }
}
