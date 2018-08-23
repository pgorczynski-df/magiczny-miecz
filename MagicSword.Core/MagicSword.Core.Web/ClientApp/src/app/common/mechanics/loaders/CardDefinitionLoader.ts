import { CardStackDefinition } from "@App/common/mechanics/definitions/CardStackDefinition";
import { Services } from "@App/Services";

export class CardDefinitionLoader {

    constructor(private services: Services) {
    }

    load(): Promise<any> {

        var promises = [];

        for (var def of CardStackDefinition.cardStackDefinitions) {
            promises.push(CardStackDefinition.loadCardDefinitions(def, this.services));
        }

        return Promise.all(promises);
    }


}
