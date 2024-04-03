import * as THREE from "three";
import { EventEmitter } from "events";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"; 
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import Experience from "../Experience.js";

export default class Resources extends EventEmitter {
    constructor(assets) {
        super();
        this.experience = new Experience();
        this.renderer = this.experience.renderer;

        this.assets = assets;

        this.items = {};
        this.queue = this.assets.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.dracoLoader = new DRACOLoader();
        this.loaders.dracoLoader.setDecoderPath("/draco/");
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
    }
    startLoading() {
        const promises = this.assets.map(asset => {
            return new Promise(resolve => {
                if (asset.type === "glbModel") {
                    this.loaders.gltfLoader.load(asset.path, (file) => {
                        resolve({ name: asset.name, file });
                    });
                } else if (asset.type === "videoTexture") {
                    resolve({ name: asset.name, file: this.loadVideoTexture(asset) });
                }
            });
        });

        Promise.all(promises).then(loadedAssets => {
            loadedAssets.forEach(({ name, file }) => {
                this.singleAssetLoaded({ name, file });
            });
        });
    }
        
    loadVideoTexture(asset) {
        const video = document.createElement("video");
        video.src = asset.path;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.loop = true;
        video.play();

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.flipY = false;
        videoTexture.minFilter = THREE.NearestFilter;
        videoTexture.magFilter = THREE.NearestFilter;
        videoTexture.generateMipmaps = false;
        videoTexture.encoding = THREE.sRGBEncoding;

        return videoTexture;
    }

    singleAssetLoaded(asset) {
        this.items[asset.name] = asset.file;
        this.loaded++;
        
        if (this.loaded === this.queue) {
            this.emit("ready");
        }
    }
}