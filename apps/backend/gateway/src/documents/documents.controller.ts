import {
  CurrentUser,
  DOCUMENTS_PATTERNS,
  RequirePrivilege,
  SERVICE_CLIENTS,
  type UserContext,
} from '@aletheia/backend-commons';
import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { CreateDocumentDto, CreateVersionDto, ProviderTypeQueryDto } from './dto/document.dto';

@ApiTags('documents')
@ApiBearerAuth('access-token')
@Controller('documents')
export class DocumentsController {
  constructor(@Inject(SERVICE_CLIENTS.DOCUMENTS) private readonly documents: ClientProxy) {}

  // Declarado ANTES de /:contractId para que 'required' no se capture como contractId.
  @Get('required')
  @ApiOperation({ summary: 'Documentos requeridos según tipo de proveedor (Factory)' })
  required(@Query() query: ProviderTypeQueryDto) {
    return firstValueFrom(
      this.documents.send(DOCUMENTS_PATTERNS.REQUIRED, { providerType: query.providerType }),
    );
  }

  @Post(':contractId')
  @RequirePrivilege('DOCUMENT_UPLOAD')
  @ApiOperation({ summary: 'Subir/crear documento de un contrato' })
  create(
    @Param('contractId', ParseIntPipe) contractId: number,
    @Body() body: CreateDocumentDto,
    @CurrentUser() user: UserContext,
  ) {
    return firstValueFrom(
      this.documents.send(DOCUMENTS_PATTERNS.CREATE, {
        dto: { contractId, ...body },
        uploadedById: user.userId,
      }),
    );
  }

  @Get(':contractId')
  @ApiOperation({ summary: 'Documentos de un contrato (incluye versiones)' })
  findByContract(@Param('contractId', ParseIntPipe) contractId: number) {
    return firstValueFrom(this.documents.send(DOCUMENTS_PATTERNS.FIND_BY_CONTRACT, { contractId }));
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Versiones de un documento' })
  findVersions(@Param('id', ParseIntPipe) id: number) {
    return firstValueFrom(this.documents.send(DOCUMENTS_PATTERNS.VERSION_FIND, { documentId: id }));
  }

  @Post(':id/versions')
  @RequirePrivilege('DOCUMENT_VERSION')
  @ApiOperation({ summary: 'Crear nueva versión de un documento' })
  createVersion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateVersionDto,
    @CurrentUser() user: UserContext,
  ) {
    return firstValueFrom(
      this.documents.send(DOCUMENTS_PATTERNS.VERSION_CREATE, {
        documentId: id,
        dto,
        uploadedById: user.userId,
      }),
    );
  }
}
