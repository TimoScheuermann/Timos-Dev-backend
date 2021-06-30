import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VMComponent, VMComponentSchema } from './schemas/VMComponent.schema';
import { VuementController } from './vuement.controller';
import { VuementService } from './vuement.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VMComponent.name, schema: VMComponentSchema },
    ]),
  ],
  controllers: [VuementController],
  providers: [VuementService],
})
export class VuementModule {}
