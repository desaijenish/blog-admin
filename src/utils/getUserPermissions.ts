import { parseJwt } from "./parseJwt";
import Cookies from "universal-cookie";

interface Submodule {
  module: string;
  permissions: string[];
}

interface Permission {
  module: string;
  permissions: string[];
  submodules?: Submodule[];
}

interface Role {
  id: number;
  name: string;
  allow_all: boolean;
  permissions: Permission[];
}

export interface DecodedToken {
  email: string;
  id: number;
  first_name: string;
  last_name: string;
  is_verified: Boolean;
  roles?: Role[] | undefined;
  exp: number;
  type: string;
}
export const getUserPermissions = (
  requiredRole: string,
  requiredPermission: string,
  requiredSubmodule?: string
) => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const decodedToken: DecodedToken | null = token ? parseJwt(token) : null;

  if (!decodedToken) return false;

  // const isSuperAdmin = decodedToken.is_super_admin;

  // if (isSuperAdmin) return true;
  if (decodedToken.type === "company") return true;

  if (decodedToken.roles) {
    return decodedToken?.roles.some(
      (role) =>
        Array.isArray(role.permissions) &&
        role.permissions.some((permission) => {
          if (permission.module === requiredRole) {
            // Check main module permissions
            if (
              Array.isArray(permission.permissions) &&
              permission.permissions.includes(requiredPermission) &&
              !requiredSubmodule
            ) {
              return true;
            }

            // Check submodule permissions
            if (
              requiredSubmodule &&
              Array.isArray(permission.submodules) &&
              permission.submodules.some(
                (submodule) =>
                  submodule.module === requiredSubmodule &&
                  Array.isArray(submodule.permissions) &&
                  submodule.permissions.includes(requiredPermission)
              )
            ) {
              return true;
            }
          }
          return false;
        })
    );
  }
};
