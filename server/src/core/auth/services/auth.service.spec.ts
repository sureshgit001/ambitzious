import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserService } from 'src/core/user/services/user.service';
import { WorkspaceManagerService } from 'src/workspace/workspace-manager/workspace-manager.service';
import { FileUploadService } from 'src/core/file/services/file-upload.service';
import { Workspace } from 'src/core/workspace/workspace.entity';
import { User } from 'src/core/user/user.entity';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: TokenService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: WorkspaceManagerService,
          useValue: {},
        },
        {
          provide: FileUploadService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Workspace),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
