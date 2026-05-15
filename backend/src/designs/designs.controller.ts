import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DesignsService } from './designs.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';

@ApiTags('designs')
@Controller('designs')
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  /** Public: returns a single design if isPublic=true — no JWT required */
  @Get('share/:id')
  findShared(@Param('id') id: string) {
    return this.designsService.findPublicById(id);
  }

  /** Public: list all public designs */
  @Get('public')
  findPublic() {
    return this.designsService.findPublic();
  }

  // ── Protected routes below ──────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() dto: CreateDesignDto) {
    return this.designsService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  findAll(@Request() req) {
    return this.designsService.findAllByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.designsService.findOne(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() dto: UpdateDesignDto) {
    return this.designsService.update(id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/thumbnail')
  uploadThumbnail(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { thumbnail: string },
  ) {
    return this.designsService.updateThumbnail(id, req.user.id, body.thumbnail);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.designsService.remove(id, req.user.id);
  }
}
