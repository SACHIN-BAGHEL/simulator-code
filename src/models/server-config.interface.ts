/**
 * @project MW300
 * @name server-config.interface
 * @author Pawan Pawar
 * @date 23/8/18 - 1:36 PM
 * @description
 *
 */
export interface ServerConfig {
    hostname: string;
    port: number;
    mac: string;
    edgeDevicePort: number;
    eventLogPort: number;
    mw300CommandPort: number;
}
