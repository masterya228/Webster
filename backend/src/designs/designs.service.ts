import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Design } from './entities/design.entity';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';

@Injectable()
export class DesignsService {
  constructor(
    @InjectRepository(Design)
    private designsRepository: Repository<Design>,
  ) {}

  async create(userId: string, dto: CreateDesignDto): Promise<Design> {
    const design = this.designsRepository.create({ ...dto, userId });
    return this.designsRepository.save(design);
  }

  async findAllByUser(userId: string): Promise<Design[]> {
    return this.designsRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Design> {
    const design = await this.designsRepository.findOne({ where: { id } });
    if (!design) throw new NotFoundException('Design not found');
    if (design.userId !== userId && !design.isPublic)
      throw new ForbiddenException('Access denied');
    return design;
  }

  async update(id: string, userId: string, dto: UpdateDesignDto): Promise<Design> {
    const design = await this.designsRepository.findOne({ where: { id } });
    if (!design) throw new NotFoundException('Design not found');
    if (design.userId !== userId) throw new ForbiddenException('Access denied');
    Object.assign(design, dto);
    return this.designsRepository.save(design);
  }

  async updateThumbnail(id: string, userId: string, thumbnailPath: string): Promise<Design> {
    const design = await this.designsRepository.findOne({ where: { id } });
    if (!design) throw new NotFoundException('Design not found');
    if (design.userId !== userId) throw new ForbiddenException('Access denied');
    design.thumbnail = thumbnailPath;
    return this.designsRepository.save(design);
  }

  async remove(id: string, userId: string): Promise<void> {
    const design = await this.designsRepository.findOne({ where: { id } });
    if (!design) throw new NotFoundException('Design not found');
    if (design.userId !== userId) throw new ForbiddenException('Access denied');
    await this.designsRepository.remove(design);
  }

  async findPublic(): Promise<Design[]> {
    return this.designsRepository.find({
      where: { isPublic: true },
      order: { updatedAt: 'DESC' },
      take: 50,
    });
  }

  /** Returns a single public design without ownership check (for share pages) */
  async findPublicById(id: string): Promise<Design> {
    const design = await this.designsRepository.findOne({ where: { id, isPublic: true } });
    if (!design) throw new NotFoundException('Design not found or not public');
    return design;
  }
}
