import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Workspace } from 'src/core/workspace/workspace.entity';

import { AuthResolver } from './auth.resolver';

import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: getRepositoryToken(Workspace),
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: TokenService,
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
