import { Module } from '@nestjs/common';
import { AuthResolve } from './auth.resolve';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { GqlAuthGuard } from './gql-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserSeederService } from './seed/user.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthResolve,
    AuthService,
    JwtStrategy,
    GqlAuthGuard,
    UserSeederService,
  ],
  exports: [GqlAuthGuard],
})
export class AuthModule {}
