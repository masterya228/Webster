import {
  Controller, Get, UseGuards, Request,
  Patch, Body, Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  async updateMe(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Patch('avatar')
  async uploadAvatar(@Request() req, @Body() body: { avatar: string }) {
    return this.usersService.updateAvatar(req.user.id, body.avatar);
  }

  @Delete('avatar')
  async removeAvatar(@Request() req) {
    return this.usersService.removeAvatar(req.user.id);
  }
}
