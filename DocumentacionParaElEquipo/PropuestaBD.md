# Base de Datos — Esquema CLM

**Motor:** PostgreSQL 16  
**ORM:** Prisma  
**Archivo fuente:** `apps/backend/prisma/schema.prisma`

---

## Entidades y Relaciones

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    User     │──────▶│   UserRole   │◀──────│    Role     │
│             │       └──────────────┘       │             │
│  areaId FK  │                              └──────┬──────┘
└──────┬──────┘                                     │
       │                                    ┌───────▼──────┐
       ▼                                    │ RolePrivilege│
┌─────────────┐                             └───────┬──────┘
│    Area     │◀── Contract                         │
└─────────────┘                             ┌───────▼──────┐
                                            │  Privilege   │
┌─────────────┐       ┌──────────────┐      └──────────────┘
│  Contract   │──────▶│ContractWorkflow│
│             │       │              │──────▶WorkflowStage
│             │──────▶│WorkflowTransition│
│             │──────▶│  Document    │──────▶DocumentVersion
│             │──────▶│  Signature   │──────▶Apoderado
│             │──────▶│  AuditLog    │
│             │──────▶│ Notification │──────▶User
└─────────────┘       └──────────────┘
```

---

## Schema Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── AUTH / USUARIOS ────────────────────────────────

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  password      String
  name          String
  areaId        String?
  area          Area?          @relation(fields: [areaId], references: [id])
  isActive      Boolean        @default(true)
  userRoles     UserRole[]
  notifications Notification[]
  auditLogs     AuditLog[]
  refreshTokens RefreshToken[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Role {
  id             String          @id @default(uuid())
  name           String          @unique
  // SOLICITANTE | ADMINISTRADOR | ABOGADO | APROBADOR | FIRMANTE
  rolePrivileges RolePrivilege[]
  userRoles      UserRole[]
}

model Privilege {
  id             String          @id @default(uuid())
  code           String          @unique
  // CONTRACT_CREATE | CONTRACT_REVIEW_ADMIN | ...
  description    String
  rolePrivileges RolePrivilege[]
}

model RolePrivilege {
  roleId      String
  privilegeId String
  role        Role      @relation(fields: [roleId], references: [id])
  privilege   Privilege @relation(fields: [privilegeId], references: [id])

  @@id([roleId, privilegeId])
}

model UserRole {
  userId String
  roleId String
  user   User   @relation(fields: [userId], references: [id])
  role   Role   @relation(fields: [roleId], references: [id])

  @@id([userId, roleId])
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  createdAt DateTime @default(now())
}

// ─── CATÁLOGOS ──────────────────────────────────────

model Society {
  id        String     @id @default(uuid())
  name      String     @unique
  isActive  Boolean    @default(true)
  contracts Contract[]
  templates Template[]
}

model Area {
  id        String     @id @default(uuid())
  name      String     @unique
  isActive  Boolean    @default(true)
  users     User[]
  contracts Contract[]
}

model Apoderado {
  id         String      @id @default(uuid())
  name       String
  legalPower String
  isActive   Boolean     @default(true)
  signatures Signature[]
}

model Template {
  id        String   @id @default(uuid())
  name      String
  content   String   // HTML del editor WYSIWYG
  societyId String?
  society   Society? @relation(fields: [societyId], references: [id])
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ─── CONTRATOS ──────────────────────────────────────

model Contract {
  id           String            @id @default(uuid())
  folio        String            @unique
  title        String
  societyId    String
  society      Society           @relation(fields: [societyId], references: [id])
  vendorName   String
  vendorEmail  String
  vendorType   VendorType
  areaId       String
  area         Area              @relation(fields: [areaId], references: [id])
  status       ContractStatus    @default(DRAFT)
  createdBy    String            // userId del solicitante
  cancelledAt  DateTime?
  cancelReason String?
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
  documents    Document[]
  workflow     ContractWorkflow?
  signatures   Signature[]
  auditLogs    AuditLog[]
  notifications Notification[]
}

enum VendorType {
  PERSONA_FISICA
  PERSONA_MORAL
}

enum ContractStatus {
  DRAFT
  SUBMITTED
  ADMIN_REVIEW
  LAWYER_REVIEW
  APPROVAL_PENDING
  APPROVED
  SIGNING
  SIGNED
  CANCELLED
  REJECTED
}

// ─── DOCUMENTOS ─────────────────────────────────────

model Document {
  id             String            @id @default(uuid())
  contractId     String
  contract       Contract          @relation(fields: [contractId], references: [id])
  name           String
  type           String
  isRequired     Boolean
  expiresAt      DateTime?
  currentVersion Int               @default(1)
  versions       DocumentVersion[]
  createdAt      DateTime          @default(now())
}

model DocumentVersion {
  id         String   @id @default(uuid())
  documentId String
  document   Document @relation(fields: [documentId], references: [id])
  version    Int
  filePath   String
  fileSize   Int
  mimeType   String
  uploadedBy String   // userId
  createdAt  DateTime @default(now())
}

// ─── WORKFLOW ───────────────────────────────────────

model WorkflowStage {
  id              String             @id @default(uuid())
  name            String
  order           Int
  assignedRole    String             // nombre del rol asignado a esta etapa
  slaHours        Int
  isEditable      Boolean            @default(true)
  contractWorkflows ContractWorkflow[]
}

model ContractWorkflow {
  id             String               @id @default(uuid())
  contractId     String               @unique
  contract       Contract             @relation(fields: [contractId], references: [id])
  currentStageId String
  currentStage   WorkflowStage        @relation(fields: [currentStageId], references: [id])
  enteredAt      DateTime             @default(now())
  transitions    WorkflowTransition[]
}

model WorkflowTransition {
  id                 String           @id @default(uuid())
  contractWorkflowId String
  contractWorkflow   ContractWorkflow @relation(fields: [contractWorkflowId], references: [id])
  fromStageId        String
  toStageId          String
  action             TransitionAction
  comment            String?
  performedBy        String           // userId
  performedAt        DateTime         @default(now())
}

enum TransitionAction {
  APPROVE
  REJECT
  RETURN
}

// ─── FIRMAS ─────────────────────────────────────────

model Signature {
  id            String     @id @default(uuid())
  contractId    String
  contract      Contract   @relation(fields: [contractId], references: [id])
  apoderadoId   String?
  apoderado     Apoderado? @relation(fields: [apoderadoId], references: [id])
  signatureData String     // base64 del canvas
  signedBy      String     // userId del firmante
  signedAt      DateTime   @default(now())
}

// ─── NOTIFICACIONES ─────────────────────────────────

model Notification {
  id         String    @id @default(uuid())
  userId     String
  user       User      @relation(fields: [userId], references: [id])
  title      String
  message    String
  isRead     Boolean   @default(false)
  contractId String?
  contract   Contract? @relation(fields: [contractId], references: [id])
  createdAt  DateTime  @default(now())
}

// ─── AUDITORÍA ──────────────────────────────────────

model AuditLog {
  id         String   @id @default(uuid())
  contractId String
  contract   Contract @relation(fields: [contractId], references: [id])
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  action     String   // ej: "SUBMITTED", "APPROVED", "DOCUMENT_UPLOADED"
  oldValue   Json?
  newValue   Json?
  createdAt  DateTime @default(now())
}
```

---

## Resumen de Entidades

| Entidad | Propósito |
|---|---|
| `User` | Usuarios del sistema con área asignada |
| `Role` | Roles: Solicitante, Administrador, Abogado, Aprobador, Firmante |
| `Privilege` | Permisos granulares asignados a roles |
| `RolePrivilege` | Relación N:M entre Role y Privilege |
| `UserRole` | Relación N:M entre User y Role |
| `RefreshToken` | Tokens de refresco almacenados para invalidación en logout |
| `Society` | Empresas/razones sociales disponibles para contratos |
| `Area` | Áreas organizacionales (Compras, Legal, RRHH…) |
| `Apoderado` | Firmantes legales con poder notarial |
| `Template` | Plantillas WYSIWYG de contratos, opcionalmente por sociedad |
| `Contract` | Contrato principal con estado y metadata del proveedor |
| `Document` | Documento requerido para un contrato |
| `DocumentVersion` | Versiones de un documento (historial de subidas) |
| `WorkflowStage` | Etapas configurables del flujo (configuradas por Administrador) |
| `ContractWorkflow` | Estado actual del flujo de un contrato específico |
| `WorkflowTransition` | Historial de cada acción tomada sobre el flujo |
| `Signature` | Firma registrada (canvas base64) ligada a un apoderado |
| `Notification` | Notificaciones internas por usuario |
| `AuditLog` | Bitácora de todas las acciones sobre un contrato |

---

## Notas de Diseño

- **RefreshToken en BD**: necesario para poder invalidar el token en logout. Sin esta tabla, un usuario que cierra sesión seguiría teniendo un refresh token válido por 7 días.
- **vendorName en Contract**: se agrega para guardar el nombre del proveedor además de su correo, ya que no es un usuario del sistema.
- **title en Contract**: campo descriptivo para identificar el contrato en listas y reportes.
- **isActive en Society/Area**: permite desactivar sin eliminar, manteniendo la integridad referencial con contratos históricos.
- Los campos `performedBy`, `createdBy`, `uploadedBy`, `signedBy` almacenan el `userId` como String (no FK directa) para mantener el registro histórico incluso si el usuario es desactivado.
