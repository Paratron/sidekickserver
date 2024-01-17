import * as http from 'http';

import LoggerModule from './modules/logger';
import TimerModule from "./modules/timer";
import { ActionContext, ActionController } from '../types';

const PORT = 1338;
const TARGET = 'http://127.0.0.1:1704';
let requestCount = 0;

const modules = [TimerModule, LoggerModule];

function consultModules(preRequest: boolean, req: http.IncomingMessage, res: http.ServerResponse, ctx: ActionContext){
    const control: ActionController = {
        stop: () => {},
        skipRequest: () => {}
    };

    let index = -1;

    function next(){
        while(index < modules.length){
            index++;
            const handler = preRequest ? modules[index]?.preRequest : modules[index]?.preResponse;
            if(handler){
                handler({ req, res, control, ctx, next });
                return;
            }
        }
    }

    next();

    return ctx;
}

const server = http.createServer((req, res) => {
    const requestId = requestCount++;

    let body: Uint8Array[] = [];

    req.on('data', (chunk: Uint8Array) => {
        body.push(chunk);
    }).on('end', () => {
        const bodyString = Buffer.concat(body).toString();

        let json;

        if(req.headers['content-type']?.slice(0, 16) === 'application/json') {
            try{
                json = JSON.parse(bodyString);
            } catch(e){

            }
        }

        const forwardCtx = consultModules(true, req, res, {
            requestId,
            requestBody: bodyString,
            responseBody: "",
            requestBodyJson: json,
            responseBodyJson: undefined
        });

        // Set up the options for the new request
        const options: http.RequestOptions = {
            hostname: new URL(TARGET).hostname,
            port: new URL(TARGET).port,
            path: req.url,
            method: req.method,
            headers: {
                ...req.headers,
                'content-length': bodyString.length
            }
        };

        // Forward the modified request
        const proxyReq = http.request(options, (proxyRes) => {
            const responseBody: Uint8Array[] = [];

            proxyRes.on('data', (chunk: Uint8Array) => {
                responseBody.push(chunk);
            });

            proxyRes.on('end', () => {
                const responseBodyString = Buffer.concat(responseBody).toString();

                let json;

                if(proxyRes.headers['content-type']?.slice(0, 16) === 'application/json') {
                    try{
                        json = JSON.parse(responseBodyString);
                    } catch(e){

                    }
                }

                forwardCtx.responseBody = responseBodyString;
                forwardCtx.responseBodyJson = json;

                consultModules(false, proxyRes, res, forwardCtx);

                res.writeHead(proxyRes.statusCode!, proxyRes.headers);

                res.end(responseBodyString);
            });
        });

        proxyReq.on('error', (e) => {
            console.error(`[${requestId}] Problem with request: ${e.message}`);
            res.writeHead(500);
            res.end(`Proxy error: ${e.message}`);
        });

        proxyReq.write(bodyString);
        proxyReq.end();
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Forwarding requests to ${TARGET}`);
    console.log("Enabled modules:");
    modules.forEach(m => console.log(` - ${m.name}`));
    console.log("");
});
