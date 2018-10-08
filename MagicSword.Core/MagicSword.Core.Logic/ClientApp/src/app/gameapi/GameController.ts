import { Request, Response, Application } from "express";

import { IGamesRepository } from "@Common/repository/IGamesRepository";
import { Services } from "@Common/infrastructure/Services";

export class GameController {

    public readonly route = "/game";

    public secureRoutes: string[] = [this.route + "/MyGames", this.route + "/CreateGame"];

    constructor(private services: Services, private repository: IGamesRepository) {
    }

    public init(app: Application): void {

        app.route(this.route + "/OpenGames")
            .get((req: Request, res: Response) => {
                this.services.logger.debug(`Attepting to GET ${req.url}`);
                this.promiseToResponse(this.repository.getOpenGames(), res);
            });

        app.route(this.route + "/MyGames")
            .get((req: Request, res: Response) => {
                this.services.logger.debug(`Attepting to GET ${req.url}`);
                var user = req["requestingUser"];
                this.promiseToResponse(this.repository.getUserGames(user.id), res);
            });

        app.route(this.route + "/CreateGame")
            .post((req: Request, res: Response) => {
                this.services.logger.debug(`Attepting to POST ${req.url}`);
                var user = req["requestingUser"];
                this.promiseToResponse(this.repository.createGame(user), res);
            });
    }

    private promiseToResponse(promise: Promise<any>, res: Response) {
        promise.then(r => res.json(r), e => res.send(e));
    }
}
