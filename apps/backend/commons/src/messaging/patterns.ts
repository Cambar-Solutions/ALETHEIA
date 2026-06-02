/**
 * Patrones de mensajes Redis entre el gateway y los microservicios.
 * Convención: '<servicio>.<accion>'.
 */
export const AUTH_PATTERNS = {
  LOGIN: 'auth.login',
  REFRESH: 'auth.refresh',
  LOGOUT: 'auth.logout',
} as const;

export const CONTRACTS_PATTERNS = {
  PING: 'contracts.ping',
} as const;

export const WORKFLOW_PATTERNS = {
  PING: 'workflow.ping',
} as const;

export const DOCUMENTS_PATTERNS = {
  PING: 'documents.ping',
} as const;

/** Tokens de inyección para los ClientProxy del gateway. */
export const SERVICE_CLIENTS = {
  AUTH: 'AUTH_SERVICE',
  CONTRACTS: 'CONTRACTS_SERVICE',
  WORKFLOW: 'WORKFLOW_SERVICE',
  DOCUMENTS: 'DOCUMENTS_SERVICE',
} as const;
