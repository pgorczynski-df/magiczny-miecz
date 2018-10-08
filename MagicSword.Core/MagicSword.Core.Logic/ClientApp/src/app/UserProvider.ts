import { Services } from "@Common/infrastructure/Services";
import { AccountClient } from "@Common/client/AccountClient";
import { UserDto } from "@Common/client/UserDto";

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
                },
                e => {
                    services.logger.debug("token validation error");
                    services.logger.debug(e);
                    return null;
                });
        }

        services.logger.debug("Found user in cache");
        return Promise.resolve(user);
    }

}
