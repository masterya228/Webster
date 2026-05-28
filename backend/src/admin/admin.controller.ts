import {
  Controller, Get, Patch, Delete, Param, Body,
  UseGuards, Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard }   from '../auth/guards/admin.guard';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers() { return this.adminService.findAllUsers(); }

  @Patch('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; role?: 'user' | 'admin' },
    @Request() req,
  ) {
    if (id === req.user.id && body.role && body.role !== 'admin') {
      body.role = 'admin';
    }
    return this.adminService.updateUser(id, body);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string, @Request() req) {
    if (id === req.user.id) return { error: 'Cannot delete yourself' };
    return this.adminService.deleteUser(id).then(() => ({ success: true }));
  }

  @Get('designs')
  getDesigns() { return this.adminService.findAllDesigns(); }

  @Delete('designs/:id')
  deleteDesign(@Param('id') id: string) {
    return this.adminService.deleteDesign(id).then(() => ({ success: true }));
  }

  @Get('templates')
  getTemplates() { return this.adminService.findAllTemplates(); }

  @Delete('templates/:id')
  deleteTemplate(@Param('id') id: string) {
    return this.adminService.deleteTemplate(id).then(() => ({ success: true }));
  }
}
