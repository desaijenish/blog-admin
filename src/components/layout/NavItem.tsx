import * as React from "react";
import {
  Box,
  Typography,
  Tooltip,
  Popper,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import { CaretUpDown as CaretUpDownIcon } from "@phosphor-icons/react/dist/ssr/CaretUpDown";
import { navIcons } from "./nav-icons";
import { NavItemConfig } from "../../types/nav";
import { Link } from "react-router-dom";

interface NavItemProps extends Omit<NavItemConfig, "items"> {
  pathname: string;
  isExpanded?: boolean;
  onClick?: () => void;
  items?: NavItemConfig[];
  collapsed: boolean; // Sidebar collapse state
}

export function NavItem({
  href,
  icon,
  pathname,
  title,
  items = [],
  isExpanded,
  onClick,
  collapsed,
}: NavItemProps): React.JSX.Element {
  const active = href ? pathname === href : false;
  const Icon = icon ? navIcons[icon] : null;

  // State for Popper
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    // Only open Popper if the sidebar is collapsed and the item has sub-items
    if (collapsed && items.length > 0) {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => !prev);
    }
    if (onClick) onClick();
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Close Popper when drawer is toggled
  React.useEffect(() => {
    if (!collapsed) {
      handleClose();
    }
  }, [collapsed]);

  return (
    <li style={{ width: "100%" }}>
      {" "}
      <Tooltip title={collapsed ? title : ""} placement="right">
        <Link
          to={href || "#"}
          style={{ textDecoration: "none", width: "100%" }}
          onClick={handleClick}
        >
          <Box
            component="div"
            sx={{
              alignItems: "center",
              borderRadius: 1,
              color: "var(--NavItem-color)",
              cursor: "pointer",
              display: "flex",
              flex: "0 0 auto",
              gap: collapsed ? 0 : 2,
              px: collapsed ? 1 : 2,
              py: 1.5,
              textDecoration: "none",
              transition: "background-color 0.2s, padding 0.2s",
              justifyContent: collapsed ? "center" : "flex-start",
              width: "100%", // Full width nav item
              ...(active && {
                "--NavItem-color": "var(--NavItem-active-color)",
                backgroundColor: "var(--NavItem-active-background)",
                color: "var(--NavItem-active-color)",
              }),
              "&:hover": {
                backgroundColor: "var(--NavItem-hover-background)",
              },
              "&:disabled": {
                "--NavItem-color": "var(--NavItem-disabled-color)",
                "--NavItem-icon-color": "var(--NavItem-icon-disabled-color)",
                cursor: "not-allowed",
              },
            }}
          >
            {Icon && (
              <Box
                component="span"
                sx={{
                  alignItems: "center",
                  color: "var(--NavItem-icon-color)",
                  display: "inline-flex",
                  justifyContent: "center",
                  height: 24,
                  width: 24,
                  ...(active && {
                    color: "var(--NavItem-icon-active-color)",
                  }),
                }}
              >
                <Icon />
              </Box>
            )}
            {!collapsed && (
              <Typography component="span" variant="body2">
                {title}
              </Typography>
            )}
            {items.length > 0 && !collapsed && (
              <CaretUpDownIcon
                size={16}
                weight="bold"
                style={{
                  marginLeft: "auto",
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            )}
          </Box>
        </Link>
      </Tooltip>
      {items.length > 0 && !collapsed && (
        <ul
          style={{
            display: isExpanded ? "block" : "none",
            paddingLeft: "0.9rem",
            listStyle: "none",
            width: "100%",
          }}
        >
          {items.map((subItem: NavItemConfig, index: number) => {
            console.log(index);

            const { key, ...restProps } = subItem; // Extract the key and rest of the props
            return (
              <div key={key} style={{ width: "100%" }}>
                <NavItem
                  key={key} // Pass the key directly here
                  pathname={pathname}
                  {...restProps} // Spread the rest of the props
                  collapsed={collapsed}
                />
              </div>
            );
          })}
        </ul>
      )}
      {items.length > 0 && collapsed && (
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="right"
          sx={{ zIndex: 1200, paddingLeft: "13px" }}
        >
          <ClickAwayListener onClickAway={handleClose}>
            <Paper
              sx={{
                p: 1,
                borderRadius: "8px", // Rounded corners
                border: "1px solid #333", // Border
                backgroundColor: "#121621", // Background color
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  paddingLeft: "0",
                  width: "100%",
                }}
              >
                {items.map((subItem: NavItemConfig, index: number) => {
                  const IconSub = subItem.icon ? navIcons[subItem.icon] : null;
                  const isSubItemActive = subItem.href
                    ? pathname === subItem.href
                    : false;
                  return (
                    <div key={index} style={{ width: "100%" }}>
                      <Link
                        to={subItem.href || "#"}
                        style={{ textDecoration: "none", width: "100%" }}
                      >
                        <Box
                          component="a"
                          sx={{
                            alignItems: "center",
                            borderRadius: 1,
                            color: "white", // White text
                            cursor: "pointer",
                            display: "flex",
                            flex: "0 0 auto",
                            gap: 2,
                            px: 2,
                            py: 1.5,
                            textDecoration: "none",
                            transition: "background-color 0.2s, padding 0.2s",
                            justifyContent: "flex-start",
                            width: "100%", // Full width nav item
                            ...(isSubItemActive && {
                              "--NavItem-color": "var(--NavItem-active-color)",
                              backgroundColor: "#635bff",
                              color: "white",
                            }),
                            "&:hover": {
                              backgroundColor: "#635bff",
                            },
                            "&:disabled": {
                              "--NavItem-color":
                                "var(--NavItem-disabled-color)",
                              "--NavItem-icon-color":
                                "var(--NavItem-icon-disabled-color)",
                              cursor: "not-allowed",
                            },
                          }}
                        >
                          {IconSub && (
                            <Box
                              component="span"
                              sx={{
                                alignItems: "center",
                                color: "white", // White icon
                                display: "inline-flex",
                                justifyContent: "center",
                                height: 24,
                                width: 24,
                                ...(isSubItemActive && {
                                  color: "white",
                                }),
                              }}
                            >
                              <IconSub />
                            </Box>
                          )}
                          <Typography component="span" variant="body2">
                            {subItem.title}
                          </Typography>
                        </Box>
                      </Link>
                    </div>
                  );
                })}
              </ul>
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
    </li>
  );
}
