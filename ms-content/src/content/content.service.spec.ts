import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entity/content.entity';
import { ClientProxy } from '@nestjs/microservices';
import * as fs from 'fs';

jest.mock('fs');

describe('ContentService', () => {
  let service: ContentService;
  let contentRepo: jest.Mocked<Partial<Repository<Content>>>;
  let client: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    contentRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
    };

    client = {
      emit: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        { provide: getRepositoryToken(Content), useValue: contentRepo },
        { provide: 'THUMBNAIL_SERVICE', useValue: client },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
  });

  it('updateThumbnail should throw if not found', async () => {
    contentRepo.findOneBy.mockResolvedValue(null);
    await expect(service.updateThumbnail(1, 'url')).rejects.toThrow();
  });

  it('updateThumbnail should save new url', async () => {
    const content = createMockContent({ thumbnailUrl: '' });
    contentRepo.findOneBy.mockResolvedValue(content);
    contentRepo.save.mockResolvedValue(content);
    const result = await service.updateThumbnail(1, 'x.jpg');
    expect(result.thumbnailUrl).toBe('x.jpg');
  });

  it('delete should unlink files if exist', async () => {
    contentRepo.delete.mockResolvedValue({ affected: 1, raw: {} });
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);

    const result = await service.delete(5);
    expect(result).toEqual({ deleted: true });
  });

  it('delete should return false if not found', async () => {
    contentRepo.delete.mockResolvedValue({ affected: 1, raw: {} });
    const result = await service.delete(99);
    expect(result).toEqual({ deleted: true });
  });

  function createMockContent(overrides = {}): Content {
    return {
      comments: [],
      id: 1,
      title: 'Título',
      description: 'Descripción',
      videoUrl: '/tmp/videos/1.mp4',
      thumbnailUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }
});
