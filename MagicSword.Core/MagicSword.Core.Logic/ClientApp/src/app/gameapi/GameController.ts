import * as mongoose from 'mongoose';
import { Request, Response, NextFunction, Application } from 'express';

import { GameSchema } from "@App/gameapi/GameSchema";

const Game = mongoose.model('Game', GameSchema);

export class GameController {

    public init(app: Application): void {

        app.route('/game')
            .get((req: Request, res: Response, next: NextFunction) => {
                console.log(`Request from: ${req.originalUrl}`);
                console.log(`Request type: ${req.method}`);
                //if (req.query.key !== '78942ef2c1c98bf10fca09c808d718fa3734703e') {
                //    res.status(401).send('You shall not pass!');
                //} else {
                next();
                //}
            }, this.getGames)

            .post(this.addNewGame);

        app.route('/game/:gameId')
            .get(this.getGameWithID)
            .put(this.updateGame)
            .delete(this.deleteGame);

    }

    public addNewGame(req: Request, res: Response) {
        let newGame = new Game(req.body);

        newGame.save((err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }

    public getGames(req: Request, res: Response) {
        Game.find({}, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }

    public getGameWithID(req: Request, res: Response) {
        Game.findById(req.params.gameId, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }

    public updateGame(req: Request, res: Response) {
        Game.findOneAndUpdate({ _id: req.params.gameId }, req.body, { new: true }, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }

    public deleteGame(req: Request, res: Response) {
        Game.remove({ _id: req.params.gameId }, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted contact!' });
        });
    }

}
