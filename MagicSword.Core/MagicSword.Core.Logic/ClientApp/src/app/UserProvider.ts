import { Services } from "@App/Services";
import { AccountClient } from "@App/common/client/AccountClient";

export class UserProvider {

    private cache: { [token: string]: any } = {};

    getUserId(services: Services, token: string): Promise<any> {

        var user = this.cache[token];
        if (!user) {
            services.logger.debug("Cache did not contain token");
            var accountClient = new AccountClient(services);
            return accountClient.validateToken(token).then(
                r => {
                    user = r.userId;
                    this.cache[token] = user;
                    return user;
                });
        }

        services.logger.debug("Found user in cache");
        return Promise.resolve(user);
    }

}
