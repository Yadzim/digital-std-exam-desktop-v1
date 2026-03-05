import { Modal } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "store/services";

const useCheckVersion = () => {
  const { t } = useTranslation();
  const { version } = useAppSelector((p) => p.ui);
  const { user, isAuthenticated } = useAppSelector((p) => p.auth);

  const config = {
    title: t("Yangi versiya!"),
    content: t("Tizimda yangilanish bor. Iltimos yangilang."),
    okText: t("Yangilash"),
    onOk: async function () {
      window.location.reload();
    },
  };

  useEffect(() => {
    if (isAuthenticated) {
      user.version !== version && Modal.info(config);
    }
  }, [isAuthenticated]);
};

export default useCheckVersion;
