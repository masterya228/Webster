import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.name) user.name = dto.name;

    if (dto.email && dto.email !== user.email) {
      const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Email already in use');
      user.email = dto.email;
    }

    if (dto.newPassword) {
      if (!dto.currentPassword) throw new BadRequestException('Current password required');
      if (!user.password) throw new BadRequestException('Account has no password (Google login)');
      const valid = await bcrypt.compare(dto.currentPassword, user.password);
      if (!valid) throw new BadRequestException('Current password is incorrect');
      user.password = await bcrypt.hash(dto.newPassword, 10);
    }

    return this.usersRepository.save(user);
  }
}
