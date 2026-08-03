"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useTotalUnread } from "@/hooks/use-total-unread";
import { useUnreadNotifications } from "@/hooks/use-unread-notifications";
import {
  Bell,
  Bot,
  Crown,
  GitBranch,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Radio,
  Settings,
  Shield,
  User,
  UserCog,
  Users,
  UsersRound,
  Workflow,
  Zap,
} from "lucide-react";
import type { AccountRole } from "@/lib/auth/roles";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";

const ROLE_CHIP: Record<
  AccountRole,
  { icon: typeof Crown; labelKey: string; className: string }
> = {
  owner: {
    icon: Crown,
    labelKey: "roleOwner",
    className:
      "border-amber-500/40 bg-amber-500/10 text-amber-300",
  },
  admin: {
    icon: Shield,
    labelKey: "roleAdmin",
    className:
      "border-primary/40 bg-primary/10 text-primary",
  },
  agent: {
    icon: UserCog,
    labelKey: "roleAgent",
    className:
      "border-border bg-muted text-foreground",
  },
  viewer: {
    icon: User,
    labelKey: "roleViewer",
    className:
      "border-border bg-card text-muted-foreground",
  },
};

interface NavItem {
  href: string;
  labelKey: string;
  icon: typeof LayoutDashboard;
  beta?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/inbox", labelKey: "inbox", icon: MessageSquare },
  { href: "/notifications", labelKey: "notifications", icon: Bell },
  { href: "/contacts", labelKey: "contacts", icon: Users },
  { href: "/pipelines", labelKey: "pipelines", icon: GitBranch },
  { href: "/broadcasts", labelKey: "broadcasts", icon: Radio },
  { href: "/automations", labelKey: "automations", icon: Zap },
  { href: "/flows", labelKey: "flows", icon: Workflow, beta: true },
  { href: "/agents", labelKey: "aiAgents", icon: Bot },
];

const bottomNavItems = [
  { href: "/settings", labelKey: "settings", icon: Settings },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const { profile, profileLoading, account, accountRole, signOut } = useAuth();
  const totalUnread = useTotalUnread();
  const unreadNotifications = useUnreadNotifications();
  const showAccountStrip =
    !profileLoading &&
    !!account?.name &&
    account.name !== profile?.full_name;

  return (
    <ShadcnSidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border px-4 py-4">
        <Link
          href="/dashboard"
          className="flex w-full items-center justify-start gap-2.5 rounded-lg px-2 py-2 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!w-12 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:gap-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <MessageSquare className="h-4 w-4" />
          </div>
          <span className="truncate text-sm font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
            {t("title")}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup className="space-y-1">
          <SidebarMenu className="gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const showUnreadDot =
                item.href === "/inbox" && totalUnread > 0 && !isActive;
              const showNotificationBadge =
                item.href === "/notifications" && unreadNotifications > 0;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} onClick={() => onClose?.()} />}
                    isActive={isActive}
                    tooltip={t(item.labelKey as string)}
                    className="h-10 w-full justify-start rounded-lg px-3 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!w-12 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!px-2 group-data-[collapsible=icon]:!gap-0"
                  >
                    <item.icon className="h-4 w-4 shrink-0 group-data-[collapsible=icon]:mx-auto" />
                    <span className="text-sm group-data-[collapsible=icon]:hidden">
                      {t(item.labelKey as string)}
                    </span>
                    {item.beta ? (
                      <span
                        aria-label={t("beta")}
                        className="ml-auto rounded-full border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-300 group-data-[collapsible=icon]:hidden"
                      >
                        {t("beta")}
                      </span>
                    ) : null}
                    {showUnreadDot ? (
                      <span
                        aria-label={t("unreadConversations", { count: totalUnread })}
                        className="relative ml-auto flex h-2 w-2 group-data-[collapsible=icon]:hidden"
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                      </span>
                    ) : null}
                    {showNotificationBadge ? (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground group-data-[collapsible=icon]:hidden">
                        {unreadNotifications > 9 ? "9+" : unreadNotifications}
                      </span>
                    ) : null}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-5">
          <SidebarMenu className="gap-1">
            {bottomNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} onClick={() => onClose?.()} />}
                    isActive={isActive}
                    className="h-10 w-full justify-start rounded-lg px-3 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!w-12 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!px-2 group-data-[collapsible=icon]:!gap-0"
                  >
                    <item.icon className="h-4 w-4 shrink-0 group-data-[collapsible=icon]:mx-auto" />
                    <span className="text-sm group-data-[collapsible=icon]:hidden">
                      {t(item.labelKey as string)}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3 pt-4">
        {showAccountStrip && account?.name ? (
          <div className="mb-3 flex items-center gap-2 px-2 text-xs text-muted-foreground">
            <UsersRound className="size-3.5 shrink-0" />
            <span className="truncate" title={account.name}>
              {account.name}
            </span>
            {accountRole ? (
              (() => {
                const meta = ROLE_CHIP[accountRole];
                const Icon = meta.icon;
                return (
                  <span
                    className={`ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${meta.className}`}
                  >
                    <Icon className="size-3" />
                    {t(meta.labelKey as string)}
                  </span>
                );
              })()
            ) : null}
          </div>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-muted/60 focus:bg-muted/60 focus:outline-none data-popup-open:bg-muted/60">
            <Avatar className="size-8 shrink-0">
              {profile?.avatar_url ? (
                <AvatarImage
                  src={profile.avatar_url}
                  alt={profile.full_name ?? t("defaultAvatar")}
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                {profile?.full_name?.charAt(0)?.toUpperCase() ??
                  profile?.email?.charAt(0)?.toUpperCase() ??
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {profile?.full_name ?? t("defaultUser")}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {profile?.email ?? ""}
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="top"
            sideOffset={6}
            className="min-w-56 bg-popover text-popover-foreground ring-border"
          >
            <DropdownMenuItem
              render={
                <Link
                  href="/settings?tab=profile"
                  onClick={onClose}
                  className="text-popover-foreground focus:bg-accent focus:text-accent-foreground"
                />
              }
            >
              <User className="size-4" />
              {t("menuProfile")}
            </DropdownMenuItem>
            <DropdownMenuItem
              render={
                <Link
                  href="/settings?tab=whatsapp"
                  onClick={onClose}
                  className="text-popover-foreground focus:bg-accent focus:text-accent-foreground"
                />
              }
            >
              <Settings className="size-4" />
              {t("menuSettings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={signOut}
              className="text-popover-foreground focus:bg-accent focus:text-accent-foreground"
            >
              <LogOut className="size-4" />
              {t("menuSignOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </ShadcnSidebar>
  );
}
