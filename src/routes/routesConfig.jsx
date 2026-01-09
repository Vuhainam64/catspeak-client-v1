import { AdminLayout, MainLayout, UserLayout, VideoCallLayout } from "@layouts"
import { PageNotFound, ForbiddenPage } from "@pages/ErrorPage"
import {
  LandingPage,
  PolicyPage,
  HomePage,
  VideoCallRoom,
  LoginPage,
  RegisterPage,
  RoomDetailPage,
  QueuePage,
  ComingSoonPage,
  RoomsPage,
  CatSpeakPage,
} from "@pages/Guest"
import { UserDashboard, UserProfile, UserSetting } from "@pages/User"
import { AdminPage } from "@pages/Admin"

import { Navigate } from "react-router-dom"
import useAuth from "@hooks/useAuth"
import AuthGuard from "@components/Guards/AuthGuard"
import GuestGuard from "@components/Guards/GuestGuard"

const RootRoute = () => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && user?.roleName === "Admin") {
    return <Navigate to="/admin" replace />
  }

  return <HomePage />
}

const routesConfig = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <RootRoute />,
      },
      {
        path: "community",
        element: <RoomsPage />,
      },
      {
        path: "cat-speak",
        element: <CatSpeakPage />,
      },
      {
        path: "room/:id",
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
        element: (
          <AuthGuard>
            <VideoCallRoom />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: "/policy",
    element: <PolicyPage />,
  },
  {
    path: "/app",
    element: (
      <AuthGuard>
        <UserLayout />
      </AuthGuard>
    ),
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
    element: (
      <AuthGuard allowedRoles={["Admin"]}>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
    ],
  },
  {
    path: "/queue",
    element: (
      <AuthGuard>
        <QueuePage />
      </AuthGuard>
    ),
  },
  {
    path: "/cart",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ComingSoonPage />,
      },
    ],
  },
  {
    path: "/connect",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ComingSoonPage />,
      },
    ],
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
