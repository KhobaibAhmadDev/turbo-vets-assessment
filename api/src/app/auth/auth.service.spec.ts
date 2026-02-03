import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ApiAuthService } from './auth.service';

describe('ApiAuthService', () => {
  let service: ApiAuthService;
  let mockJwtService: Partial<JwtService>;

  beforeEach(async () => {
    mockJwtService = {
      sign: jest.fn((payload) => 'mock-token-' + JSON.stringify(payload)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiAuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<ApiAuthService>(ApiAuthService);
  });

  describe('login', () => {
    it('should return access token with email and OWNER role', async () => {
      const result = await service.login('user@example.com', 'password');

      expect(result).toHaveProperty('accessToken');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'user@example.com',
        role: 'OWNER',
      });
    });
  });
});
