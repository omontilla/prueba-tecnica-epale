import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { CommentResolve } from './comment.resolve';

describe('CommentResolve', () => {
  let resolver: CommentResolve;
  let service: CommentService;

  const mockCommentService = {
    getByContent: jest.fn(),
    addComment: jest.fn(),
    moderate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentResolve,
        {
          provide: CommentService,
          useValue: mockCommentService,
        },
      ],
    }).compile();

    resolver = module.get<CommentResolve>(CommentResolve);
    service = module.get<CommentService>(CommentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getComments should return comments list', async () => {
    const result = [
      {
        id: 1,
        text: 'Comentario',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    mockCommentService.getByContent.mockResolvedValue(result);

    const res = await resolver.getComments(1);
    expect(res).toEqual(result);
    expect(service.getByContent).toHaveBeenCalledWith(1);
  });

  it('addComment should add a comment', async () => {
    const result = {
      id: 1,
      text: 'Nuevo comentario',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCommentService.addComment.mockResolvedValue(result);

    const res = await resolver.addComment(1, { text: 'Nuevo comentario' });
    expect(res).toEqual(result);
    expect(service.addComment).toHaveBeenCalledWith(1, {
      text: 'Nuevo comentario',
    });
  });

  it('moderateComment should return the moderated comment', async () => {
    const result = {
      id: 1,
      text: 'Comentario',
      moderated: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCommentService.moderate.mockResolvedValue(result);

    const res = await resolver.moderateComment(1);
    expect(res).toEqual(result);
    expect(service.moderate).toHaveBeenCalledWith(1);
  });
});
