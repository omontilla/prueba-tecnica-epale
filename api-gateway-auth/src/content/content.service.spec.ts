import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import axios from 'axios';
import { ConfigModule } from '@nestjs/config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [ContentService],
    }).compile();

    service = module.get<ContentService>(ContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getContent should return parsed content with comments', async () => {
    const mockData = {
      id: 1,
      title: 'Video test',
      description: 'Description',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [
        {
          id: 1,
          text: 'Great!',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    };

    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await service.getContent(1);
    expect(result.title).toBe('Video test');
    expect(result.comments.length).toBe(1);
  });

  it('deleteContent should return true', async () => {
    mockedAxios.delete.mockResolvedValue({ status: 200 });
    const result = await service.deleteContent(1);
    expect(result).toBe(true);
  });
});
