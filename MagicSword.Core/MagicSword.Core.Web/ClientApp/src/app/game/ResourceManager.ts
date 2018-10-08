import * as THREE from "three";
import { Injectable } from "@angular/core";

import { Services } from "@Common/infrastructure/Services";
import { CardDefinitionLoader } from "@Common/mechanics/loaders/CardDefinitionLoader";
import { EventType } from "@Common/events/EventType";
import { AttributeDefinition } from "@Common/mechanics/definitions/AttributeDefinition";

@Injectable()
export class ResourceManager {

    public static font: THREE.Font = null;

    private static readonly localization: { [key: string]: string } = {};

    private cardDefinitionLoader: CardDefinitionLoader;
    private fontLoader: THREE.FontLoader;

    constructor(private services: Services) {
        this.cardDefinitionLoader = new CardDefinitionLoader(this.services);
        this.fontLoader = new THREE.FontLoader();

        this.addMessages();
    }

    public load(): Promise<any> {

        var promises: Promise<any>[] = [];

        promises.push(new Promise(resolve => {
            this.fontLoader.load("/assets/fonts/helvetiker_regular.typeface.json", (font) => {
                ResourceManager.font = font;
                resolve();
            });
        }));

        promises.push(this.cardDefinitionLoader.load());

        return Promise.all(promises);
    }

    public static getLocalizationMessage(key: string) {
        var msg = ResourceManager.localization[key];
        return msg ? msg : key;
    }

    private addMessages() {
        var d = ResourceManager.localization;
        d[AttributeDefinition.Strength] = "Miecz";
        d[AttributeDefinition.Power] = "Magia";
        d[AttributeDefinition.Gold] = "Złoto";
        d[AttributeDefinition.Life] = "Życie";
        d["attribute_give"] = "Nadaj atrybut: {0}";
        d["attribute_remove"] = "Usuń atrybut: {0}";
        d[EventType.Error] = "Wystąpił błąd: {0}";
        d[EventType.JoinGame] = "Gracz {0} dołączył do gry";
        d[EventType.ActorMove] = "Gracz {0} przesunął kartę {1}";
        d[EventType.ActorRotate] = "Gracz {0} obrócił kartę {1}";
        d[EventType.ViewStack] = "Gracz {0} ogląda zawartość stosu {1} {2}";
        d["cards"] = "kart";
        d["disposedCards"] = "odłożonych kart";
        d[EventType.DrawCard] = "Gracz {0} wyciągnął kartę {1}";
        d[EventType.DrawCard + "_fail"] = "Na stosie {0} zabrakło kart. Dołóż zużyte i potasuj.";
        d[EventType.PickCard] = "Gracz {0} wyłożył kartę {1}";
        d[EventType.DisposeCard] = "Gracz {0} odłożył kartę {1}";
        d[EventType.DiceThrow] = "Gracz {0} wyrzucił kostką: {1}";
        d[EventType.PlayerMessage] = "Gracz {0} wysłał wiadomość: \"{1}\"";
        d[EventType.CardSetAttribute] = "Gracz {0} nadał karcie {1} atrybut {2} o wartości {3}";
        d[EventType.StackShuffle] = "Gracz {0} potasował stos {1}";
        d[EventType.StackPushDisposedCards] = "Gracz {0} dołożył odłożone karty do stosu {1}";
        d["login_unknown_user_password"] = "Niepoprawny email/hasło";
        d["login_account_locked"] = "Konto zablokowane";
        d["login_email_password_required"] = "Email/hasło wymagane";
    }

}
