
import { useState } from "react";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router";
import {
  App as AntdApp,
  ConfigProvider,
  theme as antdTheme,
} from "antd";
import { RefineThemes } from "@refinedev/antd";

import "@refinedev/antd/dist/reset.css";
import dataProvider from "./providers/data-provider";
import AssignmentList from "./features/assignments/pages/AssignmentList";
import AppLayout from "./layouts/AppLayout";

function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((current) => !current);
  };

  return (
    <BrowserRouter>
      <div className={isDark ? "dark" : ""}>
        <ConfigProvider
          theme={{
            ...RefineThemes.Blue,
            algorithm: isDark
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
            token: {
              ...RefineThemes.Blue.token,
              fontFamily: '"Inter", sans-serif',
            },
          }}
        >
          <AntdApp>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              resources={[
                {
                  name: "assignments",
                  list: "/assignments",
                  create: "/assignments/create",
                  edit: "/assignments/edit/:id",
                },
              ]}
            >
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/assignments" replace />}
                />

                <Route
                  element={
                    <AppLayout
                      isDark={isDark}
                      onToggleTheme={toggleTheme}
                    />
                  }
                >
                  <Route
                    path="/assignments"
                    element={<AssignmentList />}
                  />

                  <Route
                    path="/assignments/create"
                    element={
                      <div>Create assignment page coming next.</div>
                    }
                  />

                  <Route
                    path="/assignments/edit/:id"
                    element={
                      <div>Edit assignment page coming next.</div>
                    }
                  />
                </Route>
              </Routes>
            </Refine>
          </AntdApp>
        </ConfigProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
