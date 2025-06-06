import { Module } from '@nestjs/common';
import { ContentResolve } from './content.resolve';
import { ContentService } from './content.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ContentResolve, ContentService],
})
export class ContentModule {}
