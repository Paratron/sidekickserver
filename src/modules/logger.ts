import { SideKickServerModule } from "../../types";

const LoggerModule: SideKickServerModule = {
    name: "Logger",
    preRequest: ({ req, ctx, next }) => {
        console.log(`[${ctx.requestId}] Received request: ${req.method} ${req.url}`);
        console.log(`[${ctx.requestId}] Request headers:`, req.headers);
        console.log(`[${ctx.requestId}] Request body:`, ctx.requestBodyJson || ctx.requestBody);
        console.log("");
        next();
    },
    preResponse: ({ req, ctx, next }) => {
        console.log(`[${ctx.requestId}] Received response: ${req.statusCode} ${req.statusMessage}`);
        console.log(`[${ctx.requestId}] Response headers:`, req.headers);
        console.log(`[${ctx.requestId}] Response body:`, ctx.responseBodyJson || ctx.responseBody);
        console.log("");
        console.log("=========================");
        console.log("");
        next();
    }
}

export default LoggerModule;