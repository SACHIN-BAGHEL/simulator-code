import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SimulatorModule } from './simulator/simulator.module';
import { ProcesMessageService } from './simulator/proces-message/proces-message.service';

@Module({
  imports: [SimulatorModule],
  controllers: [AppController],
  providers: [AppService, ProcesMessageService],
})
export class AppModule {}
