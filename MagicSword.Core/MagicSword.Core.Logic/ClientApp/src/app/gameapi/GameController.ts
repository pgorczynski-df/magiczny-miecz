import { Request, Response, NextFunction, Application } from "express";

import { IGamesRepository } from "@App/common/repository/IGamesRepository";
import { Services } from "@App/Services";

export class GameController {

    public readonly route = "/game";

    constructor(private services: Services, private repository: IGamesRepository) {
    }

    public init(app: Application): void {

        app.route(this.route)
            .get(this.get)
            .post(this.post);

        app.route(this.route + "/MyGames")
            .get(this.get);

        app.route(this.route + "/OpenGames")
            .get(this.get);

        app.route(this.route + "/:gameId")
            .get(this.getById)
            .patch(this.patch)
            .delete(this.delete);

    }

    //BEWARE: do not convert lambas to member functions

    public get = (req: Request, res: Response) => {
        this.services.logger.debug(`Attepting to GET ${req.url}`);
        this.promiseToResponse(this.repository.getMyGames(), res);
    }

    public getById = (req: Request, res: Response) => {
        this.services.logger.debug(`Attepting to GET ${req.url}`);
        var id = req.params.gameId;
        this.promiseToResponse(this.repository.getGame(id), res);
    }
    public post = (req: Request, res: Response) => {
        this.services.logger.debug(`Attepting to POST ${req.url}`);
        var body = req.body;
        this.promiseToResponse(this.repository.save(body), res);
    }

    public patch = (req: Request, res: Response) => {
        this.services.logger.debug(`Attepting to PATCH ${req.url}`);
        var id = req.params.gameId;
        var body = req.body;
        this.promiseToResponse(this.repository.update(id, body), res);
    }

    public delete = (req: Request, res: Response) => {
        this.services.logger.debug(`Attepting to DELETE ${req.url}`);
        res.send("Not supported");
    }

    //end of BEWARE

    private promiseToResponse(promise: Promise<any>, res: Response) {
        promise.then(r => res.json(r), e => res.send(e));
    }
}
