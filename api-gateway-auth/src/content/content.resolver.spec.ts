import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { ContentResolve } from './content.resolve';

describe('ContentResolver', () => {
  let resolver: ContentResolve;
  let service: ContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentResolve,
        {
          provide: ContentService,
          useValue: {
            uploadVideo: jest.fn(),
            getContent: jest.fn(),
            updateContent: jest.fn(),
            deleteContent: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ContentResolve>(ContentResolve);
    service = module.get<ContentService>(ContentService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should call getContent', async () => {
    const mockContent = { id: 1, title: 'Test' };
    jest.spyOn(service, 'getContent').mockResolvedValue(mockContent as any);
    const result = await resolver.getContent(1);
    expect(result).toEqual(mockContent);
  });

  it('should call deleteContent', async () => {
    jest.spyOn(service, 'deleteContent').mockResolvedValue(true);
    const result = await resolver.deleteContent(1);
    expect(result).toBe(true);
  });
});
