import { Request, Response, Application } from "express";

import { IGamesRepository } from "@Common/repository/IGamesRepository";
import { Services } from "@Common/infrastructure/Services";
import { GameInitializer } from "@Common/model/GameInitializer";

export class GameController {

    public readonly route = "/game";

    public secureRoutes: string[] = [this.route + "/MyGames", this.route + "/CreateGame", this.route + "/REST"];

    private gameInitializer = new GameInitializer(this.services, this.repository);

    constructor(private services: Services, private repository: IGamesRepository) {
    }

    public init(app: Application): void {

        app.route(this.route + "/PublicGames")
            .get((req: Request, res: Response) => {
                this.services.logger.debug(`Attepting to GET ${req.url}`);
                this.promiseToResponse(this.repository.getPublicGames(), res);
            });

        app.route(this.route + "/MyGames")
            .get((req: Request, res: Response) => {
                this.services.logger.debug(`Attepting to GET ${req.url}`);
                var user = req["requestingUser"];
                this.promiseToResponse(this.repository.getUserGames(user.id), res);
            });

        app.route(this.route + "/CreateGame")
            .post(async (req: Request, res: Response) => {
                this.services.logger.debug(`Attepting to POST ${req.url}`);
                var user = req["requestingUser"];

                var listDto = await this.repository.createGame(user);

                await this.gameInitializer.initGame(listDto.id, user);

                this.promiseToResponse(Promise.resolve(listDto), res);
            });

        app.route(this.route + "/REST/:gameId")
            .patch(async (req: Request, res: Response) => {
                this.services.logger.debug(`Attepting to PATCH ${req.url}`);
                var gameId = req.params.gameId;
                var user = req["requestingUser"];

                if (!await this.verifyIsOwner(res, user.id, gameId)) {
                    return;
                }

                var body = req.body;
                this.promiseToResponse((this.repository as any).updateMetadata(gameId, body), res);
            })
            .delete(async (req: Request, res: Response) => {
                this.services.logger.debug(`Attepting to DELETE ${req.url}`);
                var gameId = req.params.gameId;
                var user = req["requestingUser"];

                if (!await this.verifyIsOwner(res, user.id, gameId)) {
                    return;
                }

                this.promiseToResponse(this.repository.delete(gameId), res);
            });
    }

    private async verifyIsOwner(res: Response, userId: string, gameId: string) {
        var game = await this.repository.getGame(gameId);

        if (!game) {
            res.status(404).send(`Game ${gameId} not found`);
            return false;
        }

        if (game.ownerId !== userId) {
            console.log(game);
            res.status(403).send(`User ${userId} is not the owner of game ${gameId}`);
            return false;
        }

        return true;
    }

    private promiseToResponse(promise: Promise<any>, res: Response) {
        promise.then(r => res.json(r), e => res.send(e));
    }
}
