import * as THREE from 'three';

import { CardDefinition } from "./CardDefinition";
import * as CardType from "./CardType";

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

  static cardStackDefinitions: CardStackDefinition[] = [
    <CardStackDefinition>{
      id: 1,
      name: "Stos kart Zdarzeń",
      type: CardType.CardType.Event,
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
      type: CardType.CardType.Equipment,
      resourcePath: "/assets/img/Wyposazenie",
      imageUrl: "00WyposazenieRewers.png",
      cardDefinitionsUrl: "Wyposazenie.json",
      initialPosition: new THREE.Vector3(0, 2, -50),
      initialRotation: new THREE.Euler(),
      shuffle: false,
    },
    <CardStackDefinition>{
      id: 3,
      name: "Stos kart Zaklęć",
      type: CardType.CardType.Spell,
      resourcePath: "/assets/img/Zaklecia",
      imageUrl: "00ZaklecieRewers.png",
      cardDefinitionsUrl: "Zaklecia.json",
      initialPosition: new THREE.Vector3(12, 2, -50),
      initialRotation: new THREE.Euler(),
      shuffle: true,
    },
    <CardStackDefinition>{
      id: 4,
      name: "Stos kart Postaci",
      type: CardType.CardType.Character,
      resourcePath: "/assets/img/Postacie",
      imageUrl: "00PostacRewers.png",
      cardDefinitionsUrl: "Postacie.json",
      initialPosition: new THREE.Vector3(-22, 2, -50),
      initialRotation: new THREE.Euler(),
      shuffle: false,
    },
    <CardStackDefinition>{
      id: 5,
      name: "Stos Pionków",
      type: CardType.CardType.Pawn,
      resourcePath: "/assets/img/Postacie/Pionki",
      imageUrl: "../00PostacRewers.png",
      cardDefinitionsUrl: "../Postacie.json",
      initialPosition: new THREE.Vector3(-34, 2, -50),
      initialRotation: new THREE.Euler(),
      shuffle: false,
    },
  ];

}
