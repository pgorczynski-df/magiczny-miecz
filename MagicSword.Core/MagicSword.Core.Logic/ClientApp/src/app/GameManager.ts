import { Services } from "@App/Services";
import { AuthService } from "@App/AuthService";

import { GameEventProcessor } from "@App/game/GameEventProcessor";
import { CardDefinitionLoader } from "@App/common/mechanics/loaders/CardDefinitionLoader";
import { Event } from "@App/common/events/Event";
import { IResponseProcessor } from "@App/common/events/IResponseProcessor";
import { UserProvider } from "@App/UserProvider";
import { EventType } from "@App/common/events/EventType";
import { GameProvider } from "@App/GameProvider";

export class GameManager {

    private userProvider = new UserProvider();
    private gameProvider = new GameProvider();

    constructor(private services: Services) {
    }

    public init() {
        this.loadResources();
    }

    public handleEvent(responseProcessor: IResponseProcessor, event: Event) {

        this.services.logger.debug("incoming event: %s", JSON.stringify(event));

        var token = event.token;
        if (!token) {
            responseProcessor.respondError("No token in request");
            return;
        }

        var services = this.createServices(token);

        this.userProvider.getUserId(services, token).then(
            r => {
                event.sourcePlayerId = r;
                this.process(services, responseProcessor, event);
            },
            e => {
                responseProcessor.respondError(e);
            });
    }

    private process(services: Services, responseProcessor: IResponseProcessor, event: Event) {
        services.logger.debug("Beginning event processing");
        services.logger.debug(event);

        var gameId = event.gameId;
        this.gameProvider.getOrLoadGame(services, gameId, event.sourcePlayerId).then(game => {
            var processor = new GameEventProcessor(services, responseProcessor, this.gameProvider);
            processor.processRequest(game, event);
        });
    }

    public getGame(id: string) {
        return this.gameProvider.getGame(id);
    }

    public getGameDto(id: string) {
        return this.gameProvider.getDto(id);
    }

    public evictCache() {
        this.services.logger.info("Clearing game cache");
        this.gameProvider.evictCache();
    }

    private createServices(token: string): Services {
        var auth = new AuthService();
        auth.token = token;
        return new Services(auth);
    }

    private loadResources() {
        var services = this.createServices("");
        var cardLoader = new CardDefinitionLoader(services);
        cardLoader.load().then(_ => {
            services.logger.info("Card definitions loaded successfully");
        });
    }

}