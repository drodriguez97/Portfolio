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

        window.addEventListener('scroll', this.handleScroll.bind(this));

        this.scrollTimeout = null;
    }

    handleScroll() {

        // If timeout is active, clear it and mark it as inactive
        if (this.isTimeoutActive) {
            clearTimeout(this.scrollTimeout);
            this.isTimeoutActive = false;
        }

        // Set timeout to hide the arrow after 3 seconds of not scrolling
        this.scrollTimeout = setTimeout(() => {
            this.hideArrow();
            this.isTimeoutActive = false; // Reset the flag after hiding the arrow
        }, 3000);
    }

    showArrow() {
        document.querySelector('.arrow-svg-wrapper').style.opacity = 1;
    }

    hideArrow() {
        document.querySelector('.arrow-svg-wrapper').style.opacity = 0;
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