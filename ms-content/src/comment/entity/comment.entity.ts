import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Content } from '../../content/entity/content.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  contentId: string;

  @Column()
  text: string;

  @Column({ default: true })
  moderated: boolean;

  @Column({ default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Content, (content) => content.comments, {
    onDelete: 'CASCADE',
  })
  content: Content;
}
