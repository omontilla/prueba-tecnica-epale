import { User } from './entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockUser: User = {
    id: '123',
    username: 'omontilla',
    password: 'hashedpass',
    roles: ['user'],
  } as User;

  const mockUserRepo = {
    findOneBy: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked.token.jwt'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login()', () => {
    it('should return accessToken if credentials are valid', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.login({
        username: 'omontilla',
        password: '1234',
      });

      expect(result).toEqual({
        accessToken: 'mocked.token.jwt',
        expiresIn: 3600,
      });

      expect(mockUserRepo.findOneBy).toHaveBeenCalledWith({
        username: 'omontilla',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
        roles: mockUser.roles,
      });
    });

    it('should throw if user is not found', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.login({ username: 'invalid', password: '1234' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password is invalid', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        service.login({ username: 'omontilla', password: 'wrongpass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile()', () => {
    it('should return user by ID', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(mockUser);
      const result = await service.getProfile('123');
      expect(result).toEqual(mockUser);
    });
  });
});
