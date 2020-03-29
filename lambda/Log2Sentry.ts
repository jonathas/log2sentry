import { APIGatewayEvent, APIGatewayEventRequestContext } from "aws-lambda";
import Util from "./helpers/util";
import LambdaResponse from "./dto/lambda-response";
import { HttpCode } from "./dto/http-codes";

class Log2Sentry {

    private event: APIGatewayEvent;
    private context: APIGatewayEventRequestContext;

    public constructor(event: APIGatewayEvent, context: APIGatewayEventRequestContext) {
        this.event = event;
        this.context = context;
    }

    public run(): Promise<any> {
        try {
            const payload = Util.parseBody(this.event);
            return payload;
        } catch (err) {
            throw new LambdaResponse(HttpCode.BAD_REQUEST, JSON.stringify({ message: err.message }));
        }
    }

}

export default Log2Sentry;
