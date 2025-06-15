// App.tsx
import React from "react";
import "./App.css";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ThemeProvider } from "./components/core/theme-provider/theme-provider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import ProtectedRoutes from "./page/ProtectedRoutes";
import { MainNav } from "./components/layout/main-nav";
import { useMediaQuery } from "@mui/system";
import WithAuth from "./components/WithAuth";
import { SideNav } from "./components/layout/SideNav";
interface LayoutProps {
  collapsed: boolean;
}
function Layout({ collapsed }: LayoutProps) {
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 1200px)");

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  return (
    <div
      style={{
        paddingLeft:
          !isPublicRoute && !isSmallScreen ? (collapsed ? 80 : 250) : 0,
      }}
    >
      <MainNav />
      <div style={{ padding: 35 }}>
        <ProtectedRoutes />
      </div>
    </div>
  );
}

function App() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="App">
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Provider store={store}>
            <React.StrictMode>
              <BrowserRouter>
                <WithAuth>
                  <SideNav collapsed={collapsed} setCollapsed={setCollapsed} />
                  <Layout collapsed={collapsed} />
                </WithAuth>
              </BrowserRouter>
            </React.StrictMode>
          </Provider>
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
