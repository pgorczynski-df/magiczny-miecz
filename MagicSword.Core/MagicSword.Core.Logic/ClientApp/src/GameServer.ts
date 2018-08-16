import { createServer, Server } from "http";
import * as express from "express";
import * as socketIo from "socket.io";
import { PlayerHubClient } from "./app/PlayerHubClient";
import { Services } from "./app/Services";
import { AuthService } from "./app/AuthService";
import { AccountClient } from "./app/AccountClient";
import { Event } from "./app/game/Event";
import { GameEventProcessor } from "./app/game/GameEventProcessor";
import { SocketResponseProcessor } from "./app/game/SocketResponseProcessor";
import {GamesApiClient} from "./app/game/repository/GamesApiClient";
//import { Message } from './model';

export class GameServer {
    public static readonly PORT: number = 3000;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    private hubs: any = {};
    private accountClient = new AccountClient();

    private games: any = {};

    constructor() {
        this.port = (<any>process.env).PORT || GameServer.PORT;

        this.app = express();
        this.mountRoutes();
        this.server = createServer(this.app);
        this.io = socketIo(this.server);

        this.listen();

    }

    private createServices(token: string): Services {
        var auth = new AuthService();
        auth.token = token;
        return new Services(auth);
    }

    private getProcessor(services: Services, gameId: string, socket: socketIo.Socket): GameEventProcessor {
        var processor = this.games[gameId] as GameEventProcessor;
        if (!processor) {
            var repo = new GamesApiClient(services);
            processor = new GameEventProcessor(services, new SocketResponseProcessor(services, this.io, socket), repo);
            //TODO think this through
            //this.games[gameId] = processor;
        }
        return processor;
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log("Running server on port %s", this.port);
        });

        this.io.on("connect", (socket: socketIo.Socket) => {
            console.log("Connected client on port %s.", this.port);

            socket.on("Publish", (event: Event) => {
                console.log("[server](event): %s", JSON.stringify(event));

                var token = event.token;
                if (!token) {
                    console.log("no token!!!");
                    return;
                }

                var services = this.createServices(token);

                this.accountClient.validateToken(token).then(
                    r => {
                        var userId = r.userId;
                        event.sourcePlayerId = userId;
                        var processor = this.getProcessor(services, event.gameId, socket);
                        processor.processRequest(event);
                    },
                    e => {
                        socket.emit("Error", e);
                    });

                //var hub = this.hubs[token] as PlayerHubClient;
                //if (!hub) {

                //  console.log("creating new hub");

                //  hub = new PlayerHubClient(new Services(new AuthService()));
                //  this.hubs[token] = hub;

                //  hub.init(token).then(r => {

                //    hub.attachEvents((ev) => {

                //      console.log("forwarding event");

                //      socket.emit("NewEvent", ev);
                //    });

                //    console.log("hub connected");

                //    hub.publish(m);

                //  },
                //    e => {
                //      console.log("connection error ");
                //    });

                //} else {
                //  hub.publish(m);

                //}

                //this.io.emit('message', m);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });
        });
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.get("/", (req, res) => {
            res.json({
                message: "Hello World!"
            });
        });
        this.app.use("/", router);
    }

    public getApp(): express.Application {
        return this.app;
    }
}