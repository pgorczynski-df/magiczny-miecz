import { Services } from "@App/Services";
import { AuthService } from "@App/AuthService";
import { CardDefinitionLoader } from "@App/common/mechanics/loaders/CardDefinitionLoader";
import { Event } from "@App/common/events/Event";
import { IResponseProcessor } from "@App/common/events/IResponseProcessor";
import { UserProvider } from "@App/UserProvider";
import { GameProvider } from "@App/common/repository/GameProvider";
import { EventDispatcher } from "@App/common/events/EventDispatcher";
import { CommonSerializer } from "@App/common/mechanics/CommonSerializer";

export class GameService {

    private commonSerializer = new CommonSerializer();
    private userProvider = new UserProvider();
    private gameProvider = new GameProvider(this.commonSerializer);
    private eventDispatcher = new EventDispatcher(this.gameProvider, this.commonSerializer);

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
                this.eventDispatcher.process(services, responseProcessor, event);
            },
            e => {
                responseProcessor.respondError(e);
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