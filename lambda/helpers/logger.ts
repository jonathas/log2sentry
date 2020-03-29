import * as sentry from "@sentry/node";
import pino from "pino";
const log = pino();
import Util from "./util";

class Logger {
    init(name: string, version: string, environment: string): void {
        sentry.init({
            dsn: process.env.SENTRY_DSN,
            release: `${name}@${version}`,
            environment
        });
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

    public async logToSentry(event: sentry.Event): Promise<void> {
        sentry.captureEvent(event);
        await sentry.flush();
    }
}

export default new Logger();
