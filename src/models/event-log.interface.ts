/**
 * @project MW300
 * @name event-log.interface
 * @author Pawan Pawar
 * @date 25/8/18 - 11:17 AM
 * @description
 *
 */

export interface EventLog {
    ip: string; // device
    mac: string; // device
    device_id: string; // token
    channel: string; // ''
    device: string; // MW300
    sensor: string; // LED
    datatype: string; // string
    channelAddress: string; // -1
    value: string; // LED-ON/LED-OFF
    event_time: string; // timestamp
    device_type: string; // MW300
    currentHash?: string;
    previousHash?: string;
}

export const emptyEventLog: EventLog = {
    ip: '',
    mac: '',
    device_id: '',
    channel: '',
    device: '',
    sensor: '',
    channelAddress: '',
    datatype: '',
    value: '',
    event_time: '',
    device_type: '',
};
