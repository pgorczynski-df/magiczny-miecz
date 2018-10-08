import { Event } from "@Common/events/Event";
import { EventKind } from "@Common/events/EventKind";
import { ClientServices } from "@App/ClientServices";
import { IClientEventHandler } from "@App/game/events/IClientEventHandler";
import { ClientEventHandlerContext } from "@App/game/events/ClientEventHandlerContext";
import { Game } from "@App/game/Game";
import { ErrorEventHandler } from "@App/game/events/handlers/ErrorEventHandler";
import { DrawCardClientEventHandler } from "@App/game/events/handlers/DrawCardClientEventHandler";
import { JoinGameEventHandler } from "@App/game/events/handlers/JoinGameEventHandler";
import { ActorRotateClientEventHandler } from "@App/game/events/handlers/ActorRotateClientEventHandler";
import { ActorMoveClientEventHandler } from "@App/game/events/handlers/ActorMoveClientEventHandler";
import { ViewStackClientEventHandler } from "@App/game/events/handlers/ViewStackClientEventHandler";
import { PickCardClientEventHandler } from "@App/game/events/handlers/PickCardClientEventHandler";
import { DisposeCardClientEventHandler } from "@App/game/events/handlers/DisposeCardClientEventHandler";
import { CameraChangeEventHandler } from "@App/game/events/handlers/CameraChangeEventHandler";
import { DiceThrowClientEventHandler } from "@App/game/events/handlers/DiceThrowClientEventHandler";
import { CardSetAttributeClientEventHandler } from "@App/game/events/handlers/CardSetAttributeClientEventHandler";
import { PlayerMessageClientEventHandler } from "@App/game/events/handlers/PlayerMessageClientEventHandler";
import { StackShuffleClientEventHandler } from "@App/game/events/handlers/StackShuffleClientEventHandler";
import { StackPushDisposedCardsClientEventHandler } from "@App/game/events/handlers/StackPushDisposedCardsClientEventHandler";

export class ClientEventDispatcher {

    drawCardHandler = new DrawCardClientEventHandler();
    joinGameHandler = new JoinGameEventHandler();
    actorRotateHandler = new ActorRotateClientEventHandler();
    actorMoveHandler = new ActorMoveClientEventHandler();
    viewStackHandler = new ViewStackClientEventHandler();
    pickCardClientEventHandler = new PickCardClientEventHandler();
    disposeCardClientEventHandler = new DisposeCardClientEventHandler();
    cameraChangeEventHandler = new CameraChangeEventHandler();
    diceThrowClientEventHandler = new DiceThrowClientEventHandler();
    cardSetAttributeClientEventHandler = new CardSetAttributeClientEventHandler();
    playerMessageClientEventHandler = new PlayerMessageClientEventHandler();
    stackShuffleClientEventHandler = new StackShuffleClientEventHandler();
    stackPushDisposedCardsClientEventHandler = new StackPushDisposedCardsClientEventHandler();

    private eventHandlers: { [eventType: string]: IClientEventHandler; } = {};
    private context = new ClientEventHandlerContext();

    constructor(private services: ClientServices, private game: Game) {
        this.context.game = this.game;
        this.context.services = this.services;

        this.register(new ErrorEventHandler());
        this.register(this.drawCardHandler);
        this.register(this.joinGameHandler);
        this.register(this.actorRotateHandler);
        this.register(this.actorMoveHandler);
        this.register(this.viewStackHandler);
        this.register(this.pickCardClientEventHandler);
        this.register(this.disposeCardClientEventHandler);
        this.register(this.cameraChangeEventHandler);
        this.register(this.diceThrowClientEventHandler);
        this.register(this.cardSetAttributeClientEventHandler);
        this.register(this.playerMessageClientEventHandler);
        this.register(this.stackShuffleClientEventHandler);
        this.register(this.stackPushDisposedCardsClientEventHandler);
    }

    process(event: Event) {
        var type = event.eventType;

        var handler = this.eventHandlers[type];
        if (!handler) {
            this.services.logger.error("Unknown incoming event type: " + type);
            return;
        }

        switch (event.eventKind) {
            case EventKind.Response:
                handler.processResponse(event);
                break;
            case EventKind.Notification:
                handler.processNotification(event);
                break;
            default:
                this.services.logger.error("Unexpected incoming event kind: " + event.eventKind);
                break;
        }
    }

    getMessage(event: Event): string {
        var type = event.eventType;
        var handler = this.eventHandlers[type];
        if (!handler) {
            return event.eventType;
        }
        return handler.getMessage(event);
    }

    private register(handler: IClientEventHandler) {
        handler.context = this.context;
        this.eventHandlers[handler.getEventType()] = handler;
    }


}
