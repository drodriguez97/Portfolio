import { EventEmitter } from "events";
import Experience from "./Experience";
import GSAP from 'gsap';

export default class Preloader extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;
        this.world = this.experience.world;

        this.world.on("worldready", () => {
            this.playIntro();
        });
    }

    firstIntro() {
        return new Promise((resolve) => {
            this.timeline = new GSAP.timeline();
            this.timeline.set(".animatedis", { y: 0, yPercent: 100 });
            this.timeline.to(".preloader", {
                opacity: 0,
                delay: 1,
                onComplete: () => {
                    document
                        .querySelector(".preloader")
                        .classList.add("hidden");
                },
            }); 
            this.timeline
                .to(".intro-text .animatedis", {
                    yPercent: 0,
                    stagger: 0.05,
                    ease: "back.out(1.7)",
                })
                .to(
                    ".arrow-svg-wrapper",
                    {
                        opacity: 1,
                    },
                    "same"
                )
                .to(
                    ".toggle-bar",
                    {
                        opacity: 1,
                        onComplete: resolve,
                    },
                    "same"
                );
        });
    }

    async playIntro() {
        await this.firstIntro();
    }
}