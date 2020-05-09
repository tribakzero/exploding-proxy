const Proxy = require('http-mitm-proxy');
const proxy = Proxy();

proxy
  .use(Proxy.gunzip)
  .onError((context, error) => console.log(`Proxy error: ${error}`))
  .onRequest((context, callback) => {
    if(
      context.clientToProxyRequest.headers.host === 'explodingkittens.com'
      && context.clientToProxyRequest.url.indexOf('/avatarcheck.php') === 0
    ) {

      context.onResponseData((context, chunk, callback) => {
        console.log(context.proxyToClientResponse);
        context.proxyToClientResponse.writeHead(200);
        context.proxyToClientResponse.end('true');
        return;
      });
    }
    return callback();
  })
  .listen({port: 3333}, () => console.log(`Listening on port: ${proxy.httpPort}`));
