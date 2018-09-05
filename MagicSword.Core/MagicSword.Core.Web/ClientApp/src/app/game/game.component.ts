import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

import { Game } from "../game/Game";
import { Event } from "@App/common/events/Event";
import { IActor } from "../game/logic/IActor";
import { Services } from "app/Services";
import { CardStack } from "./logic/CardStack";
import { Card } from "./logic/Card";
import { SocketClient } from "@App/SocketClient";
import { Player } from "@App/common/mechanics/Player";
import { ResourceManager } from "@App/game/ResourceManager";
import { ClientEventDispatcher } from "@App/game/events/ClientEventDispatcher";
import { Message } from "@App/game/Message";
import { EventKind } from "@App/common/events/EventKind";
import { EventType } from "@App/common/events/EventType";
import { GameStateDto } from "@App/common/dto/GameStateDto";
import { ClientGameService } from "@App/game/local/ClientGameService";
import { AttributeDefinition } from "@App/common/mechanics/definitions/AttributeDefinition";


@Component({
    selector: "app-game",
    templateUrl: "./game.component.html",
})
export class GameComponent implements AfterViewInit {

    @ViewChild("viewport", { read: ElementRef }) viewport: ElementRef;
    @ViewChild("eventsPanel", { read: ElementRef }) eventsPanel: ElementRef;

    game: Game;
    socketClient: SocketClient;
    dispatcher: ClientEventDispatcher;
    clientGameService: ClientGameService;

    get selectedActor(): IActor {
        return this.game ? this.game.world.selectedActor : null;
    }

    constructor(private modalService: NgbModal, private route: ActivatedRoute, private services: Services, private resourceManager: ResourceManager) {
        this.socketClient = new SocketClient(this.services);

    }

    messages: Message[] = [];
    cardsToPick: Card[] = [];

    get attributes(): AttributeDefinition[] {
        return AttributeDefinition.attributeDefinitions;
    }

    ngAfterViewInit() {

        var consoleHandler = this.services.logger.createDefaultHandler();
        var myHandler = (messages, context) => {
            if (context.level.value >= 2) { //INFO
                var message = new Message();
                message.text = messages[0];
                this.addMessage(message);
            }
        };

        this.services.logger.setHandler((messages, context) => {
            consoleHandler(messages, context);
            myHandler(messages, context);
        });

        this.resourceManager.load().then(_ => {
            this.route.paramMap.subscribe(d => {
                var mode = d.get("mode");
                var gameId = d.get("gameId");
                this.startGame(gameId, mode);
            });
        });
    }

    private startGame(gameId: string, mode: string) {

        //this.services.logger.info("Starting game in " + mode + " mode");

        this.game = new Game(this.viewport.nativeElement, this.services);
        this.game.id = gameId;

        this.dispatcher = new ClientEventDispatcher(this.services, this.game);
        this.game.eventDispatcher = this.dispatcher;

        this.services.inboundBus.of().subscribe(e => {
            this.dispatcher.process(e);
            if (e.eventKind === EventKind.Notification) {
                var message = this.eventToMessage(e);
                this.addMessage(message);
            }
            if (e.eventKind === EventKind.Response && e.eventType === EventType.JoinGame) {

                var rdto = e.data as GameStateDto;
                for (var event of rdto.notificationEvents) {
                    var message2 = this.eventToMessage(event);
                    this.addMessage(message2);
                }
            }
        });

        switch (mode) {
            case "local":
                this.clientGameService = new ClientGameService(this.services);
                if (!this.services.authService.token) {
                    this.services.authService.token = "dummy";
                }
                this.services.outboundBus.of().subscribe((e: Event) => {
                    this.clientGameService.handleEvent(e);
                });
                this.dispatcher.joinGameHandler.request();
                break;
            case "online":
                this.socketClient.init();
                this.dispatcher.joinGameHandler.request();
                break;
            default:
                throw new Error("unknown mode: " + mode);
        }
    }

    private eventToMessage(event: Event) {
        var message = new Message();
        message.text = this.dispatcher.getMessage(event);
        return message;
    }

    private addMessage(message: Message) {
        this.messages.push(message);
        var objDiv = this.eventsPanel.nativeElement as any;
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    toggleAttribute(attribute: AttributeDefinition) {
        var card = this.selectedActor as Card;
        this.dispatcher.cardSetAttributeClientEventHandler.toggleAttribute(card, attribute.name);
    }

    drawCard(uncover: boolean) {
        this.dispatcher.drawCardHandler.drawCard(uncover);
    }

    disposeCard() {
        var card = this.selectedActor as Card;
        this.dispatcher.disposeCardClientEventHandler.disposeCard(card);
    }

    diceThrow() {
        this.dispatcher.diceThrowClientEventHandler.throwDice();
    }

    res(key: string) {
        return ResourceManager.getLocalizationMessage(key);
    }

    async pickCard(content) {

        if (!confirm("Jesteś pewien?")) {
            return;
        }

        var stack = this.selectedActor as CardStack;
        await this.dispatcher.viewStackHandler.viewCards(stack);

        this.cardsToPick = stack.cards;
        this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" }).result.then(async (result) => {
            this.dispatcher.pickCardClientEventHandler.pickCard(result);
            this.clearCards(stack);
        }, cancelReason => {
            this.clearCards(stack);
        });
    }

    private clearCards(stack: CardStack) {
        stack.cards = [];
    }

}

