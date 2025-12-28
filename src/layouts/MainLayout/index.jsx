import { useState } from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import FooterBar from "./FooterBar";
import Auth from "@components/Auth";
import MessageWidget from "@/components/messages/MessageWidget";

const { Content } = Layout;

const MainLayout = () => {
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: "login",
  });

  const openAuthModal = (mode = "login") =>
    setAuthModal({
      isOpen: true,
      mode,
    });

  const closeAuthModal = () =>
    setAuthModal((prev) => ({
      ...prev,
      isOpen: false,
    }));

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout
      className="flex justify-center bg-white"
    >
      {/* Header full width */}
      <HeaderBar onGetStarted={() => openAuthModal("login")} />

      <Content className="w-full flex justify-center">
        <Outlet />
      </Content>

      {/* Footer full width (bên trong tự giới hạn 1200px) */}
      <FooterBar />

      <Auth
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={closeAuthModal}
        onSwitchMode={openAuthModal}
      />

      {/* Floating message bubble, hiển thị trên mọi trang */}
      <MessageWidget />
    </Layout>
  );
};

export default MainLayout;
