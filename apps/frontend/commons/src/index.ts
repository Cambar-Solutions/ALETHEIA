// @aletheia/frontend-commons — código compartido del frontend (SOFEA).

// Utilidades
export * from './utils/cn';

// RBAC compartido (roles, privilegios, hook por cookie, guard)
export * from './auth/roles';
export * from './auth/useRole';
export { PrivilegeGuard as CookiePrivilegeGuard } from './auth/PrivilegeGuard';

// Design System (Neobrutalism) — UI primitives
export * from './ui/button';
export * from './ui/card';
export * from './ui/badge';
export * from './ui/input';
export * from './ui/checkbox';
export * from './ui/table';
export * from './ui/dropdown-menu';
export { default as ContractDataTable } from './ui/data-table';
