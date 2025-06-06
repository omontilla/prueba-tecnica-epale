import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { NotFoundException } from '@nestjs/common';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepo: jest.Mocked<Partial<Repository<Comment>>>;
  let notificationService: jest.Mocked<NotificationService>;

  beforeEach(async () => {
    commentRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
    };

    notificationService = {
      notify: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: getRepositoryToken(Comment), useValue: commentRepo },
        { provide: NotificationService, useValue: notificationService },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('getCommentsByContentId should return comments', async () => {
    const mockList = [
      {
        id: 1,
        contentId: '1',
        text: 'Comentario de prueba',
        moderated: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    commentRepo.find.mockResolvedValue(mockList as any);
    const result = await service.getCommentsByContentId('1');
    expect(result).toEqual(mockList);
  });

  it('getCommentsByContentId should throw if empty', async () => {
    commentRepo.find.mockResolvedValue([]);
    await expect(service.getCommentsByContentId('no-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('moderateComment should throw if not found', async () => {
    commentRepo.findOneBy.mockResolvedValue(null);
    await expect(service.moderateComment('999')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('moderateComment should update and save', async () => {
    const comment = {
      id: '1',
      contentId: '10',
      text: 'Comentario de prueba',
      moderated: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    commentRepo.findOneBy.mockResolvedValue(comment as any);
    commentRepo.save.mockResolvedValue(comment as any);

    const result = await service.moderateComment('1');
    expect(result).toEqual(comment);
  });
});
