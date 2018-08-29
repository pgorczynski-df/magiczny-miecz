
import { Game } from "../Game";
import { GameBoard } from "./GameBoard";
import { Card } from "./Card";
import { CardStack } from "./CardStack";
import { IActor } from "./IActor";
import { CardStackDefinition } from "@App/common/mechanics/definitions/CardStackDefinition";
import { CardType } from "@App/common/mechanics/definitions/CardType";

export class World {

    selectedActor: IActor;

    mmBoard: GameBoard;

    cardStacks: CardStack[] = [];

    //characters: Character[] = [];

    constructor(private game: Game) {

        this.mmBoard = new GameBoard("/assets/img/World.png", 138.3238405207486, 100, 1);
        this.game.addActor(this.mmBoard);

        for (var definition of CardStackDefinition.cardStackDefinitions) {
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

        this.newGame();
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

    drawCard = (card: Card = null, uncover = true): Card => {
        let stack = card !== null ? card.originStack : <CardStack>this.selectedActor;
        card = stack.drawCard(card, uncover);
        this.addNewCard(card);
        return card;
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
