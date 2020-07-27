import { Injectable } from '@nestjs/common';
import { SocketService } from '../socket/socket.service';
import { GLOBAL_BLK_LK } from 'src/config/blockLockConfig';
import { ProcesMessageService } from '../proces-message/proces-message.service';
import { Msgpack5Service } from '../msgpack5/msgpack5.service';
const file = require('fs');
const crypto = require("crypto");


@Injectable()
export class InitializeService {
    
    p2p_port = process.env.dc_port || GLOBAL_BLK_LK.dc_port;
    simulatorData_Object = {};
    msgType = {
        0 : 'DISCOVERY',              // Message from device to discover the APP.
        1 : 'WAIT_FOR_DISCOVER',      // Not used by APP.
        2 : 'REGISTER',               // Device discover the APP and sent registration packet.
        3 : 'WAIT_FOR_REGISTER',      // Not used by APP.
        4 : 'ACTIVATE',               // Device is register and now ready to send chain data and payload.
        5 : 'WAIT_FOR_ACTIVATION',    // Not used by APP.
        6 : 'SEND_DATA',              // Chain data.
        7 : 'WAIT_ACK',               // Not used by APP.
        8 : 'SEND_MFG_AUTH',          // Not used by APP.
        9 : 'WAIT_FOR_AUTH',          // Not used by APP.
        10 : 'ENDPOINT_STATUS',       // Get the current status of LED device.
        11 : 'ENDPOINT_ON',           // Send ON command to LED device.
        12 : 'ENDPOINT_OFF',          // Send OFF command to LED device.
        13 : 'RETRY' 
    };
    //For AES
    key = '85CE6CCF67FBBAA8BB13479C3A6E084D';
    algorithm = 'aes256';

    constructor(
        private readonly socket: SocketService,
        private readonly processDevicePacket: ProcesMessageService,
        private readonly msgpack5: Msgpack5Service
        //private readonly globalService: GlobalService,
        //private readonly CaService: CaServiceService
    ) {

    }

    onApplicationBootstrap() {
        // this.initializeSocket();
        // this.beachHead_Client();
        this.read_simulatorData();
    }

    private initializeSocket() {
        console.log('============== initializeSocket ============== ');
        this.socket.init("localhost", this.p2p_port, true);
        this.socket.connect((connect) => {
            connect.on('error', (err) => {
                console.assert(err, err);
            });
            connect.on('message', (msg, rinfo) => {
                //console.log('msg ============== ', msg.toString());
                msg = this.decryptAES(msg);
                console.log('AES decrypted message = ', msg);
                this.message_handler(msg, rinfo, connect, (resString) => {
                    this.sendMessage(resString, rinfo, connect);
                });
            });
            connect.on('listening', () => {
                console.log("BL socket service started.");
            });
        });
        //setInterval(() => this.beachHead_Client(), 3000);
    }

    /**
     * description: send response back to requested device.
     * @param resString
     * @param rinfo
     */
    sendMessage(message, rinfo, connect) {
        const reply = Buffer.from(message);
        connect.send(reply, 0, reply.length, rinfo.port, rinfo.address, (err, bytes) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Response to Device: ' + rinfo.address + ':' + rinfo.port, message);
            }
        });
    }

    message_handler(msg: any, rinfo, connect, cb) {
        this.processDevicePacket.processMessage(msg.toString('utf8'), rinfo, connect);
        //cb(msg);
    }

    beachHead_Client() {
        /** Blockchain frame
        frameInfo, msgId, deviceToken, previousHash, currentHash, payload, signature, crc
        */
        let packet_BH = '1,0,0c8f52f08099b7207ad47d87d324decf54e677a85418084d39fe61e496b54dd1,NULL,NULL,NULL,signature,CRC';
        //TODO: remove later
        packet_BH = this.encryptAES(packet_BH);
        console.log('AES encrypted message = ', packet_BH);

        //this.processMsg(packet_BH);
        this.socket.send(packet_BH, '0.0.0.0', this.p2p_port, false);
    }

    private processMsg(packet_BH: string) {
        let pckArr = packet_BH.split(',');
        console.log('pckArr--------- == ', pckArr);
        if (pckArr[0] == '1') {
            let p = this.simulatorData_Object['blockchainFrame'];
            console.log('jsonFileData == ', this.simulatorData_Object);

            if (Object.keys(p).length > 0) {
                //let blockchainFrame = Object.keys(p);
                //blockchainFrame.join(',');
                //console.log('blockchainFrame == ', p.frameInfo, p.msgId, p.deviceToken, p.previousHash, p.currentHash, p.payload, p.signature, p.crc);
            }
        }
    }

    bin2hex(b) {
        return b.match(/.{1,4}/g).reduce(function(acc, i) {
            return acc + parseInt(i, 2).toString(16);
        }, '')
    }

    public read_simulatorData() {
        let encodedVal = this.msgpack5.msgPkEncode('Hello');
        console.log('encodedVal ===== ', encodedVal);
        //let test = '9522c4106eac4d0b16e645088c4622e7451ea5a1ccef01c440c8f1c19fb64ca6ecd68a336bbffb39e8f4e6ee686de725ce9e23f76945fc2d734b4e77f9f02cb0bb2d4f8f8e361efc5ea10033bdc741a24cff4d7eb08db6340b';

        //parseInt(test, 2).toString(16);

        //var bindata = data.toString('binary');
        var hexdata1 = new Buffer('0100100001100101011011000110110001101111', 'ascii').toString('hex');
        console.log('hexdata1 == ', hexdata1);
        let test = 'Hello';
        let binaryData = '0100100001100101011011000110110001101111';
        var hexdata = this.bin2hex(binaryData);
        console.log('hexdata ===== ', hexdata);
        let decodedVal = this.msgpack5.msgPkDecode(hexdata);
        //console.log('type of ===== ', typeof decodedVal);
        console.log('decodedVal ===== ', decodedVal);
        

        this.simulatorData_Object = {};
        file.readFile("simulatorData.json", "UTF-8", (error, simulatorData) => {
            if (error) {
                console.log('Error in reading simulatorData JOSN file ' + error);
            } else {
                this.simulatorData_Object = JSON.parse(simulatorData);
                this.initializeSocket();
                this.beachHead_Client();

                //update AES param
                this.algorithm = this.simulatorData_Object['AES'].algorithm;
                //this.key = this.simulatorData_Object['AES'].key;
                //console.log('data ========== ', f);
            }
        });
    }


    encryptAES(data) {
        var cipher = crypto.createCipher(this.algorithm, this.key);
        var crypted = cipher.update(data, 'utf-8', 'hex');
        crypted += cipher.final('hex');
        //console.log('AES encrypted message = ', crypted);
        //this.decryptAES(crypted);
        return crypted;
    }

    decryptAES(data) {
        var decipher = crypto.createDecipher(this.algorithm, this.key);
        //decipher.setAutoPadding(false);
        var decrypted = decipher.update(data.toString(), 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        //console.log('AES decrypted message = ', decrypted);
        return decrypted;
    }
}
