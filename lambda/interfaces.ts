import * as sentry from "@sentry/node";

export interface Release {
    name: string;
    version: string;
}

export interface User {
    id: string;
    ip_address: string;
    email: string;
    username: string;
}

export interface Tag {
    name: string;
    value: string;
}

export interface Breadcrumb {
    level: sentry.Severity;
    category: string;
    message: string;
    data: any;
}

export interface Log2SentryRequest {
    dsn?: string;
    release: Release;
    environment: "production | staging | development";
    message: string;
    level: sentry.Severity;
    user: User;
    tags: Tag[];
    breadcrumbs: Breadcrumb[];
}

export interface SentryInit {
    name: string;
    version: string;
    environment?: string;
    dsn?: string;
}
