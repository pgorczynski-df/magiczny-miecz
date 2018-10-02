import { CardStackDefinition } from "@Common/mechanics/definitions/CardStackDefinition";
import { Services } from "@App/Services";
import { HttpClient } from "@Common/client/HttpClient";

export class CardDefinitionLoader {

    constructor(private services: Services) {
    }

    load(): Promise<any> {

        var promises = [];

        for (var def of CardStackDefinition.cardStackDefinitions) {
            promises.push(this.loadCardDefinitions(def, this.services));
        }

        return Promise.all(promises);
    }

    private loadCardDefinitions(definition: CardStackDefinition, services: Services): Promise<boolean> {
        var client = new HttpClient(services, services.settings.gameServerUrl);
        var promise = client
            .get(definition.resourcePath + "/" + definition.cardDefinitionsUrl)
            .then(res => {
                //seems that the returned result type differs in Chrome and Node:
                switch (res.constructor.name) {
                    case "Array": //Chrome
                        definition.cardDefinitions = res;
                        break;
                    case "String": //Node
                        //TODO proper fix (remove BOM from files)
                        //workaround: https://stackoverflow.com/questions/44176194/json-parse-causes-error-syntaxerror-unexpected-token-in-json-at-position-0
                        var parsed = JSON.parse(res.trim());
                        definition.cardDefinitions = parsed;
                        break;
                    default:
                        throw new Error("Unexpected result type: " + res.constructor.name);
                }
                return true;
            });
        return promise;
    }

}
