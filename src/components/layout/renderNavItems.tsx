// import * as React from "react";
import { NavItem } from "./NavItem";
import { NavItemConfig } from "../../types/nav";

interface RenderNavItemsProps {
  items: NavItemConfig[];
  pathname: string;
  expandedNavKey: string | null;
  onNavItemClick: (key: string) => void;
  collapsed: boolean;
}

export function renderNavItems({
  items,
  pathname,
  expandedNavKey,
  onNavItemClick,
  collapsed,
}: RenderNavItemsProps) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item) => {
        const { key, ...restProps } = item; // Extract the key and rest of the props
        return (
          <NavItem
            key={key} // Pass the key directly to NavItem
            pathname={pathname}
            {...restProps} // Spread the rest of the props
            isExpanded={item.key === expandedNavKey}
            onClick={() => onNavItemClick(item.key)}
            collapsed={collapsed} // Pass collapsed state to NavItem
          />
        );
      })}
    </ul>
  );
}
