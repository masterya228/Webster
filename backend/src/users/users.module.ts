import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Design } from '../designs/entities/design.entity';
import { Template } from '../templates/entities/template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Design, Template])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
