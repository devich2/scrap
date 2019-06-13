'use strict';

const http = require('http');
const net = require('net');
const url = require('url');


const server = http.createServer((clientRequest, clientResponse) =>{

    const proxy = http.request(
        clientRequest.url,
        {
            headers: clientRequest.headers,
            method: clientRequest.method
        }
    );

    
    proxy.on('response', (serverResponse) =>{
        clientResponse.writeHead(
            serverResponse.statusCode,
            serverResponse.headers
        );
        serverResponse.pipe(clientResponse, {end: true});
    });

    clientRequest.pipe(proxy, {end:true});

});


server.on('connect', (request, socket) =>{
    //parse URL
    const reqUrl = url.parse(`https://${request.url}`);

    const srvSocket = net.connect(reqUrl.port, reqUrl.hostname, () => {
        // tell the client that the connection is established
        socket.write('HTTP/' + request.httpVersion + ' 200 OK\r\n\r\n', 'UTF-8', () => {
            //error handling
            srvSocket.on('error', (err) => {
                console.log('Error' + err.message);
            });

            // creating pipes in both ends
            srvSocket.pipe(socket);
            socket.pipe(srvSocket);
        });

        //error handling
        socket.on('error', (err) => {
            console.log('Error' + err.message);
        });
    });
});

server.listen(8000);