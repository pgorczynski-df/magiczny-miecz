import * as THREE from "three";
import { Injectable } from "@angular/core";

import { Services } from "@App/Services";
import { CardDefinitionLoader } from "@App/common/mechanics/loaders/CardDefinitionLoader";

@Injectable()
export class ResourceManager {

    static font: THREE.Font = null;

    private cardDefinitionLoader: CardDefinitionLoader;
    private fontLoader: THREE.FontLoader;

    constructor(private services: Services) {
        this.cardDefinitionLoader = new CardDefinitionLoader(this.services);
        this.fontLoader = new THREE.FontLoader();
    }

    load(): Promise<any> {

        var promises : Promise<any>[] = [];

        promises.push(new Promise(resolve => {
            this.fontLoader.load("/assets/fonts/helvetiker_regular.typeface.json", (font) => {
                ResourceManager.font = font;
                resolve();
            });
        }));

        promises.push(this.cardDefinitionLoader.load());

        return Promise.all(promises); 
    }

}
