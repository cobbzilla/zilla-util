export type ZillaMsgTransportName = "email" | "sms";

export const MESSAGE_TYPE_EMAIL: ZillaMsgTransportName = "email";
export const MESSAGE_TYPE_SMS: ZillaMsgTransportName = "sms";
export const MESSAGE_TYPE_VALUES: ZillaMsgTransportName[] = [MESSAGE_TYPE_EMAIL, MESSAGE_TYPE_SMS];

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
    name: ZillaMsgTransportName;
    sender: string;
    via: () => string;
    templates: string[];
    formatTo: (recipient: ZillaMsgRecipient) => string;
    send: (recipient: ZillaMsgRecipient, rendered: Record<string, string>) => Promise<unknown>;
};
