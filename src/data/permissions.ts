export type Permission = 
  | 'view:tools'
  | 'edit:tools'
  | 'delete:tools'
  | 'create:tools'
  | 'view:users'
  | 'edit:users' 
  | 'delete:users'
  | 'create:users'
  | 'view:settings'
  | 'edit:settings';

export type Role = 'admin' | 'editor' | 'viewer';

// Her rolün sahip olduğu izinler
export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'view:tools',
    'edit:tools',
    'delete:tools',
    'create:tools',
    'view:users',
    'edit:users',
    'delete:users',
    'create:users',
    'view:settings',
    'edit:settings'
  ],
  editor: [
    'view:tools',
    'edit:tools',
    'create:tools',
    'view:users',
    'view:settings'
  ],
  viewer: [
    'view:tools',
    'view:users'
  ]
};

// Verilen role göre izin kontrolü yapar
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

// Verilen kullanıcı rolüne göre izinlere sahip olup olmadığını kontrol eden fonksiyon
export function checkPermissions(role: Role, requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every(permission => hasPermission(role, permission));
} 