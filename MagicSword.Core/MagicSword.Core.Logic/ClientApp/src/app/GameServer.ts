import { createServer, Server } from "http";
import * as express from "express";
import * as socketIo from "socket.io";
import * as cors from "cors";

import { Services } from "@App/Services";
import { SocketResponseProcessor } from "@App/game/SocketResponseProcessor";
import { Event } from "@App/game/Event";
import { GameManager } from "@App/GameManager";

export class GameServer {

    public static readonly PORT: number = 3000;

    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    private services: Services;
    private gameManager: GameManager;

    constructor() {
        this.port = (<any>process.env).PORT || GameServer.PORT;

        this.app = express();

        this.app.use(cors());

        const router = express.Router();
        router.get("/", (req, res) => {
            res.json({
                message: "Hello World!"
            });
        });
        this.app.use("/api", router);

        this.app.use("/", express.static("./src"));

        this.server = createServer(this.app);
        this.io = socketIo(this.server);

        this.services = new Services(null);
        this.gameManager = new GameManager(this.services);
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