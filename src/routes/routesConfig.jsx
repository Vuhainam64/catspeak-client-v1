import { AdminLayout, MainLayout, UserLayout, VideoCallLayout } from "@layouts"
import { PageNotFound, ForbiddenPage } from "@pages/ErrorPage"
import {
  HomePage,
  PolicyPage,
  RoomsPage,
  VideoCallRoom,
  LoginPage,
  RegisterPage,
  RoomDetailPage,
  QueuePage,
} from "@pages/Guest"
import { UserDashboard, UserProfile, UserSetting } from "@pages/User"
import { AdminPage } from "@pages/Admin"

import GuestGuard from "@components/Guards/GuestGuard"

const routesConfig = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "rooms",
        element: <RoomsPage />,
      },
    ],
  },
  {
    path: "/room",
    element: <MainLayout />,
    children: [
      {
        path: ":id",
        element: <RoomDetailPage />,
      },
    ],
  },
  {
    path: "/meet",
    element: <VideoCallLayout />,
    children: [
      {
        path: ":id",
        element: <VideoCallRoom />,
      },
    ],
  },
  {
    path: "/policy",
    element: <PolicyPage />,
  },
  {
    path: "/app",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
      {
        path: "setting",
        element: <UserSetting />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
    ],
  },
  {
    path: "/queue",
    element: <QueuePage />,
  },
  {
    path: "/login",
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestGuard>
        <RegisterPage />
      </GuestGuard>
    ),
  },
  {
    path: "/403",
    element: <ForbiddenPage />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]

export default routesConfig
