import { Injectable } from '@nestjs/common';
import { emptyEventLog, emptyRequestResponsePacket, lastPacket, MessageType, RequestResponsePacket, toString, EventLog, ScanDeviceInfo } from '../../models';
import { EdgeDeviceInfo } from '../../models/edgeDevice.interface';
import { Socket } from 'dgram';
import { GLOBAL_BLK_LK } from 'src/config/blockLockConfig';
const request = require('request');


@Injectable()
export class ProcesMessageService {
    deviceInfo: ScanDeviceInfo[] = [];
    eventLog: EventLog = emptyEventLog;
    //edgeDevice: EdgeDevices = new EdgeDevices();
    devices = 0;

    constructor() {
        this.eventLog.channelAddress = '-1';
        this.eventLog.datatype = 'string';
        this.eventLog.device = 'Relay-MW300';
        this.eventLog.device_type = 'Relay-MW300';
        this.eventLog.event_time = this.getTime();
        this.eventLog.sensor = 'LED';
        this.eventLog.value = '';
    }

    getTime(): string {
        const current_time = new Date();
        current_time.setSeconds(current_time.getSeconds() + 2);
        return current_time.getFullYear() + '-' + (current_time.getMonth() + 1)
            + '-' + current_time.getDate() + ' ' + current_time.getHours()
            + ':' + current_time.getMinutes() + ':' + current_time.getSeconds();
    }

    checkMessageType(message: string, rinfo: any, callback: Function) {
        const packet = this.readMessage(message);
        console.log('packet in checkMessageType ==== ',packet);

        let response = toString(packet);
        this.eventLog.ip = rinfo.address;
        this.eventLog.device_id = packet.token;

        switch (packet.msgType) {
            case MessageType.DISCOVERY:
                    packet.payload = 'accept';
                    packet.timestamp = (new Date().getTime()) / 1000;
                    response = toString(packet);
                    callback(response);
                break;
            // case MessageType.DISCOVERY:
            //     this.checkTokenInEdgeDevice(packet.token, (fond: boolean | null) => {
            //         if (fond) {
            //             packet.payload = 'valid-token';
            //         } else if (null === fond) {
            //             packet.payload = 'invalid-token';
            //         } else {
            //             packet.payload = 'accept';
            //         }
            //         packet.timestamp = (new Date().getTime()) / 1000;
            //         response = toString(packet);
            //         callback(response);
            //     });
            //     break;
            // case MessageType.SEND_MFG_AUTH:
            //     this.edgeDevice.checkAuthInEdgeDevice(packet.payload, (fond: boolean | null) => {
            //         if (fond) {
            //             packet.payload = 'Authenticate';
            //         } else {
            //             packet.payload = 'Non-Auth';
            //         }
            //         packet.timestamp = (new Date().getTime()) / 1000;
            //         response = toString(packet);
            //         callback(response);
            //     });
            //     break;
            // case MessageType.REGISTER:
            //     this.updateDeviceInfo(Object.assign({}, packet), rinfo.address);
            //     packet.timestamp = (new Date().getTime()) / 1000;
            //     packet.payload = 'register-token';
            //     response = toString(packet);
            //     callback(response);
            //     lastPacket[packet.token] = {...{}, ...packet};
            //     break;
            // case MessageType.ACTIVATE:
            //     // included genesis block
            //     packet.timestamp = (new Date().getTime()) / 1000;
            //     packet.payload = 'activate-token';
            //     response = toString(packet);
            //     callback(response);
            //     lastPacket[packet.token] = {...{status: 'LED-ON'}, ...packet};
            //     break;
            // case MessageType.SEND_DATA:
            //     this.sendEventLog(packet);
            //     if (this.checkInChainCode(packet)) {
            //         response = 'verified';
            //         lastPacket[packet.token] = {...{}, ...packet};
            //     } else {
            //         response = 'valid-token';
            //     }
            //     callback(response);
            //     break;
        }
    }

    readMessage(message: string): RequestResponsePacket {
        const packet: RequestResponsePacket = emptyRequestResponsePacket;
        const _message = message.split(',');
        packet.startByte = parseInt(_message[0], 10);
        packet.syncByte = parseInt(_message[1], 10);
        packet.index = parseInt(_message[2], 10);
        packet.msgType = parseInt(_message[3], 10);
        packet.timestamp = parseInt(_message[4], 10);
        packet.token = _message[5];
        packet.previousHash = _message[6];
        packet.currentHash = _message[7];
        packet.payload = _message[8];
        return packet;
    }

    processMessage(message: string, rinfo: any, socket: Socket) {
        console.log('rinfo in processMessage ==== ',rinfo);
        if (message.charAt(0) == '1') {
            console.log('BrodCast Response', rinfo);
        } else {
            this.checkMessageType(message, rinfo, (resString: string) => {
                console.info('Response to Device: ', resString);
                socket.send(resString, rinfo);
            });
        }

    }

    checkInChainCode(packet: RequestResponsePacket): boolean {
        const _lastPacket: RequestResponsePacket = lastPacket[packet.token];
        if (!_lastPacket) {
            return true;
        }
        if (_lastPacket.currentHash === packet.previousHash) {
            return true;
        } else {
            return false;
        }
    }

    sendEventLog(log: RequestResponsePacket) {
        const newLog: EventLog = Object.assign({}, this.eventLog);
        newLog.event_time = this.getTime();
        newLog.value = log.payload;
        newLog.currentHash = log.currentHash;
        newLog.previousHash = log.previousHash;
        // logger.error(newLog);
        //this.edgeDevice.sendEventLogToEdgeDevice(newLog);
    }

    updateDeviceInfo(info: RequestResponsePacket, ip: string) {
        const infoPay = info.payload.split('#');
        // const endpointName = infoPay[1];
        // device Info
        this.deviceInfo[this.devices] = {sensors: []};
        infoPay[2] = this.getMac(infoPay[2]);
        this.deviceInfo[this.devices].ip = ip;
        this.deviceInfo[this.devices].hostName = ip;
        this.deviceInfo[this.devices].device_id = info.token;
        this.deviceInfo[this.devices].fwVersion = infoPay[4];
        this.deviceInfo[this.devices].serialNumber = infoPay[0];
        this.deviceInfo[this.devices].productId = infoPay[0];
        this.deviceInfo[this.devices].manufacturer = infoPay[1];
        this.deviceInfo[this.devices].mac = infoPay[2];
        this.deviceInfo[this.devices].comName = infoPay[3];
        this.deviceInfo[this.devices].sensors = [{
            device_id: info.token,
            sensorType: 'LED',
            channelType: 'MW300',
            channelAddress: '-1'
        }];
        this.deviceInfo[this.devices].model_name = 'Marvel';
        this.deviceInfo[this.devices].device_type = 'Relay-MW300';
        this.deviceInfo[this.devices].zone = 'Zone-MW300';
        //logger.error(this.devices, JSON.stringify(this.deviceInfo[this.devices]));
        this.devices++;
        // Update Event log Object
    }

    getMac(mac: string): string {
        let macc = '';
        for (let i = 1; i < mac.length; i++) {
            macc += mac[i];
            if (i % 2 === 0 && mac.length - 1 > i) {
                macc += ':';
            }
        }
        return macc;
    }

    httpRequest(url: string, params: any, callback: Function) {
        try {
            request.post({url: url, form: params}, (err: any, response: any, body: any) => {
                if (err) {
                    console.error(err);
                    callback(null);
                } else {
                    console.info('Response:', JSON.stringify(body));
                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        console.log(e);
                        body = null;
                    }
                    if (body && body.data !== undefined) {
                        callback(!!body.data);
                    } else {
                        callback(null);
                    }
                }
            });
        } catch (e) {
            console.error(e);
            callback(null);
        }
    }

    checkTokenInEdgeDevice(token: string, callback: Function) {
        const edgeDeviceport = GLOBAL_BLK_LK.edgeDevicePort;
        const edgeDevice = GLOBAL_BLK_LK.edgeDeviceIp;
        if (edgeDevice) {
            const url = 'http://' + edgeDevice + ':' + edgeDeviceport + '/device/track/' + token;
            console.info('url', url);
            this.httpRequest(url, {}, (fnd: boolean | null) => {
                callback(fnd);
            });
        } else {
            callback(null);
        }
    }

}
