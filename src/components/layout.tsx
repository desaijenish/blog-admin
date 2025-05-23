import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMediaQuery } from "@mui/material";
import authImage from "../assets/images/download.png";

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  const isLargeScreen = useMediaQuery("(min-width: 992px)");

  return (
    <React.Suspense fallback={<div>loading.....</div>}>
      <Box
        sx={{
          display: { xs: "flex", lg: "grid" },
          flexDirection: "column",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{ display: "flex", flex: "1 1 auto", flexDirection: "column" }}
        >
          <Box sx={{ p: 3 }}>
            <Box
              component={Link}
              to="/"
              sx={{ display: "inline-block", fontSize: 0 }}
            >
              JENISH
            </Box>
          </Box>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flex: "1 1 auto",
              justifyContent: "center",
              p: 3,
            }}
          >
            <Box sx={{ maxWidth: "450px", width: "100%" }}>{children}</Box>
          </Box>
        </Box>
        {isLargeScreen && (
          <Box
            sx={{
              alignItems: "center",
              background:
                "radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)",
              color: "var(--mui-palette-common-white)",
              display: { xs: "none", lg: "flex" },
              justifyContent: "center",
              p: 3,
            }}
          >
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography
                  color="inherit"
                  sx={{
                    fontSize: "24px",
                    lineHeight: "32px",
                    textAlign: "center",
                    color: "white",
                  }}
                  variant="h1"
                >
                  Welcome to
                  <Box component="span" sx={{ color: "#15b79e" }}>
                    {" "}
                    D2 webtech CRM
                  </Box>
                </Typography>
              </Stack>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img
                  alt="Widgets"
                  src={authImage}
                  style={{ height: "auto", width: "53vw" }}
                />
              </Box>
            </Stack>
          </Box>
        )}
      </Box>
    </React.Suspense>
  );
}
