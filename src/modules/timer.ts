import { SideKickServerModule } from "../../types";

const timerModule: SideKickServerModule = {
    name: "Timer",
    preRequest: ({ ctx, next }) => {
        ctx.startTime = Date.now();
        next();
    },
    preResponse: ({ ctx, next }) => {
        ctx.endTime = Date.now();
        ctx.duration = ctx.endTime - ctx.startTime;
        console.log("Response", ctx.requestId, "took", ctx.duration, "ms");
        console.log("");
        next();
    }
};

export default timerModule;