import { createServer, Server } from "http";
import * as express from "express";
import * as socketIo from "socket.io";
import * as cors from "cors";

import { Services } from "@App/Services";
import { SocketResponseProcessor } from "@App/SocketResponseProcessor";
import { Event } from "@App/common/events/Event";
import { GameService } from "@App/GameService";

declare var process;

export class GameServer {

    public static readonly PORT: number = 3000;

    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    private services: Services;
    private gameManager: GameService;

    constructor() {

        this.services = new Services(null);
        this.port = (<any>process.env).PORT || GameServer.PORT;

        this.services.logger.info("Starting game server");


        this.services.logger.info("Environment variables: ");
        for (const key of Object.keys(process.env)) {
            const val = process.env[key];
            this.services.logger.info(`'${key}': '${val}'`);
        }

        this.app = express();

        this.app.use(cors());

        const router = express.Router();
        //router.get("/game/:id", (req, res) => {
        //    var gameId = req.params.id;
        //    res.json(this.gameManager.getGame(gameId));
        //});
        //router.get("/gamedto/:id", (req, res) => {
        //    var gameId = req.params.id;
        //    res.json(this.gameManager.getGameDto(gameId));
        //});
        router.get("/game_evictcache", (req, res) => {
            this.gameManager.evictCache();
            res.json("OK");
        });
        this.app.use("/api", router);

        this.app.use("/", express.static("./src"));

        this.server = createServer(this.app);
        this.io = socketIo(this.server);

        this.gameManager = new GameService(this.services);
        this.gameManager.init();

        this.listen();

    }

    private listen(): void {
        this.server.listen(this.port, () => {
            this.services.logger.info("Running server on port %s", this.port);
        });

        this.io.on("connect", (socket: socketIo.Socket) => {
            this.services.logger.info("Connected client on port %s.", this.port);

            socket.on("Publish", (event: Event) => {

                var responseProcessor = new SocketResponseProcessor(this.services, this.io, socket);
                responseProcessor.registerCaller(event);

                this.gameManager.handleEvent(responseProcessor, event);
            });

            socket.on("disconnect", () => {
                this.services.logger.info("Client disconnected");
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}
