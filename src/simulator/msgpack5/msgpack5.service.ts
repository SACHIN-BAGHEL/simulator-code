import { Injectable } from '@nestjs/common';
const msgpack = require("msgpack5")()


@Injectable()
export class Msgpack5Service {
//jsonObj = { 'hello': 'world' };

    msgPkEncode(jsonObj) {
        //console.log(msgpack.encode(jsonObj));
        return msgpack.encode(jsonObj);
    }

    msgPkDecode(encodedObject) {
        //console.log(msgpack.msgPkDecode(encodedObject));
        return msgpack.decode(encodedObject);
    }
}
