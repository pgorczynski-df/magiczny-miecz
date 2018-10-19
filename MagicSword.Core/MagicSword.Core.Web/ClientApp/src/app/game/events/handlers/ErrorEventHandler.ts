import { Event } from "@Common/events/Event";
import { EventType } from "@Common/events/EventType";
import { ClientEventHandlerBase } from "@App/game/events/ClientEventHandlerBase";
import { StringUtils } from "@Common/utils/StringUtils";
import { ErrorDto } from "@Common/dto/ErrorDto";

export class ErrorEventHandler extends ClientEventHandlerBase {

    getEventType(): string {
        return EventType.Error;
    }

    processResponse(event: Event) {
        var error = event.data as ErrorDto;
        if (error.code === 401) {
            this.context.services.clientAuthService.logoutAndNavigateToLogin(location);
            return;
        }
        this.context.services.clientAuthService.navigate(["pages", "error"], { queryParams: { errorDto: JSON.stringify(error) } });
    }

    getMessage(event: Event): string {
        var error = event.data as ErrorDto;
        return StringUtils.format(this.r(), error.reason);
    }
}

