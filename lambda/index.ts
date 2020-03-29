/*
 * This allows TypeScript to detect our global value
 * @see https://docs.sentry.io/platforms/node/typescript/
*/
declare global {
    /* eslint-disable-next-line */
    namespace NodeJS {
        interface Global {
            __rootdir__: string;
        }
    }
}

global.__rootdir__ = __dirname || process.cwd();

import { APIGatewayEvent, APIGatewayProxyResult, APIGatewayEventRequestContext } from "aws-lambda";
import Log2Sentry from "./Log2Sentry";
import LambdaResponse from "./dto/lambda-response";
import { HttpCode } from "./dto/http-codes";

export const handler = async (event: APIGatewayEvent, context: APIGatewayEventRequestContext): Promise<APIGatewayProxyResult> => {
    try {
        const handler = new Log2Sentry(event, context);
        const res = await handler.run();
        return new LambdaResponse(HttpCode.CREATED, JSON.stringify(res));
    } catch (err) {
        if (err instanceof LambdaResponse) {
            return err;
        }
        return new LambdaResponse(HttpCode.INTERNAL_ERROR, JSON.stringify({ message: err.message }));
    }
};
