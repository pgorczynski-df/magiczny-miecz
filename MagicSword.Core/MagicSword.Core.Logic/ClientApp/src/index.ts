require('module-alias/register');

import {GameServer} from "@App/GameServer";

let app = new GameServer().getApp();
export { app };