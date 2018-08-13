import { createServer, Server } from "http";
import * as express from "express";
import * as socketIo from "socket.io";
import { PlayerHubClient } from "./app/PlayerHubClient";
import { Services } from "./app/Services";
import { AuthService } from "./app/AuthService";
import {AccountClient} from "./app/AccountClient";

//import { Message } from './model';

export class GameServer {
  public static readonly PORT: number = 3000;
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;

  private hubs: any = {};
  private accountClient = new AccountClient();

  constructor() {
    this.port = (<any>process.env).PORT || GameServer.PORT;

    this.accountClient.validateToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicGF3ZWwyazRAZ21haWwuY29tIiwiQXNwTmV0LklkZW50aXR5LlNlY3VyaXR5U3RhbXAiOiJOUEdBTkVNNVJFS1RXQVFMWVRET1RQVEZFSDdNVTQzNyIsImV4cCI6MTUzNjczNTc5MiwiaXNzIjoiU2lnbmFsUkF1dGhlbnRpY2F0aW9uU2FtcGxlIiwiYXVkIjoiU2lnbmFsUkF1dGhlbnRpY2F0aW9uU2FtcGxlIn0.XF8dNmlrJSTKa47AHUPRzoXYFZebdDta3TQs1VNCIKU");

    this.app = express();
    this.mountRoutes();
    this.server = createServer(this.app);
    this.io = socketIo(this.server);

    this.listen();
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });

    this.io.on("connect", (socket: socketIo.Socket) => {
      console.log("Connected client on port %s.", this.port);

      socket.on("Publish", (m: any) => {
        console.log("[server](event): %s", JSON.stringify(m));

        var token = m.token;
        if (!token) {
          console.log("no token!!!");
          return;
        }

        var hub = this.hubs[token] as PlayerHubClient;
        if (!hub) {

          console.log("creating new hub");

          hub = new PlayerHubClient(new Services(new AuthService()));
          this.hubs[token] = hub;

          hub.init(token).then(r => {

            hub.attachEvents((ev) => {

              console.log("forwarding event");

              socket.emit("NewEvent", ev);
            });

            console.log("hub connected");

            hub.publish(m);

          },
            e => {
              console.log("connection error ");
            });

        } else {
          hub.publish(m);

        }

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