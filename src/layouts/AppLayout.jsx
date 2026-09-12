import { Outlet } from 'react-router-dom'
import { useState } from 'react'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          collapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            onMenuClick={() =>
              setSidebarOpen(true)
            }
            onCollapseClick={() =>
              setSidebarCollapsed(
                (value) => !value,
              )
            }
            sidebarCollapsed={sidebarCollapsed}
          />

          <main className="min-w-0 flex-1 overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}