/**
 * @project MW300
 * @name scan.interface
 * @author Pawan Pawar
 * @date 25/8/18 - 11:13 AM
 * @description
 *
 */

/**
 *
 * @type {{ip: string; mac: string; vendor: string; timestamp: number; device_id: string}}
 */
export interface ArpScanResult {
    ip: string;
    mac: string;
    vendor: string;
    timestamp: number;
    device_id?: string;
}

export const emptyArpScanResult: ArpScanResult = {
    ip: '', mac: '', vendor: '', timestamp: -1, device_id: ''
};

/**
 *
 * @type {{device_id: string; ip: string; mac: string; serialNumber: string; hostName: string;
 *        manufacturer: string; productId: string; zone: string; model_name: string;
 *        fwVersion: string; sensors: any[]; device_type: string; comName: string}}
 */

export interface Sensor {
    device_id?: string;
    sensorType?: string;
    channelType?: string;
    channelAddress?: string;
    channel?: string;
    device?: string;
    datatype?: string;
    device_type?: string;
}

export interface ScanDeviceInfo {
    device_id?: string;
    ip?: string;
    mac?: string;
    serialNumber?: string;
    hostName?: string;
    manufacturer?: string;
    productId?: string;
    zone?: string;
    model_name?: string;
    fwVersion?: string;
    sensors: Sensor[];
    device_type?: string;
    comName?: string;

    channelAddress?: string;
}

export const emptyScanDeviceInfo: ScanDeviceInfo = {sensors: []};
