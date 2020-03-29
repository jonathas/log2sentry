import { APIGatewayEvent, APIGatewayEventRequestContext } from "aws-lambda";
import Util from "./helpers/util";
import LambdaResponse from "./dto/lambda-response";
import { HttpCode } from "./dto/http-codes";
import Logger from "./helpers/logger";
import { Log2SentryRequest } from "./interfaces";

class Log2Sentry {

    private event: APIGatewayEvent;
    private context: APIGatewayEventRequestContext;

    public constructor(event: APIGatewayEvent, context: APIGatewayEventRequestContext) {
        this.event = event;
        this.context = context;
    }

    public async run(): Promise<any> {
        try {
            const payload = Util.parseBody(this.event) as unknown as Log2SentryRequest;
            this.validate(payload);

            this.initSentry(payload);
            this.setUser(payload);
            this.setTags(payload);
            this.setBreadcrumbs(payload);

            const eventId = await Logger.logToSentry(payload.message, payload.level);
            return { eventId };
        } catch (err) {
            await Logger.error(err);
            throw new LambdaResponse(HttpCode.BAD_REQUEST, JSON.stringify({ message: err.message }));
        }
    }

    private validate(payload: Log2SentryRequest): void {
        if (!payload) {
            throw new Error("The payload cannot be empty");
        }
    }

    private initSentry(payload: Log2SentryRequest): void {
        if (payload.release && payload.release.name && payload.release.version) {
            if (payload.environment) {
                Logger.init(payload.release.name, payload.release.version, payload.environment);
            } else {
                Logger.init(payload.release.name, payload.release.version);
            }
        }
    }

    private setUser(payload: Log2SentryRequest): void {
        if (payload.user) {
            Logger.setUser(payload.user);
        }
    }

    private setTags(payload: Log2SentryRequest): void {
        if (payload.tags && payload.tags.length > 0) {
            payload.tags.forEach(t => Logger.setTag(t.name, t.value));
        }
    }

    private setBreadcrumbs(payload: Log2SentryRequest): void {
        if (payload.breadcrumbs && payload.breadcrumbs.length > 0) {
            payload.breadcrumbs.forEach(b =>
                Logger.addBreadcrumb({
                    type: b.type,
                    level: b.level,
                    category: b.category,
                    message: b.message,
                    data: Util.parseObject(b.data)
                })
            );
        }
    }

}

export default Log2Sentry;
