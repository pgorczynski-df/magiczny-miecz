import { Services } from "@App/Services";
import { AccountClient } from "@App/common/client/AccountClient";
import { UserDto } from "@App/common/client/UserDto";

export class UserProvider {

    private cache: { [token: string]: UserDto } = {};

    getUser(services: Services, token: string): Promise<UserDto> {

        var user = this.cache[token];
        if (!user) {
            services.logger.debug("Cache did not contain token");
            var accountClient = new AccountClient(services);
            return accountClient.validateToken(token).then(
                r => {
                    user = r;
                    this.cache[token] = user;
                    return user;
                });
        }

        services.logger.debug("Found user in cache");
        return Promise.resolve(user);
    }

}
