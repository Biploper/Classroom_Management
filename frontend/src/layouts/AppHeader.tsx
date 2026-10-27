
import { Button, Tooltip } from "antd";
import { Moon, Sun } from "lucide-react";
import { useLocation } from "react-router";

interface AppHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const pageTitles: Record<string, string> = {
  "/assignments": "Assignments",
  "/assignments/create": "Create assignment",
};

export default function AppHeader({
  isDark,
  onToggleTheme,
}: AppHeaderProps) {
  const { pathname } = useLocation();

  const title =
    pageTitles[pathname] ??
    (pathname.startsWith("/assignments/edit/")
      ? "Edit assignment"
      : "Classroom");

  return (
    <header
      className={[
        "sticky top-0 z-30 flex h-16 items-center justify-between",
        "border-b px-4 backdrop-blur-xl sm:px-6",
        "border-stone-200/80 bg-[#fcfbf8]/90",
        "dark:border-stone-800 dark:bg-stone-950/90",
      ].join(" ")}
    >
      <h1 className="m-0 truncate text-base font-semibold text-stone-900 dark:text-stone-100">
        {title}
      </h1>

      <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
        <Button
          type="text"
          aria-label="Toggle theme"
          onClick={onToggleTheme}
          icon={
            isDark ? (
              <Sun size={19} strokeWidth={1.8} />
            ) : (
              <Moon size={19} strokeWidth={1.8} />
            )
          }
          className="!flex !h-10 !w-10 !items-center !justify-center !rounded-xl !border !border-stone-200 !bg-white !text-stone-700 transition-all duration-200 hover:!bg-stone-100 dark:!border-stone-700 dark:!bg-stone-900 dark:!text-stone-200 dark:hover:!bg-stone-800"
        />
      </Tooltip>
    </header>
  );
}
