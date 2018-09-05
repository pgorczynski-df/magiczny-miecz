import { CardStackDefinition } from "@App/common/mechanics/definitions/CardStackDefinition";
import { CardStack } from "@App/common/mechanics/CardStack";
import { Card } from "@App/common/mechanics/Card";
import { CardType } from "@App/common/mechanics/definitions/CardType";


export class World {

    cardStacks: CardStack[] = [];

    constructor() {

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
        }

    }

    newGame() {
        this.cleanup();
        for (var stack of this.cardStacks) {
            stack.buildStack();
        }
    }

    cleanup() {
        for (var stack of this.cardStacks) {
            stack.cleanup();
        }
    }

    drawCard(stackId: string, uncover: boolean): Card {
        var stack = this.findStack(stackId);
        var card = stack.drawCard(null, uncover);
        return card;
    }

    pickCard(stackId: string, cardId: string): Card {
        var stack = this.findStack(stackId);
        var card = stack.findCard(cardId);
        stack.drawCard(card, true);
        return card;
    }

    disposeCard(stackId: string, cardId: string): Card {
        var stack = this.findStack(stackId);
        var card = stack.findDrawnCard(cardId);
        card.dispose();
        return card;
    }

    private findStack(stackId: string) {
        var stack = this.cardStacks.find(s => s.id === stackId);
        if (!stack) {
            throw new Error("Cannot find stack id = " + stackId);
        }
        return stack;
    }

    private disposeCardInternal(card: Card) {
        card.dispose();
        //this.game.removeActor(card);
    }

    //setCovered(isCovered: boolean) {
    //    let card = <Card>this.selectedActor;
    //    card.setCovered(isCovered);
    //}

    //toggleCovered() {
    //    let card = <Card>this.selectedActor;
    //    card.toggleCovered();
    //}

}
