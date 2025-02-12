export enum ZillaMsgTransportType {
    email = "email",
    sms = "sms",
}

export const MESSAGE_TYPE_VALUES: ZillaMsgTransportType[] = Object.values(ZillaMsgTransportType);

export type ZillaMsgRecipient = {
    name?: string;
    destination: string;
};

export type ZillaMessage = {
    transport: string;
    type: ZillaMsgTransportType;
    via: string;
    template: string;
    locale: string;
    from: string;
    to: string;
    messages: Record<string, string>;
    ctime: number;
};

export type ZillaMsgTransport = {
    name: string;
    type: ZillaMsgTransportType;
    sender: string;
    via: () => string;
    templates: string[];
    formatTo: (recipient: ZillaMsgRecipient) => string;
    send: (recipient: ZillaMsgRecipient, rendered: Record<string, string>) => Promise<unknown>;
};
