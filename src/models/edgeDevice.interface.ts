/**
 * @project MW300
 * @name edgeDevice.interface
 * @author Pawan Pawar
 * @date 27/8/18 - 6:56 PM
 * @description
 *
 */

export interface EdgeDeviceInfo {
    ip: string;
    mac: string;
    vendor: string;
    timestamp: number;
    device_id: string;
}

export const emptyEdgeDevice: EdgeDeviceInfo = {
    ip: '',
    mac: '',
    vendor: '',
    timestamp: 0,
    device_id: ''
};
