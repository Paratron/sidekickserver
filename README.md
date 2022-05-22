# Sidekick Server

> Heads up, this project is in a very early development phase

Debug, track, intercept and change your apps API requests on the fly

Sidekick Server can be installed into your application directory and works as a development and debugging tool for your
web applications API. 

It captures HTTP/s requests locally and forwards them to your real API. Every request and every response will be passed
to a middleware chain where you can track, debug, intercept and change everything at your wish.

Use cases are plenty:
- Simulate "bad responses", eg. status 404, 500
- Simulate missing data fields
- Work with future data structure before it is even implemented in the API
