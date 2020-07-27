import { Module } from '@nestjs/common';
import { SocketService } from './socket/socket.service';
import { InitializeService } from './initialize/initialize.service';
import { ProcesMessageService } from './proces-message/proces-message.service';
import { Msgpack5Service } from './msgpack5/msgpack5.service';

@Module({
  providers: [SocketService, InitializeService, ProcesMessageService, Msgpack5Service],
  exports: [SocketService, InitializeService]
})
export class SimulatorModule {}
