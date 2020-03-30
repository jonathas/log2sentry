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
    release: Release;
    environment: "production | staging | development";
    message: string;
    level: sentry.Severity;
    user: User;
    tags: Tag[];
    breadcrumbs: Breadcrumb[];
}