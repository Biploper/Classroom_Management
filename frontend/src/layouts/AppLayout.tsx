import { ThemedLayout } from "@refinedev/antd";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

interface AppLayoutProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function AppLayout({
  isDark,
  onToggleTheme,
}: AppLayoutProps) {
  return (
    <ThemedLayout
      Header={() => (
        <AppHeader
          isDark={isDark}
          onToggleTheme={onToggleTheme}
        />
      )}
      Sider={AppSidebar}
    >
      <div className="min-h-screen bg-[#f8f7f4] p-4 sm:p-6 lg:p-8 dark:bg-stone-950">
        <Outlet />
      </div>
    </ThemedLayout>
  );
}