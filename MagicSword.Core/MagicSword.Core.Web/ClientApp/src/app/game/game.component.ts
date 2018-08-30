import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

import { Game } from "../game/Game";
import { Event } from "@App/common/events/Event";
import { IActor } from "../game/logic/IActor";
import { Services } from "app/Services";
import { EventType } from "@App/common/events/EventType";
import { CardStack } from "./logic/CardStack";
import { Card } from "./logic/Card";
import { SocketClient } from "@App/SocketClient";
import { Player } from "@App/common/mechanics/Player";
import { ResourceManager } from "@App/game/ResourceManager";

@Component({
    selector: "app-game",
    templateUrl: "./game.component.html",
})
export class GameComponent implements AfterViewInit {

    @ViewChild("viewport", { read: ElementRef }) viewport: ElementRef;
    @ViewChild("eventsPanel", { read: ElementRef }) eventsPanel: ElementRef;

    game: Game;
    socketClient: SocketClient;

    get selectedActor(): IActor {
        return this.game ? this.game.world.selectedActor : null;
    }

    constructor(private modalService: NgbModal, private route: ActivatedRoute, private services: Services, private resourceManager: ResourceManager) {
        this.socketClient = new SocketClient(this.services);
    }

    events: Event[] = [];
    cardsToPick: Card[] = [];

    ngAfterViewInit() {

        var consoleHandler = this.services.logger.createDefaultHandler();
        var myHandler = (messages, context) => {
            if (context.level.value >= 2) { //INFO
                this.events.push({ gameId: this.game ? this.game.id : "-1", eventType: messages[0], data: {}, token: "" } as Event);
                var objDiv = this.eventsPanel.nativeElement as any;
                objDiv.scrollTop = objDiv.scrollHeight;
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

        this.services.logger.info("Starting game in " + mode + " mode");

        this.game = new Game(this.viewport.nativeElement, this.services);

        switch (mode) {
            case "local":
                var player = new Player();
                player.id = "1";
                player.name = "Samotny gracz";
                this.game.players.push(player);
                this.game.currentPlayerId = player.id;
                break;
            case "online":
                this.game.id = gameId;
                this.socketClient.init();
                this.game.publishEvent(EventType.JoinGame);

                break;
            default:
                throw new Error("unknown mode: " + mode);
        }
    }

    new = () => {
        this.game.new();
    }

    save = () => {
        this.game.save();
    };

    load = () => {
        //this.game.load();
        //this.services.outboundBus.publish(EventType.GameLoadRequest);
    };

    drawCard = (uncover: boolean) => {
        this.game.drawCard(uncover);
    };

    disposeCard = () => {
        this.game.world.disposeCard();
    };

    //sendMessage = () => {
    //this.hub.sendDirectMessage("dada", "userName");
    //}

    toggleCovered() {
        this.game.world.toggleCovered();
    }

    pickCard(content) {
        var stack = this.selectedActor as any as CardStack;
        this.cardsToPick = stack.cards;
        this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" }).result.then((result) => {
            this.game.drawCardOld(result, true);
        }, cancelReason => { });
    }

}

