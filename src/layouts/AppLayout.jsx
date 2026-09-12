import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import AppSidebar from '@/components/layout/AppSidebar'
import AppHeader from '@/components/layout/AppHeader'
import Breadcrumbs from '@/components/layout/Breadcrumbs'

export default function AppLayout() {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false)

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <AppSidebar
          open={sidebarOpen}
          collapsed={sidebarCollapsed}
          onClose={() =>
            setSidebarOpen(false)
          }
          onToggleCollapse={() =>
            setSidebarCollapsed(
              (value) => !value,
            )
          }
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader
            onMenuClick={() =>
              setSidebarOpen(true)
            }
            onCollapseClick={() =>
              setSidebarCollapsed(
                (value) => !value,
              )
            }
            sidebarCollapsed={
              sidebarCollapsed
            }
          />

          <main className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
              <Breadcrumbs />

              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}