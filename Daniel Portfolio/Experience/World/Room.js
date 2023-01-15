import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Room {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;

        this.setModel();   
    }

    setModel() {
        this.actualRoom.children.forEach((child) => {
            child.castShadow = true;
            child.recieveShadow = true;

            if(child instanceof THREE.Group) {
                child.children.forEach((groupchild)=>{
                    groupchild.castShadow = true;
                    groupchild.recieveShadow = true;
                });
            }

             if (child.name === "Screen") {
                child.material = new THREE.MeshBasicMaterial({
                   map: this.resources.items.screen,
               });
            }

        });

        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(.2,.2,.2)
        this.actualRoom.rotation.y = Math.PI / 2;
    }

    resize() {}

    update() {}
}