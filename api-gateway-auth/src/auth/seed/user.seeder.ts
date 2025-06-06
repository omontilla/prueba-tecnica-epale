import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entity/user.entity';

@Injectable()
export class UserSeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const exists = await this.userRepo.findOneBy({ username: 'omontilla' });

    if (!exists) {
      const hashedPassword = await bcrypt.hash('1234', 10);

      const user = this.userRepo.create({
        username: 'omontilla',
        password: hashedPassword,
        email: 'omontilla@test.com',
        roles: ['user'],
      });

      await this.userRepo.save(user);
      console.log(' Usuario omontilla insertado para pruebas');
    } else {
      console.log('ℹ Usuario omontilla ya existe');
    }
  }
}