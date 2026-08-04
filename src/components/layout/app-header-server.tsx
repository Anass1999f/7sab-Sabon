import { getSettings, getNotifications, getYears } from "@/src/lib/actions"
import { markNotificationRead, markAllNotificationsRead, deleteNotification, updateSettings } from "@/src/lib/actions"
import { AppHeader } from "./app-header"

export async function AppHeaderServer() {
  const [settings, notifications, years] = await Promise.all([
    getSettings(),
    getNotifications(),
    getYears(),
  ])

  return (
    <AppHeader
      notifications={notifications}
      currentYear={(settings as any).currentYear || new Date().getFullYear()}
      availableYears={years}
      onMarkRead={markNotificationRead}
      onMarkAllRead={markAllNotificationsRead}
      onDeleteNotification={deleteNotification}
      onYearChange={async (year) => {
        "use server"
        await updateSettings({ currentYear: year })
      }}
    />
  )
}