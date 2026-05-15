import { Controller, Get, Post, Delete, Param, Query, UseGuards, Request, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TemplatesService } from './templates.service';
import { CreateUserTemplateDto } from './dto/create-user-template.dto';

@ApiTags('templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  findAll(@Query('category') category: string, @Request() req) {
    if (category) return this.templatesService.findByCategory(category, req.user.id);
    return this.templatesService.findAll(req.user.id);
  }

  @Get('mine')
  findMine(@Request() req) {
    return this.templatesService.findUserTemplates(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Post()
  create(@Request() req, @Body() dto: CreateUserTemplateDto) {
    return this.templatesService.createUserTemplate(req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.templatesService.deleteUserTemplate(id, req.user.id);
  }
}
