import { createServer, Server } from "http";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as socketIo from "socket.io";
import * as cors from "cors";
import * as mongoose from "mongoose";

import { Services } from "@Common/infrastructure/Services";
import { SocketResponseProcessor } from "@App/SocketResponseProcessor";
import { Event } from "@Common/events/Event";
import { GameService } from "@App/GameService";
import { GameController } from "@App/gameapi/GameController";
import { NoSqlGamesRepository } from "@App/gameapi/NoSqlGamesRepository";

declare var process;

export class GameServer {

    public static readonly PORT: number = 3000;

    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    private services: Services;
    private gameService: GameService;
    private gameController: GameController;
    private repository: NoSqlGamesRepository;

    constructor() {

        this.services = new Services(null);
        this.port = GameServer.PORT;

        this.services.logger.info("Starting game server");


        this.services.logger.info("Environment variables: ");
        for (const key of Object.keys(process.env)) {
            const val = process.env[key];
            this.services.logger.info(`'${key}': '${val}'`);
        }

        this.app = express();

        this.app.use(cors());
        this.app.use(bodyParser.json());

        this.app.use("/", express.static("./src"));

        this.repository = new NoSqlGamesRepository(this.services);
        this.gameController = new GameController(this.services, this.repository);
        for (var route of this.gameController.secureRoutes) {
            this.secureRoute(route);
        }

        this.gameController.init(this.app);

        this.server = createServer(this.app);
        this.io = socketIo(this.server);

        this.gameService = new GameService(this.services, this.repository);
        this.connectDb();
    }

    private connectDb() {
        var mongoUrl = this.services.settings.noSqlConnectionString;

        this.services.logger.info(`Attempting to connect to Mongo at: ${mongoUrl}`);

        const options = {
            useNewUrlParser: true,
            reconnectTries: 5, // Never stop trying to reconnect
            reconnectInterval: 10000, // Reconnect every 500ms
            connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        };
        mongoose.connect(mongoUrl, options).then(
            () => {
                this.services.logger.info("Successfully connected to db");
                this.listen();

            },
            err => {
                this.services.logger.error("Connection to db failed");
            });
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            this.services.logger.info("Running server on port %s", this.port);
            this.gameService.init(); //fetch resources - after server starts
        });

        this.io.on("connect", (socket: socketIo.Socket) => {
            this.services.logger.info("Connected client on port %s.", this.port);

            socket.on("Publish", (event: Event) => {

                var responseProcessor = new SocketResponseProcessor(this.services, this.io, socket);
                responseProcessor.registerCaller(event);

                this.gameService.handleEvent(responseProcessor, event);
            });

            socket.on("disconnect", () => {
                this.services.logger.info("Client disconnected");
            });
        });
    }

    private secureRoute(route: string) {

        this.app.route(new RegExp(`^${route}`, "i")).all(async (req: express.Request, res: express.Response, next: express.NextFunction) => {

            var auth = req.get("Authorization");
            if (!auth) {
                res.status(401).send("Missing auth header");
                return;
            }

            if (!auth.startsWith("Bearer ")) {
                res.status(401).send("Unsupported auth method");
                return;
            }

            var split = auth.split(" ");
            if (split.length !== 2) {
                res.status(401).send("Invalid auth header");
                return;
            }

            var token = split[1];

            var user = await this.gameService.userProvider.getUser(this.services, token);
            if (user === null) {
                res.status(401).send("Invalid token");
                return;
            }

            req["requestingUser"] = user;
            this.services.logger.debug(`User ${user.id} authorized successfully`);

            next();

        });

    }

    public getApp(): express.Application {
        return this.app;
    }
}
