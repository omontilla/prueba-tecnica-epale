import {
  Entity,
  Column,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '../../comment/entity/comment.entity';

@Entity()
export class Content {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  videoUrl: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Comment, (comment: Comment) => comment.content, {
    cascade: true,
  })
  comments: Comment[];
}
