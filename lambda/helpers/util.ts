import { APIGatewayEvent } from "aws-lambda";

class Util {
    public static parseBody(event: APIGatewayEvent): any {
        if (!event.body) {
            return null;
        }
        const data = JSON.parse(event.body);
        return data;
    }
}

export default Util;
