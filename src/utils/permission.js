export const hasPermission = (permissionKey) => {
    const lockRolePermissions = localStorage.getItem("lock_role_permissions");
    if (lockRolePermissions) {
      const permissions = JSON.parse(lockRolePermissions);
      const specificPermissions = permissions[permissionKey] || {};  
      return Object.values(specificPermissions).includes("true");
    }
    return false;
  };