import * as THREE from "three";
import { Injectable } from "@angular/core";

import { Services } from "@App/Services";
import { CardDefinitionLoader } from "@App/common/mechanics/loaders/CardDefinitionLoader";
import { EventType } from "@App/common/events/EventType";
import {AttributeDefinition} from "@App/common/mechanics/definitions/AttributeDefinition";

@Injectable()
export class ResourceManager {

    public static font: THREE.Font = null;

    private static readonly localization: { [key: string]: string } = {};

    private cardDefinitionLoader: CardDefinitionLoader;
    private fontLoader: THREE.FontLoader;

    constructor(private services: Services) {
        this.cardDefinitionLoader = new CardDefinitionLoader(this.services);
        this.fontLoader = new THREE.FontLoader();

        this.addMessages();
    }

    public load(): Promise<any> {

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

    public static getLocalizationMessage(key: string) {
        var msg = ResourceManager.localization[key];
        return msg ? msg : key;
    }

    private addMessages() {
        var d = ResourceManager.localization;
        d[EventType.Error] = "Wystąpił błąd: {0}";
        d[EventType.JoinGame] = "Gracz {0} dołączył do gry";
        d[EventType.ActorMove] = "Gracz {0} przesunął kartę {1}";
        d[EventType.ActorRotate] = "Gracz {0} obrócił kartę {1}";
        d[EventType.ViewStack] = "Gracz {0} ogląda zawartość stosu {1}";
        d[EventType.DrawCard] = "Gracz {0} wyciągnął kartę {1}";
        d[EventType.PickCard] = "Gracz {0} wyłożył kartę {1}";
        d[EventType.DisposeCard] = "Gracz {0} odłożył kartę {1}";
        d[EventType.DiceThrow] = "Gracz {0} wyrzucił kostką: {1}";
        d[EventType.CardSetAttribute] = "Gracz {0} nadał karcie {1} atrybut {2} o wartości {3}";
        d[AttributeDefinition.Strength] = "Miecz";
        d[AttributeDefinition.Power] = "Magia";
        d[AttributeDefinition.Gold] = "Złoto";
        d[AttributeDefinition.Life] = "Życie";
        d["attribute_give"] = "Nadaj atrybut: {0}";
        d["attribute_remove"] = "Usuń atrybut: {0}";
    }

}
