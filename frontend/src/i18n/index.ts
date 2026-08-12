import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/en"
import hi from "./locales/hi"
import te from "./locales/te"
import ta from "./locales/ta"
import bn from "./locales/bn"
import mr from "./locales/mr"
import kn from "./locales/kn"
import ml from "./locales/ml"
import gu from "./locales/gu"

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      hi,
      te,
      ta,
      bn,
      mr,
      kn,
      ml,
      gu,
    },

    lng: "en",

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n