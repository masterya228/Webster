import { Injectable, OnModuleInit, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Template } from './entities/template.entity';
import { CreateUserTemplateDto } from './dto/create-user-template.dto';

const SEED_TEMPLATES = [
  { name: 'Instagram Post',      category: 'social',        width: 1080, height: 1080, thumbnail: null, canvasData: { background: '#ffffff', objects: [] } },
  { name: 'Instagram Story',     category: 'social',        width: 1080, height: 1920, thumbnail: null, canvasData: { background: '#000000', objects: [] } },
  { name: 'Facebook Cover',      category: 'social',        width: 851,  height: 315,  thumbnail: null, canvasData: { background: '#3b5998', objects: [] } },
  { name: 'Twitter Banner',      category: 'social',        width: 1500, height: 500,  thumbnail: null, canvasData: { background: '#1da1f2', objects: [] } },
  { name: 'YouTube Thumbnail',   category: 'social',        width: 1280, height: 720,  thumbnail: null, canvasData: { background: '#ff0000', objects: [] } },
  { name: 'Business Card',       category: 'print',         width: 1050, height: 600,  thumbnail: null, canvasData: { background: '#ffffff', objects: [] } },
  { name: 'A4 Poster',           category: 'print',         width: 794,  height: 1123, thumbnail: null, canvasData: { background: '#ffffff', objects: [] } },
  { name: 'Birthday Card',       category: 'occasion',      width: 800,  height: 600,  thumbnail: null, canvasData: { background: '#ffd700', objects: [] } },
  { name: 'Event Invitation',    category: 'occasion',      width: 800,  height: 800,  thumbnail: null, canvasData: { background: '#f5f5f5', objects: [] } },
  { name: 'Presentation Slide',  category: 'presentation',  width: 1280, height: 720,  thumbnail: null, canvasData: { background: '#2d2d2d', objects: [] } },
];

@Injectable()
export class TemplatesService implements OnModuleInit {
  constructor(
    @InjectRepository(Template)
    private templatesRepository: Repository<Template>,
  ) {}

  async onModuleInit() {
    const count = await this.templatesRepository.count({ where: { userId: IsNull() } });
    if (count === 0) {
      await this.templatesRepository.save(SEED_TEMPLATES);
    }
  }

  /** System templates (userId IS NULL) only — user templates fetched separately */
  async findAll(userId?: string): Promise<Template[]> {
    return this.templatesRepository.find({
      where: { userId: IsNull() },
      order: { createdAt: 'ASC' },
    });
  }

  async findByCategory(category: string, userId?: string): Promise<Template[]> {
    return this.templatesRepository.find({ where: { category, userId: IsNull() } });
  }

  /** Only user's own templates */
  async findUserTemplates(userId: string): Promise<Template[]> {
    return this.templatesRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Template> {
    return this.templatesRepository.findOneOrFail({ where: { id } });
  }

  async createUserTemplate(userId: string, dto: CreateUserTemplateDto): Promise<Template> {
    const tpl = this.templatesRepository.create({
      name: dto.name,
      category: dto.category || 'my-templates',
      width: dto.width,
      height: dto.height,
      canvasData: dto.canvasData,
      thumbnail: dto.thumbnail || null,
      userId,
    });
    return this.templatesRepository.save(tpl);
  }

  async deleteUserTemplate(id: string, userId: string): Promise<void> {
    const tpl = await this.templatesRepository.findOne({ where: { id } });
    if (!tpl) throw new NotFoundException('Template not found');
    if (!tpl.userId) throw new ForbiddenException('Cannot delete system templates');
    if (tpl.userId !== userId) throw new ForbiddenException('Not your template');
    await this.templatesRepository.remove(tpl);
  }
}
