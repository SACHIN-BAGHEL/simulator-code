/**
 * @project MW300
 * @name request.interface
 * @author Pawan Pawar
 * @date 23/8/18 - 1:53 PM
 * @description
 *
 */

/* Assembled a Sync-Envelope Packet*/

export interface PayloadDeviceInfo {
    mfg_id: string;
    endpointName: string;
    mac: string;
    comm_link: string;
    fw_version: string;
}

export const emptyPayloadDeviceInfo: PayloadDeviceInfo = {
    mfg_id: '',
    endpointName: '',
    mac: '',
    comm_link: '',
    fw_version: ''
};

/**
 *
 */
export interface RequestResponsePacket {
    startByte: number;      // FA/250 start byte of the packet
    syncByte: number;       // 11 (Not clear)
    index: number;          // packet index
    msgType: MessageType;   // message type
    timestamp: number;      // time of the packet generated
    token: string;          // token of the device
    previousHash: string;   // previous hash of the chain
    currentHash: string;    // current hash of the chain
    payload: string;        // payload of the packet
    ip?: string;
    mac?: string;
    status?: string;
}

/**
 DISCOVER,              0
 WAIT_FOR_DISCOVER,     1
 REGISTER,              2
 WAIT_FOR_REGISTER,     3
 ACTIVATE,              4
 WAIT_FOR_ACITVATION,   5
 SEND_DATA,             6
 WAIT_ACK,              7
 SEND_MFG_AUTH,         8
 WAIT_FOR_AUTH,         9
 ENDPOINT_STATUS,       10
 ENDPOINT_ON,           11
 ENDPOINT_OFF,          12
 RETRY                  13
 */
export enum MessageType {
    DISCOVERY = 0,              // Message from device to discover the APP.
    WAIT_FOR_DISCOVER = 1,      // Not used by APP.
    REGISTER = 2,               // Device discover the APP and sent registration packet.
    WAIT_FOR_REGISTER = 3,      // Not used by APP.
    ACTIVATE = 4,               // Device is register and now ready to send chain data and payload.
    WAIT_FOR_ACTIVATION = 5,    // Not used by APP.
    SEND_DATA = 6,              // Chain data.
    WAIT_ACK = 7,               // Not used by APP.
    SEND_MFG_AUTH = 8,          // Not used by APP.
    WAIT_FOR_AUTH = 9,          // Not used by APP.
    ENDPOINT_STATUS = 10,       // Get the current status of LED device.
    ENDPOINT_ON = 11,           // Send ON command to LED device.
    ENDPOINT_OFF = 12,          // Send OFF command to LED device.
    RETRY = 13,                 // Not used by APP.
}

/**
 15,11,0,8,1536207532,
 token           0c8f52f08099b7207ad47d87d324decf54e677a85418084d39fe61e496b54dd1,
 prevHash        6DDA3025F39207FCF22E8F91A84A7047E6582F2ED43D3D0D073F1F31BEE11867,
 currentHash     5930761863F9D5989D4120D03A0557944C38FA8FB9E57FC63220A4938B07BF79,
 payload         9813D1EDE7221BE02206C50974A875046A77E093EA09E10536FF509FBED846B3
 */
export const lastPacket: any = {};

export const emptyRequestResponsePacket: RequestResponsePacket = {
    startByte: -1,
    syncByte: -1,
    index: -1,
    msgType: 0,
    timestamp: 0,
    token: '',
    previousHash: '',
    currentHash: '',
    payload: '',
    status: 'LED-ON'
};

/**
 *
 * @param {RequestResponsePacket} packet
 * @returns {string}
 */
export function toString(packet: RequestResponsePacket): string {
    return packet.startByte + ',' +
        packet.syncByte + ',' +
        packet.index + ',' +
        packet.msgType + ',' +
        packet.timestamp + ',' +
        packet.token + ',' +
        packet.previousHash + ',' +
        packet.currentHash + ',' +
        packet.payload;
}
