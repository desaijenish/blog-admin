import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { GearSix as GearSixIcon } from "@phosphor-icons/react/dist/ssr/GearSix";
import { SignOut as SignOutIcon } from "@phosphor-icons/react/dist/ssr/SignOut";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
// import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
// import { useNavigate } from "react-router-dom";
import { parseJwt } from "../../utils/parseJwt";
import useSignOut from "../../hooks/useSignOut";

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({
  anchorEl,
  onClose,
  open,
}: UserPopoverProps): React.JSX.Element {
  // const router = useNavigate();
  const signOut = useSignOut();

  const cookies = new Cookies();
  const [userName, setUserName] = React.useState<string>("");
  const [userEmail, setUserEmail] = React.useState<string>("");

  React.useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      try {
        const decoded = parseJwt(token);
        setUserName(
          decoded.name
            ? decoded.name
            : `${decoded.first_name} ${decoded.last_name}`
        );
        setUserEmail(decoded.email);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, [cookies]);

  // const handleSignOut = React.useCallback(async (): Promise<void> => {
  //   try {
  //     cookies.remove("token");
  //     // await router("/admin/login");
  //     // window.location.reload();
  //   } catch (err) {
  //     console.error("Sign out error", err);
  //   }
  // }, [cookies, router]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: "240px" } } }}
    >
      <Box sx={{ p: "16px 20px " }}>
        <Typography variant="subtitle1">
          {userName || "Unknown User"}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {userEmail || "No email available"}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        sx={{ p: "8px", "& .MuiMenuItem-root": { borderRadius: 1 } }}
      >
        <MenuItem onClick={onClose}>
          <ListItemIcon>
            <GearSixIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={onClose}>
          <ListItemIcon>
            <UserIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={signOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
