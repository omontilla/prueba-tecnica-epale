import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import axios from 'axios';
import { ConfigModule } from '@nestjs/config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [CommentService],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch comments by contentId', async () => {
    const mockData = [
      {
        id: 1,
        text: 'Comentario',
        createdAt: '2025-06-06T10:00:00Z',
        updatedAt: '2025-06-06T10:00:00Z',
      },
    ];
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await service.getByContent(1);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://ms-content:3001/content/1/comments',
    );
    expect(result[0].id).toBe(1);
    expect(result[0].createdAt instanceof Date).toBe(true);
  });

  it('should add a comment', async () => {
    const input = { text: 'Nuevo comentario' };
    const mockResponse = {
      id: 1,
      ...input,
      createdAt: '2025-06-06T10:00:00Z',
      updatedAt: '2025-06-06T10:00:00Z',
    };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await service.addComment(1, input);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://ms-content:3001/content/1/comments',
      input,
    );
    expect(result.id).toBe(1);
  });

  it('should moderate a comment', async () => {
    const commentId = 5;
    const mockComment = {
      id: commentId,
      text: 'Texto',
      moderated: true,
      createdAt: '2025-06-06T10:00:00Z',
      updatedAt: '2025-06-06T10:00:00Z',
    };

    mockedAxios.put.mockResolvedValue({ data: mockComment });

    const result = await service.moderate(commentId);

    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://ms-content:3001/content/comments/5/moderate',
    );
    expect(result.moderated).toBe(true);
  });

  it('should throw if moderate returns no data', async () => {
    mockedAxios.put.mockResolvedValue({ data: null });

    await expect(service.moderate(999)).rejects.toThrow(
      'Comentario con id 999 no encontrado',
    );
  });
});
