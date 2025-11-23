import {
    Quaternion,
    Vector3
} from '../lib/three.module.js';

export default class MouseLookController {

    constructor(camera) {
        
        this.camera = camera;

        this.FD = new Vector3(0, 0, 1);
        this.UD = new Vector3(0, 1, 0);
        this.LD = new Vector3(1, 0, 0);

        this.pitchQuaternion = new Quaternion();
        this.yawQuaternion = new Quaternion();

        this.currentPitch = 0;
        this.currentYaw = 0;
        this.maxPitch = Math.PI / 2 - 0.01;
    }

    update(pitch, yaw) {

        this.currentPitch += pitch;
        this.currentPitch = Math.max(-this.maxPitch, Math.min(this.maxPitch, this.currentPitch));

        this.currentYaw += yaw;

        this.pitchQuaternion.setFromAxisAngle(this.LD, -this.currentPitch);
        this.yawQuaternion.setFromAxisAngle(this.UD, -this.currentYaw);

        this.camera.setRotationFromQuaternion(this.yawQuaternion.multiply(this.pitchQuaternion));

    }
    
}