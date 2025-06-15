import * as React from "react";
import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import { navItems } from "./config";
import { NavItemConfig } from "../../types/nav";
import { useLocation } from "react-router-dom";
import { NavItem } from "./NavItem";
// import Logo from "../../assets/Logo.png";

export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
  items?: NavItemConfig[];
}

interface RenderNavItemsProps {
  items: NavItemConfig[];
  pathname: string;
  expandedNavKey: string | null;
  onNavItemClick: (key: string) => void;
}
export function renderNavItems({
  items,
  pathname,
  expandedNavKey,
  onNavItemClick,
}: RenderNavItemsProps) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item: any, index) => {
        console.log(index);

        const { key, ...restProps } = item; // Extract the key and rest of the props
        return (
          <div key={key}>
            <NavItem
              key={key} // Pass the key directly here
              pathname={pathname}
              {...restProps} // Spread the rest of the props
              isExpanded={item.key === expandedNavKey}
              onClick={() => onNavItemClick(item.key)}
            />
          </div>
        );
      })}
    </ul>
  );
}

export function MobileNav({
  open,
  onClose,
}: MobileNavProps): React.JSX.Element {
  const pathname = useLocation().pathname;
  const [expandedNavKey, setExpandedNavKey] = React.useState<string | null>(
    null
  );
  const handleNavItemClick = (key: string) => {
    setExpandedNavKey((prevKey) => (prevKey === key ? null : key));
  };
  return (
    <Drawer
      PaperProps={{
        sx: {
          "--MobileNav-background": "var(--mui-palette-neutral-950)",
          "--MobileNav-color": "var(--mui-palette-common-white)",
          "--NavItem-color": "var(--mui-palette-neutral-300)",
          "--NavItem-hover-background": "rgba(255, 255, 255, 0.04)",
          "--NavItem-active-background": "var(--mui-palette-primary-main)",
          "--NavItem-active-color": "var(--mui-palette-primary-contrastText)",
          "--NavItem-disabled-color": "var(--mui-palette-neutral-500)",
          "--NavItem-icon-color": "var(--mui-palette-neutral-400)",
          "--NavItem-icon-active-color":
            "var(--mui-palette-primary-contrastText)",
          "--NavItem-icon-disabled-color": "var(--mui-palette-neutral-600)",
          bgcolor: "var(--MobileNav-background)",
          color: "var(--MobileNav-color)",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          scrollbarWidth: "none",
          width: "var(--MobileNav-width)",
          zIndex: "var(--MobileNav-zIndex)",
          "&::-webkit-scrollbar": { display: "none" },
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ display: "inline-flex" }}>
          {/* <div style={{ display: "flex" }}>
            <img src={Logo} alt="logo" />
            <b>Web Tech</b>
          </div> */}
          JeniSH
        </Box>
      </Stack>
      <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
      <Box component="nav" sx={{ flex: "1 1 auto", p: "12px" }}>
        {renderNavItems({
          pathname,
          items: navItems,
          expandedNavKey,
          onNavItemClick: handleNavItemClick,
        })}
      </Box>
      <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
    </Drawer>
  );
}
