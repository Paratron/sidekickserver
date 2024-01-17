import { IncomingMessage, ServerResponse } from "http";

export interface ActionController {
    /* Stops the whole request. Its not going to be answered and will time out */
    stop: () => void;
    /* Skips the request to the target and immediately goes to preResponse chain. */
    skipRequest: () => void;
}

export interface ActionContext {
    requestId: number;
    requestBody: string;
    responseBody: string;
    requestBodyJson: any;
    responseBodyJson: any;
    [key: string]: any;

}

interface ArgumentObject {
    req: IncomingMessage;
    res: ServerResponse;
    control: ActionController;
    /* The context object can be used to carry any data through all pre* handlers */
    ctx: ActionContext,
    next: () => void;
}

export interface SideKickServerModule {
    name: string;
    preRequest?: (args: ArgumentObject) => void;
    preResponse?: (args: ArgumentObject) => void;
}