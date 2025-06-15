import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { navItems, navItems2 } from "./config";
import { renderNavItems } from "./renderNavItems";
import { useLocation, useNavigate } from "react-router-dom";
import { parseJwt } from "../../utils/parseJwt";
import { setCompanyId } from "../../redux/appSlice";
import Logo from "../../assets/Logo.png";
// import { RootState } from "../../redux/store";
interface SideNavProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function SideNav({ collapsed, setCollapsed }: SideNavProps) {
  const pathname = useLocation().pathname;
  const [expandedNavKey, setExpandedNavKey] = React.useState<string | null>(
    null
  );
  // const { data: company } = useGetByUserIdCompanyQuery("");
  const company: { company_id: string }[] = [];
  const cookies = new Cookies();
  const token = cookies.get("token");
  const dispatch = useDispatch();
  // const [selectedCompany, setSelectedCompany] = React.useState<string | null>(
  //   null
  // );
  const router = useNavigate();
  const decodedToken = parseJwt(token);
  // const companyId = useSelector((state: RootState) => state.app.companyId);

  const handleNavItemClick = (key: string) => {
    setExpandedNavKey((prevKey) => (prevKey === key ? null : key));
  };

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  React.useEffect(() => {
    if (company) {
      // setSelectedCompany(company[0]?.company_id);
      dispatch(setCompanyId(company[0]?.company_id));
    }
  }, [company]);

  React.useEffect(() => {
    if (token) {
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        cookies.remove("token");
        router("/login");
      } else if (decodedToken.type === "company") {
        dispatch(setCompanyId(decodedToken.id));
      }
    }
  }, [token, router]);

  // Automatically collapse sidebar if URL contains /group or /chat
  // React.useEffect(() => {
  //   if (
  //     pathname.includes("/groups") ||
  //     pathname.includes("/chat") ||
  //     pathname.includes("/content")
  //   ) {
  //     setCollapsed(true);
  //   } else {
  //     setCollapsed(false);
  //   }
  // }, [pathname, setCollapsed]);

  // const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedValue = event.target.value;
  //   setSelectedCompany(selectedValue);
  //   dispatch(setCompanyId(selectedValue));
  // };

  if (
    pathname !== "/login" &&
    pathname !== "/register" &&
    pathname !== "/verify-email"
  ) {
    return (
      <Box
        component="nav"
        sx={{
          "--SideNav-background": "var(--mui-palette-neutral-950)",
          "--SideNav-color": "var(--mui-palette-common-white)",
          "--NavItem-color": "var(--mui-palette-neutral-300)",
          "--NavItem-hover-background": "rgba(255, 255, 255, 0.04)",
          "--NavItem-active-background": "var(--mui-palette-primary-main)",
          "--NavItem-active-color": "var(--mui-palette-primary-contrastText)",
          "--NavItem-disabled-color": "var(--mui-palette-neutral-500)",
          "--NavItem-icon-color": "var(--mui-palette-neutral-400)",
          "--NavItem-icon-active-color":
            "var(--mui-palette-primary-contrastText)",
          "--NavItem-icon-disabled-color": "var(--mui-palette-neutral-600)",
          bgcolor: "var(--SideNav-background)",
          color: "var(--SideNav-color)",
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          height: "100%",
          width: collapsed ? "80px" : "250px",
          transition: "width 0.3s ease",
          left: 0,
          maxWidth: "100%",
          position: "fixed",
          scrollbarWidth: "none",
          top: 0,
          zIndex: 5,
          overflowY: "auto",

          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* {!collapsed && <img src={Logo} alt="logo" width={"65px"} />}
             */}
            JENISH{" "}
          </Box>
          <IconButton onClick={handleToggleSidebar} sx={{ color: "white" }}>
            {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Stack>

        <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
        <Box component="nav" sx={{ flex: "1 1 auto", p: "12px" }}>
          {renderNavItems({
            pathname,
            items: navItems,
            expandedNavKey,
            onNavItemClick: handleNavItemClick,
            collapsed,
          })}
        </Box>
        <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
      </Box>
    );
  } else if (
    pathname !== "/login" &&
    pathname !== "/register" &&
    pathname !== "/verify-email"
  ) {
    return (
      <Box
        sx={{
          "--SideNav-background": "var(--mui-palette-neutral-950)",
          "--SideNav-color": "var(--mui-palette-common-white)",
          "--NavItem-color": "var(--mui-palette-neutral-300)",
          "--NavItem-hover-background": "rgba(255, 255, 255, 0.04)",
          "--NavItem-active-background": "var(--mui-palette-primary-main)",
          "--NavItem-active-color": "var(--mui-palette-primary-contrastText)",
          "--NavItem-disabled-color": "var(--mui-palette-neutral-500)",
          "--NavItem-icon-color": "var(--mui-palette-neutral-400)",
          "--NavItem-icon-active-color":
            "var(--mui-palette-primary-contrastText)",
          "--NavItem-icon-disabled-color": "var(--mui-palette-neutral-600)",
          bgcolor: "var(--SideNav-background)",
          color: "var(--SideNav-color)",
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          height: "100%",
          width: collapsed ? "80px" : "250px",
          transition: "width 0.3s ease",
          left: 0,
          maxWidth: "100%",
          position: "fixed",
          scrollbarWidth: "none",
          top: 0,
          zIndex: 5,
          overflowY: "auto",

          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!collapsed && <img src={Logo} alt="logo" width={"65px"} />}
          </Box>
          <IconButton onClick={handleToggleSidebar} sx={{ color: "white" }}>
            {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Stack>

        <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
        <Box component="nav" sx={{ flex: "1 1 auto", p: "12px" }}>
          {renderNavItems({
            pathname,
            items: navItems2,
            expandedNavKey,
            onNavItemClick: handleNavItemClick,
            collapsed,
          })}
        </Box>
        <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
      </Box>
    );
  } else {
    return null;
  }
}
