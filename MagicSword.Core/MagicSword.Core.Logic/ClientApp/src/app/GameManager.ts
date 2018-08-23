import { Services } from "@App/Services";
import {AuthService} from "@App/AuthService";

import {GameEventProcessor} from "@App/game/GameEventProcessor";
import {GamesApiClient} from "@App/common/client/GamesApiClient";
import {CardDefinitionLoader} from "@App/common/mechanics/loaders/CardDefinitionLoader";
import { Event } from "@App/game/Event";
import {IResponseProcessor} from "@App/game/IResponseProcessor";
import {UserProvider} from "@App/UserProvider";

export class GameManager {

    private userProvider = new UserProvider();

    private games = {};

    constructor(private services: Services) {
    }

    public init() {
        this.loadResources();
    }

    public handleEvent(responseProcessor: IResponseProcessor, event: Event) {

        this.services.logger.debug("incoming event: %s", JSON.stringify(event));

        var token = event.token;
        if (!token) {
            console.log("no token!!!");
            return;
        }

        var services = this.createServices(token);
   
        this.userProvider.getUserId(services, token).then(
            r => {
                event.sourcePlayerId = r;
                var processor = this.getProcessor(services, event.gameId, responseProcessor);
                services.logger.debug("Sending event to processing");
                services.logger.debug(event);
                processor.processRequest(event);
            },
            e => {
                this.services.logger.error(e);
                responseProcessor.respondCaller({ eventType: "Error" } as any);
            });
    }

    private createServices(token: string): Services {
        var auth = new AuthService();
        auth.token = token;
        return new Services(auth);
    }

    private getProcessor(services: Services, gameId: string, responseProcessor: IResponseProcessor): GameEventProcessor {
        var processor = this.games[gameId] as GameEventProcessor;
        if (!processor) {
            var repo = new GamesApiClient(services);
            processor = new GameEventProcessor(services, responseProcessor, repo);
            //TODO think this through - auth service here is request-scoped
            //this.games[gameId] = processor;
        }
        return processor;
    }

    private loadResources() {
        var services = this.createServices("");
        var cardLoader = new CardDefinitionLoader(services);
        cardLoader.load().then(_ => {
            services.logger.info("Card definitions loaded successfully");
        });
    }

}