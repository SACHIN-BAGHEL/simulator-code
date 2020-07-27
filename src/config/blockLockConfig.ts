export const GLOBAL_BLK_LK = {
    CONST_MAX_MINI_BLOCK_PER_CHAIN: 10,
    CONST_MAX_EVENT_PER_MINI_BLOCK: 1,
    BROADCAST_VIA: "SOCKET", // USE 'SOCKET' OR 'API'
    USE_DB: true, // true OR false
    USE_GLOBAL_LEDGER: false, // true OR false
    // GLOBAL_LEDGER_HOSTNAME: '66.128.159.253',
    // GLOBAL_LEDGER_PORT: 8086,
    // GLOBAL_LEDGER_HOSTNAME: '192.168.29.44',
    GLOBAL_LEDGER_HOSTNAME: '76.80.1.34',
    GLOBAL_LEDGER_PORT: 8092,
    GLOBAL_LEDGER_PATH: "/datareceiver/",
    HOSTNAME: 'localhost',
    PORT: 8082,
    PATH: '/rest/api/send',
    GROUP_KEY_AUTH: false,
    CA_SERVICE_IP: "66.128.159.253",
    CA_SERVICE_PORT: "8082",
    DEVICE_TYPE: {
        MW300: 'mw300'
    },
    // type 'mongo' for MongoDB
    // type 'informix' for InformixDB
    // type 'postgresql' for Postgresql
    DB_TYPE: "mongo",
    FILTER_INTERFACE: "eth0", // wlan0 OR eth0 OR br-lan
    // currently syncing with only these tables : "users", "accesslevels", "accesspermissions", "datasync", "device", "notification", "sensor", "user_groups", "groups", "levels".
    SKIP_SYNC_MODELS: ["alerts", "userslog", "events", "masterblocks", "networkscan"],
    USE_DATASYNC: true,
    EVENT_LIMIT: 50,
    getAdapter(type) {
        switch (type) {
            case 'mongo':
                return 'MongoBlockchaindb';
            case 'informix':
                return 'InformixBlockchaindb';
            case 'postgresql':
                return 'PostgresBlockchaindb';
        }
    },
    MW300_LASTPACKETS_FILE_PATH: __dirname + '/../logs/mw300Log.json',
    dc_port:7085,
    edgeDevicePort: 7080,
    edgeDeviceIp: '10.4.1.6'

}