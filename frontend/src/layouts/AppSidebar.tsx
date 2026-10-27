
import { useThemedLayoutContext } from "@refinedev/antd";
import { useMenu } from "@refinedev/core";
import { Grid } from "antd";
import {
  BookOpen,
  ClipboardList,
  X,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { NavLink } from "react-router";

export default function AppSidebar() {
  const { menuItems } = useMenu();

  const {
    siderCollapsed,
    setSiderCollapsed,
    mobileSiderOpen,
    setMobileSiderOpen,
  } = useThemedLayoutContext();

  const screens = Grid.useBreakpoint();
  const isDesktop = Boolean(screens.lg);

  const closeMobileSidebar = () => setMobileSiderOpen(false);

  const navigation = (
    <nav className="flex flex-col gap-1 px-3 py-5">
      {menuItems.map((item) => (
        <NavLink
          key={item.key}
          to={item.route ?? "/"}
          end
          onClick={closeMobileSidebar}
          title={
            siderCollapsed && isDesktop
              ? String(item.label ?? item.name)
              : undefined
          }
          className={({ isActive }) =>
            [
              "group flex min-h-11 items-center gap-3 rounded-xl px-3",
              "text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-stone-900 text-white shadow-sm dark:bg-stone-100 dark:text-stone-900"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white",
              siderCollapsed && isDesktop ? "justify-center px-0" : "",
            ].join(" ")
          }
        >
          {item.name === "assignments" ? (
            <ClipboardList size={19} className="shrink-0" />
          ) : (
            <BookOpen size={19} className="shrink-0" />
          )}

          {(!siderCollapsed || !isDesktop) && (
            <span className="truncate">{item.label ?? item.name}</span>
          )}
        </NavLink>
      ))}
    </nav>
  );

  // Mobile: hamburger when closed, overlay drawer when open.
  if (!isDesktop) {
    if (!mobileSiderOpen) {
      return (
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setMobileSiderOpen(true)}
          className="fixed left-3 top-3 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:bg-stone-100 active:scale-95 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800"
        >
          <Menu size={20} />
        </button>
      );
    }

    return (
      <div className="fixed inset-0 z-50">
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={closeMobileSidebar}
          className="absolute inset-0 bg-stone-950/40 backdrop-blur-[2px]"
        />

        <aside className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col border-r border-stone-200 bg-[#fcfbf8] shadow-2xl dark:border-stone-800 dark:bg-stone-950">
          <div className="flex h-16 items-center justify-between border-b border-stone-200 px-5 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
                <BookOpen size={19} />
              </div>

              <div>
                <p className="m-0 text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Classroom
                </p>
                <p className="m-0 text-xs text-stone-500">
                  Academic workspace
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close navigation"
              onClick={closeMobileSidebar}
              className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white"
            >
              <X size={19} />
            </button>
          </div>

          {navigation}

          <div className="mt-auto border-t border-stone-200 px-5 py-4 text-xs text-stone-500 dark:border-stone-800">
            Built for better learning.
          </div>
        </aside>
      </div>
    );
  }

  // Desktop: custom collapsible sidebar.
  return (
    <aside
      className={[
        "flex min-h-screen shrink-0 flex-col border-r",
        "border-stone-200 bg-[#fcfbf8] dark:border-stone-800 dark:bg-stone-950",
        "transition-[width] duration-200 ease-out",
        siderCollapsed ? "w-[76px]" : "w-[252px]",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-16 items-center gap-3 border-b border-stone-200 px-4 dark:border-stone-800",
          siderCollapsed ? "justify-center px-0" : "justify-between",
        ].join(" ")}
      >
        {!siderCollapsed && (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
              <BookOpen size={19} />
            </div>

            <div className="min-w-0">
              <p className="m-0 truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                Classroom
              </p>
              <p className="m-0 text-xs text-stone-500">
                Academic workspace
              </p>
            </div>
          </div>
        )}

        {siderCollapsed && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
            <BookOpen size={19} />
          </div>
        )}

        <button
          type="button"
          aria-label={siderCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={siderCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setSiderCollapsed(!siderCollapsed)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 hover:text-stone-950 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
        >
          {siderCollapsed ? (
            <PanelLeftOpen size={19} strokeWidth={1.7} />
          ) : (
            <PanelLeftClose size={19} strokeWidth={1.7} />
          )}
        </button>
      </div>

      {!siderCollapsed && (
        <p className="px-5 pb-1 pt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
          Workspace
        </p>
      )}

      {navigation}

      <div className="mt-auto border-t border-stone-200 px-4 py-4 dark:border-stone-800">
        {!siderCollapsed && (
          <p className="m-0 text-xs text-stone-500">
            Built for better learning.
          </p>
        )}
      </div>
    </aside>
  );
}
