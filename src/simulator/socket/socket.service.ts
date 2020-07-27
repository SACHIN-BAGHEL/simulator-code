import { Injectable } from '@nestjs/common';
const datagram = require('dgram');

@Injectable()
export class SocketService {
    address: any;
    port: any;
    bind: any;
    connection: any;

    constructor() {
        
    }

    init(address, port, bind) {
        this.address = address || "localhost";
        this.port = port || null;
        this.bind = bind || false;
    }

    connect(callback) {
        let self = this;
        // this.connection = datagram.createSocket('udp4');
        this.connection = datagram.createSocket({ type: 'udp4', reuseAddr: true });
        console.log(self.address);
        console.log(self.port);
        if (this.bind)
            this.connection.bind(this.port)

        this.connection.on('listening', function () {
            const address = self.connection.address();
            console.log(`server listening on ${address.address}:${address.port}`);
            callback(self.connection);
        });
    }

    send(message, address, port, broadcast) {
        if (typeof message == "string")
            //message = new Buffer(message);
            message = Buffer.from(message, 'utf8');

        broadcast = broadcast || false;

        if (broadcast)
            this.connection.setBroadcast(broadcast);
        this.connection.send(message, 0, message.length, port, address, function (err, bytes) {
            if (err) console.log(err);
            else console.log('Socket: UDP message sent to ' + address + ':' + port);
        });
    }

    close() {
        this.connection.close();
    }
}
