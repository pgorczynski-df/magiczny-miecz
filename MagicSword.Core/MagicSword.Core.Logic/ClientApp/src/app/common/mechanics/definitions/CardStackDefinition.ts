import * as THREE from "three";

import { CardDefinition } from "@App/common/mechanics/definitions/CardDefinition";
import { CardType } from "@App/common/mechanics/definitions//CardType";
import { Services } from "@App/Services";
import { HttpClient } from "@App/common/client/HttpClient";

export class CardStackDefinition {

    id: number;

    name: string;

    type: string;

    resourcePath: string;

    imageUrl: string;

    cardDefinitionsUrl: string;

    cardDefinitions: CardDefinition[];

    initialPosition: THREE.Vector3 = new THREE.Vector3();

    initialRotation: THREE.Euler = new THREE.Euler();

    shuffle = false;

    //static, because not using "new" causes a function undefined except
    public static loadCardDefinitions(definition: CardStackDefinition, services: Services): Promise<boolean> {
        var client = new HttpClient(services, services.settings.gameServerUrl);
        var promise = client
            .get(definition.resourcePath + "/" + definition.cardDefinitionsUrl)
            .then(res => {
                //TODO proper fix (remove BOM from files)
                //workaround: https://stackoverflow.com/questions/44176194/json-parse-causes-error-syntaxerror-unexpected-token-in-json-at-position-0
                var parsed = JSON.parse(res.trim());
                definition.cardDefinitions = parsed;
                return true;
            });
        return promise;
    }

    static cardStackDefinitions: CardStackDefinition[] = [
        <CardStackDefinition>{
            id: 1,
            name: "Stos kart Zdarzeń",
            type: CardType.Event,
            resourcePath: "/assets/img/Zdarzenia",
            imageUrl: "ZdarzenieRewers.png",
            cardDefinitionsUrl: "Zdarzenia.json",
            initialPosition: new THREE.Vector3(-5, 2, 0),
            initialRotation: new THREE.Euler(),
            shuffle: true,
        },
        <CardStackDefinition>{
            id: 2,
            name: "Stos kart Wyposażenia",
            type: CardType.Equipment,
            resourcePath: "/assets/img/Wyposazenie",
            imageUrl: "00WyposazenieRewers.png",
            cardDefinitionsUrl: "Wyposazenie.json",
            initialPosition: new THREE.Vector3(0, 2, -60),
            initialRotation: new THREE.Euler(),
            shuffle: false,
        },
        <CardStackDefinition>{
            id: 3,
            name: "Stos kart Zaklęć",
            type: CardType.Spell,
            resourcePath: "/assets/img/Zaklecia",
            imageUrl: "00ZaklecieRewers.png",
            cardDefinitionsUrl: "Zaklecia.json",
            initialPosition: new THREE.Vector3(20, 2, -60),
            initialRotation: new THREE.Euler(),
            shuffle: true,
        },
        <CardStackDefinition>{
            id: 4,
            name: "Stos kart Postaci",
            type: CardType.Character,
            resourcePath: "/assets/img/Postacie",
            imageUrl: "00PostacRewers.png",
            cardDefinitionsUrl: "Postacie.json",
            initialPosition: new THREE.Vector3(-40, 2, -60),
            initialRotation: new THREE.Euler(),
            shuffle: false,
        },
        <CardStackDefinition>{
            id: 5,
            name: "Stos Pionków",
            type: CardType.Pawn,
            resourcePath: "/assets/img/Postacie/Pionki",
            imageUrl: "../00PostacRewers.png",
            cardDefinitionsUrl: "../Postacie.json",
            initialPosition: new THREE.Vector3(-20, 2, -60),
            initialRotation: new THREE.Euler(),
            shuffle: false,
        },
    ];

}
