import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignsService } from './designs.service';
import { DesignsController } from './designs.controller';
import { Design } from './entities/design.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Design])],
  providers: [DesignsService],
  controllers: [DesignsController],
})
export class DesignsModule {}
