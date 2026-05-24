import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { User } from './entities/user.entity';
import { Design } from '../designs/entities/design.entity';
import { Template } from '../templates/entities/template.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Design)
    private designsRepository: Repository<Design>,
    @InjectRepository(Template)
    private templatesRepository: Repository<Template>,
  ) {}

  generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  async create(email: string, name: string, password: string): Promise<User> {
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = this.generateToken();
    const user = this.usersRepository.create({
      email, name,
      password: hashed,
      isVerified: false,
      verificationToken,
    });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { verificationToken: token } });
  }

  async verifyUser(user: User): Promise<User> {
    user.isVerified = true;
    user.verificationToken = null;
    return this.usersRepository.save(user);
  }

  async refreshVerificationToken(user: User): Promise<User> {
    user.verificationToken = this.generateToken();
    return this.usersRepository.save(user);
  }

  async findOrCreateGoogle(profile: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
  }): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { googleId: profile.googleId } });
    if (user) {
      if (!user.isVerified) {
        user.isVerified = true;
        user.verificationToken = null;
        await this.usersRepository.save(user);
      }
      return user;
    }

    user = await this.usersRepository.findOne({ where: { email: profile.email } });
    if (user) {
      user.googleId = profile.googleId;
      if (!user.avatar && profile.avatar) user.avatar = profile.avatar;
      user.isVerified = true;
      user.verificationToken = null;
      return this.usersRepository.save(user);
    }

    const newUser = this.usersRepository.create({
      email: profile.email,
      name: profile.name,
      googleId: profile.googleId,
      avatar: profile.avatar || null,
      password: null,
      isVerified: true,
      verificationToken: null,
    });
    return this.usersRepository.save(newUser);
  }

  async updateAvatar(id: string, avatarPath: string): Promise<User> {
    await this.usersRepository.update(id, { avatar: avatarPath });
    return this.findById(id);
  }

  async removeAvatar(id: string): Promise<User> {
    await this.usersRepository.update(id, { avatar: null });
    return this.findById(id);
  }

  async createPasswordResetToken(email: string): Promise<{ user: User; token: string } | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user || !user.password) return null; // silently ignore unknown/google accounts
    const token = this.generateToken();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    user.resetPasswordToken = token;
    user.resetPasswordExpiry = expiry;
    await this.usersRepository.save(user);
    return { user, token };
  }

  async resetPasswordByToken(token: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { resetPasswordToken: token } });
    if (!user || !user.resetPasswordExpiry) throw new BadRequestException('Посилання недійсне');
    if (new Date() > user.resetPasswordExpiry) throw new BadRequestException('Посилання застаріло. Запросіть нове.');
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await this.usersRepository.save(user);
  }

  async deleteAccount(id: string): Promise<void> {
    // Explicitly remove dependent rows first to avoid FK constraint issues
    // regardless of whether the DB has ON DELETE CASCADE configured
    await this.templatesRepository.delete({ userId: id });
    await this.designsRepository.delete({ userId: id });
    await this.usersRepository.delete(id);
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.name) user.name = dto.name;

    if (dto.email && dto.email !== user.email) {
      const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Email already in use');
      user.email = dto.email;
    }

    if (dto.newPassword) {
      if (!user.password) {
        // Google-only account — allow setting a password for the first time
        user.password = await bcrypt.hash(dto.newPassword, 10);
      } else {
        if (!dto.currentPassword) throw new BadRequestException('Current password required');
        const valid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!valid) throw new BadRequestException('Current password is incorrect');
        user.password = await bcrypt.hash(dto.newPassword, 10);
      }
    }

    return this.usersRepository.save(user);
  }
}
