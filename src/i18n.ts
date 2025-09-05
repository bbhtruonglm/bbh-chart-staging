import LanguageDetector from 'i18next-browser-languagedetector'
import { en } from './lang/en'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { ja } from './lang/ja'
import { ko } from './lang/ko'
import { th } from './lang/th'
import { vn } from './lang/vn'
import { zh } from './lang/zh'

/** Cấu hình i18next */
i18n
  /** Sử dụng LanguageDetector để lấy ngôn ngữ từ URL */
  .use(LanguageDetector)
  /** Kết nối với React */
  .use(initReactI18next)
  .init({
    /** Sử dụng bản dịch từ mã nguồn */
    resources: {
      en: en,
      us: en,
      vi: vn,
      vn: vn,
      th: th,
      ja: ja,
      cn: zh,
      zh: zh,
      ko: ko,
      kr: ko,
    },
    /** Ngôn ngữ dự phòng là 'en' nếu không tìm thấy ngôn ngữ khác */
    fallbackLng: 'en',
    interpolation: {
      /** React đã xử lý việc escape XSS */
      escapeValue: false,
    },
    detection: {
      /** Cấu hình lấy ngôn ngữ từ URL (query parameter) */
      /** Chỉ lấy từ URL và localStorage */
      order: ['querystring', 'localStorage', 'navigator'],
      /** Query string để lấy ngôn ngữ, ví dụ: ?locale=vi */
      lookupQuerystring: 'locale',

      /**  Custom logic: Hợp nhất các giá trị 'vn' và 'vi' thành 'vi'*/
      /** Hợp nhất các giá trị 'vn' và 'vi' thành 'vi' */
      lookupFromPathIndex: 0,
      //   checkWhitelist: true,
    },
    /** Chỉ chấp nhận 'en' và 'vi' */
    // allowedLngs: ['en', 'vi', 'us', 'vn'],
  })

export default i18n
