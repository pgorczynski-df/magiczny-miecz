import * as THREE from 'three';
import * as Logger from "js-logger";

import { Game } from "../Game";
import { GameBoard } from "./GameBoard";
import { Card } from "./Card";
import { CardStack } from "./CardStack";
//import { Character } from "./Character";
import { CardDefinition } from "./CardDefinition";
import { IActor } from "./IActor";
import { CardStackDefinition } from "./CardStackDefinition";
import {CardType} from "./CardType";

export class World {


  selectedActor: IActor;

  mmBoard: GameBoard;

  cardStacks: CardStack[] = [];

  //characters: Character[] = [];

  static font: THREE.Font = null;

  constructor(private game: Game) {


    this.mmBoard = new GameBoard("/assets/img/World.png", 138.3238405207486, 100, 1);
    this.game.addActor(this.mmBoard);

    this.loadFont();

    for (var definition of CardStackDefinition.cardStackDefinitions) {

      this.loadCardDefinitions(definition);

      var characterAspect = 1.241772151898734;
      var width = 16.18257261410788;
      var height = 10;

      if (definition.type === CardType.Character) {
        height = width;
        width = characterAspect * width;
      }

      var cardStack = new CardStack(definition, width, height, 3);
      cardStack.cleanup(); //set initial coordinates

      this.cardStacks.push(cardStack);
      this.game.addActor(cardStack);
    }

    //let playersCount = 3;

    //for (var i = 0; i < playersCount; i++) {

    //  var card = new Character("/assets/img/Characters/Barbarzynca.png", 10, 0.8053007135575944, 0.5);
    //  this.characters.push(card);

    //  var object = card.object3D;
    //  object.position.x = (playersCount / 2 - i) * 20;
    //  object.position.y = 0.5;
    //  object.position.z = 45;

    //  this.game.addActor(card);
    //}

    //this.newGame();
  }

  public loadCardDefinitions = (stackDefinition: CardStackDefinition) => {
    let url = stackDefinition.resourcePath + "/" + stackDefinition.cardDefinitionsUrl;
    Logger.debug("Attempting to fetch: " + url);
    this.game.services.httpClient.get(url).subscribe((res: CardDefinition[]) => {
      stackDefinition.cardDefinitions = res;
      Logger.debug("Sucessfuly loaded: " + url);
      if (this.ensureLoaded()) {
        this.newGame();
      }
    });
  }

  private loadFont = () => {
    var loader = new THREE.FontLoader();
    loader.load('/assets/fonts/helvetiker_regular.typeface.json', (font) => {
      World.font = font;
    });
  }

  //TODO nicefy
  private ensureLoaded = (): boolean => {

    if (World.font === null) {
      return false;
    }

    for (var stack of this.cardStacks) {
      if (!stack.definition.cardDefinitions) {
        return false;
      }
    }
    return true;
  }

  newGame = () => {
    this.cleanup();
    for (var stack of this.cardStacks) {
      stack.buildStack();
    }
  }

  cleanup = () => {

    this.clearSelectedActor();

    for (var stack of this.cardStacks) {
      for (var card of stack.drawnCards) {
        this.disposeCardInternal(card);
      }
      stack.cleanup();
    }
  }

  drawCardTop = (uncover = true) => {
    let stack = <CardStack>this.selectedActor;
    let card = stack.drawCardTop(uncover);
    this.addNewCard(card);
  }

  drawCard = (card: Card, uncover = true) => {
    let stack = <CardStack>this.selectedActor;
    card = stack.drawCard(card, uncover);
    this.addNewCard(card);
  }

  addNewCard(card: Card) {
    this.game.addActor(card);
  }

  disposeCard = () => {
    let card = <Card>this.selectedActor;
    this.clearSelectedActor();
    this.disposeCardInternal(card);
  }

  selectActor(actor: IActor) {
    this.clearSelectedActor();
    this.selectedActor = actor;
    this.selectedActor.isSelected = true;
  }

  clearSelectedActor = () => {
    if (this.selectedActor) {
      this.selectedActor.isSelected = false;
    }
    this.selectedActor = null;
  }

  private disposeCardInternal = (card: Card) => {
    card.dispose();
    this.game.removeActor(card);
  }

  setCovered(isCovered: boolean) {
    let card = <Card>this.selectedActor;
    card.setCovered(isCovered);
  }

  toggleCovered() {
    let card = <Card>this.selectedActor;
    card.toggleCovered();
  }

}
