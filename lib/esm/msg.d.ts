export declare enum ZillaMsgTransportName {
    email = "email",
    sms = "sms"
}
export declare const MESSAGE_TYPE_VALUES: ZillaMsgTransportName[];
export type ZillaMsgRecipient = {
    name?: string;
    destination: string;
};
export type ZillaMessage = {
    transport: ZillaMsgTransportName;
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
    type: ZillaMsgTransportName;
    sender: string;
    via: () => string;
    templates: string[];
    formatTo: (recipient: ZillaMsgRecipient) => string;
    send: (recipient: ZillaMsgRecipient, rendered: Record<string, string>) => Promise<unknown>;
};
