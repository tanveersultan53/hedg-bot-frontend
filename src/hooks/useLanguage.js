import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const useLanguage = () => {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    document.title = t("APP_TITLE");
  }, [i18n.language, t]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  return { language: i18n.language, changeLanguage };
};

export default useLanguage;
