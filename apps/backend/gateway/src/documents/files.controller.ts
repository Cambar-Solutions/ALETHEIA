import { extname } from 'node:path';
import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { FileStorageService } from './storage/file-storage.service';

/** Minimal extension -> Content-Type map for serving stored documents. */
const MIME_BY_EXT: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.zip': 'application/zip',
};

@ApiTags('files')
@ApiBearerAuth('access-token')
@Controller('files')
export class FilesController {
  constructor(private readonly storage: FileStorageService) {}

  /**
   * Streams a stored document binary with the proper Content-Type.
   * Protected by the global JwtAuthGuard (same as the rest of the gateway).
   * Bypasses the global TransformInterceptor by writing to the raw response.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Descargar/servir un archivo almacenado' })
  download(@Param('id') id: string, @Res() res: Response) {
    const absolutePath = this.storage.resolvePath(id);
    if (!absolutePath) throw new NotFoundException('Archivo no encontrado');

    const contentType =
      MIME_BY_EXT[extname(absolutePath).toLowerCase()] ?? 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${id}"`);

    this.storage.createReadStream(absolutePath).pipe(res);
  }
}
