import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Design } from '../designs/entities/design.entity';
import { Template } from '../templates/entities/template.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)    private usersRepo: Repository<User>,
    @InjectRepository(Design)  private designsRepo: Repository<Design>,
    @InjectRepository(Template) private templatesRepo: Repository<Template>,
  ) {}

  findAllUsers(): Promise<User[]> {
    return this.usersRepo.find({ order: { createdAt: 'DESC' } });
  }

  async updateUser(id: string, dto: { name?: string; email?: string; role?: 'user' | 'admin' }): Promise<User> {
    await this.usersRepo.update(id, dto);
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.templatesRepo.delete({ userId: id });
    await this.designsRepo.delete({ userId: id });
    await this.usersRepo.delete(id);
  }

  findAllDesigns(): Promise<Design[]> {
    return this.designsRepo.find({
      order: { updatedAt: 'DESC' },
      relations: ['user'],
      select: {
        id: true, title: true, width: true, height: true,
        isPublic: true, userId: true, createdAt: true, updatedAt: true, thumbnail: true,
        user: { id: true, name: true, email: true } as any,
      },
    });
  }

  async deleteDesign(id: string): Promise<void> {
    await this.designsRepo.delete(id);
  }

  findAllTemplates(): Promise<Template[]> {
    return this.templatesRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async deleteTemplate(id: string): Promise<void> {
    await this.templatesRepo.delete(id);
  }
}
