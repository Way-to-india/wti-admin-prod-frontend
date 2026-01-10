'use client';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  IconBell,
  IconBook,
  IconBuildingSkyscraper,
  IconCar,
  IconClipboardList,
  IconDashboard,
  IconMap2,
  IconMapPin,
  IconPhoto,
  IconSettings,
  IconTicket,
  IconUsers,
} from '@tabler/icons-react';
import Link from 'next/link';
import * as React from 'react';

const data = {
  user: {
    name: 'Admin User',
    email: 'admin@waytoindia.com',
    avatar: '/logo.png',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Notifications',
      url: '/dashboard/notifications',
      icon: IconBell,
    },
    {
      title: 'Admins',
      url: '/dashboard/admins',
      icon: IconUsers,
    },
  ],
  navModules: [
    {
      title: 'Tours',
      icon: IconMap2,
      url: '/dashboard/tours',
    },
    {
      title: 'Travel Guide',
      icon: IconBook,
      url: '/dashboard/travel-guide',
    },
    {
      title: 'Destinations',
      icon: IconMapPin,
      url: '/dashboard/destinations',
    },
    {
      title: 'Hero Slides',
      icon: IconPhoto,
      url: '/dashboard/hero-slides',
    },
  ],
  navCRM: [
    {
      title: 'Dashboard',
      url: '/dashboard/crm',
      icon: IconDashboard,
    },
    {
      title: 'All Leads',
      url: '/dashboard/crm/leads',
      icon: IconClipboardList,
    },
    {
      title: 'Follow-ups',
      url: '/dashboard/crm/follow-ups',
      icon: IconBell,
    },
    {
      title: 'Analytics',
      url: '/dashboard/crm/analytics',
      icon: IconTicket,
    },
  ],
  navLeads: [
    {
      title: 'Tour Leads',
      url: '/dashboard/leads/tours',
      icon: IconTicket,
    },
    {
      title: 'Hotel Leads',
      url: '/dashboard/leads/hotels',
      icon: IconBuildingSkyscraper,
    },
    {
      title: 'Transportation Leads',
      url: '/dashboard/leads/transportation',
      icon: IconCar,
    },
  ],
  navUsers: [
    {
      title: 'Users',
      url: '/dashboard/users',
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r" collapsible="offcanvas" {...props}>
      <ScrollArea className="h-174">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
                <Link href="/">
                  <IconMap2 className="size-5!" />
                  <span className="text-base font-semibold">WayToIndia</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <SidebarGroup>
            <SidebarGroupLabel>Modules</SidebarGroupLabel>
            <SidebarGroupContent>
              <NavMain items={data.navModules} />
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>CRM</SidebarGroupLabel>
            <SidebarGroupContent>
              <NavMain items={data.navCRM} />
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Users</SidebarGroupLabel>
            <SidebarGroupContent>
              <NavMain items={data.navUsers} />
            </SidebarGroupContent>
          </SidebarGroup>
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </ScrollArea>
    </Sidebar>
  );
}
