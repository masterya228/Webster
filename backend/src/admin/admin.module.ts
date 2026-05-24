import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User }     from '../users/entities/user.entity';
import { Design }   from '../designs/entities/design.entity';
import { Template } from '../templates/entities/template.entity';
import { AdminService }    from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Design, Template])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
