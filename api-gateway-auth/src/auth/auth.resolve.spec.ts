import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolve } from './auth.resolve';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './gql-auth.guard';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthResolve', () => {
  let resolver: AuthResolve;

  const mockAuthService = {
    login: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolve,
        { provide: AuthService, useValue: mockAuthService },
        GqlAuthGuard,
      ],
    }).compile();

    resolver = module.get<AuthResolve>(AuthResolve);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debe devolver el accessToken correctamente', async () => {
      const result = { accessToken: 'jwt.token', expiresIn: 3600 };
      mockAuthService.login.mockResolvedValue(result);

      const response = await resolver.login('admin', '1234');

      expect(response).toEqual(result);
      expect(mockAuthService.login).toHaveBeenCalledWith({
        username: 'admin',
        password: '1234',
      });
    });

    it('debe lanzar error si las credenciales fallan', async () => {
      mockAuthService.login.mockRejectedValue(new UnauthorizedException());

      await expect(resolver.login('admin', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getProfile', () => {
    it('debe devolver el nombre del usuario autenticado', async () => {
      const contextMock = {
        req: {
          user: { username: 'omontilla' },
        },
      };

      const response = await resolver.getProfile(contextMock);
      expect(response).toBe('Usuario autenticado: omontilla');
    });
  });
});
