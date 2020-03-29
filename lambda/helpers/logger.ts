import * as sentry from "@sentry/node";
import pino from "pino";
const log = pino();
import Util from "./util";

class Logger {
    init(name: string, version: string, environment?: string): void {
        const config = {
            dsn: process.env.SENTRY_DSN,
            release: `${name}@${version}`
        };
        if (environment) {
            config["environment"] = environment;
        }
        sentry.init(config);
        this.clearScope();
    }

    public info(msg: string): void {
        log.info(msg);
    }

    public clearScope(): void {
        sentry.configureScope((scope): void => {
            scope.clear();
            scope.setTag("platform", "node");
        });
    }

    public setTag(key: string, value: string): void {
        sentry.configureScope((scope): void => {
            scope.setTag(key, value);
        });
    }

    public setUser(user: sentry.User): void {
        sentry.configureScope((scope): void => {
            scope.setUser(user);
        });
    }

    public addBreadcrumb(breadcrumb: sentry.Breadcrumb): void {
        sentry.addBreadcrumb(breadcrumb);
    }

    /* istanbul ignore next */
    public async error(err: Error | string): Promise<void> {
        if (Util.isString(err as unknown)) {
            err = new Error(err.toString());
        }

        log.error(err as Error);

        sentry.captureException(err);
        await sentry.flush();
    }

    public async logToSentry(message: string, level: sentry.Severity): Promise<string> {
        const eventId = sentry.captureMessage(message, level);
        await sentry.flush();
        return eventId;
    }
}

export default new Logger();
