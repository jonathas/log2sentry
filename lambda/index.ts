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

import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        return {
            "statusCode": 200,
            "body": JSON.stringify({event})
        };
    } catch (err) {
        console.log(err);
        return err;
    }
};
