import { APIGatewayEvent } from "aws-lambda";

class Util {
    public static parseBody(event: APIGatewayEvent): any {
        if (!event.body) {
            return null;
        }
        const data = JSON.parse(event.body);
        return data;
    }

    public static isString(obj: unknown): boolean {
        return Object.prototype.toString.call(obj) === "[object String]";
    }
}

export default Util;
