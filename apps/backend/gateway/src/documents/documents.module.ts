import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { SignaturesController } from './signatures.controller';

@Module({
  controllers: [DocumentsController, SignaturesController],
})
export class DocumentsModule {}
