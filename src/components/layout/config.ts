import { NavItemConfig } from "../../types/nav";
import Cookies from "universal-cookie";
import { parseJwt } from "../../utils/parseJwt";
import {
  DecodedToken,
  getUserPermissions,
} from "../../utils/getUserPermissions";

const cookies = new Cookies();
const token = cookies.get("token");
const decodedToken: DecodedToken = token ? parseJwt(token) : null;

// const isSuperAdmin: boolean = decodedToken?.type === "company" || false;

const hasModuleAccess = (module: string): boolean => {
  return !!decodedToken?.roles?.some((role) =>
    role.permissions.some(
      (permission) =>
        permission.module === module &&
        Array.isArray(permission.permissions) &&
        permission.permissions.includes("view")
    )
  );
};
const hasSubEmployeePermission = (module: string, action: string) => {
  const EmployeePermissions =
    decodedToken?.roles?.find((role) => role.name === "Employee")
      ?.permissions || [];

  const mainModule = EmployeePermissions.find((perm) => perm.module === module);

  if (
    Array.isArray(mainModule?.permissions) &&
    mainModule?.permissions.includes(action)
  ) {
    return true;
  }

  if (mainModule?.submodules) {
    return mainModule.submodules.some(
      (sub) =>
        Array.isArray(sub.permissions) && sub.permissions.includes(action)
    );
  }

  return false;
};

export const navItems: NavItemConfig[] = [
  {
    key: "home",
    title: "Home",
    href: "/",
    icon: "Dashboard",
  },
  {
    key: "blog",
    title: "Blog",
    href: "/blog",
    icon: "Roles",
  },
  {
    key: "category",
    title: "Category",
    href: "/category",
    icon: "Project",
  },
];

export const navItems2: NavItemConfig[] = [
  { key: "myProfile", title: "My Profile", href: "/", icon: "user" },
  {
    key: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: "Dashboard",
  },
  {
    key: "group",
    title: "Group",
    href: "/groups",
    icon: "Group",
  },
  { key: "leave", title: "Leave", href: "/leave", icon: "Leave" },
  ...(hasModuleAccess("candidate")
    ? [
        {
          key: "candidate",
          title: "Candidates",
          href: "/candidate",
          icon: "Candidates",
        },
      ]
    : []),
  ...(hasModuleAccess("lead")
    ? [{ key: "leads", title: "Lead", href: "/leads", icon: "Lead" }]
    : []),
  ...(hasModuleAccess("task")
    ? [{ key: "task", title: "Task", href: "/tasks", icon: "Task" }]
    : []),
  ...(hasSubEmployeePermission("employee", "view")
    ? [{ key: "employee", title: "User", href: "/user", icon: "User " }]
    : []),
  ...(hasModuleAccess("timetable")
    ? [
        {
          key: "timetable",
          title: "Time Table",
          href: "/timetable",
          icon: "Time Table",
        },
      ]
    : []),
  ...(hasSubEmployeePermission("admin", "view")
    ? [
        {
          key: "admin",
          title: "Admin",
          icon: "Admin",
          items: [
            getUserPermissions("admin", "view", "role") && {
              key: "roles",
              title: "Roles",
              href: "/roles",
            },
            getUserPermissions("admin", "view", "permissions") && {
              key: "permissions",
              title: "Permissions",
              href: "/permissions",
            },
            getUserPermissions("admin", "view", "client") && {
              key: "category",
              title: "Category",
              href: "/category",
            },
            getUserPermissions("admin", "view", "project") && {
              key: "project",
              title: "Project",
              href: "/project",
            },
          ].filter(Boolean) as NavItemConfig[],
        },
      ]
    : []),
];
