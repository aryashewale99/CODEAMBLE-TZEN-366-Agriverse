import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en, { TranslationKeys } from './en';
import as from './as';
import bn from './bn';
import brx from './brx';
import doi from './doi';
import gu from './gu';
import hi from './hi';
import kn from './kn';
import ks from './ks';
import kok from './kok';
import mai from './mai';
import ml from './ml';
import mni from './mni';
import mr from './mr';
import ne from './ne';
import or from './or';
import pa from './pa';
import sa from './sa';
import sat from './sat';
import sd from './sd';
import ta from './ta';
import te from './te';
import ur from './ur';

const STORAGE_KEY = '@agriverse_app_language';

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  isRTL?: boolean;
  voiceLocale: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', voiceLocale: 'en-US' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', voiceLocale: 'hi-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', voiceLocale: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', voiceLocale: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', voiceLocale: 'gu-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', voiceLocale: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', voiceLocale: 'te-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', voiceLocale: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', voiceLocale: 'ml-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', voiceLocale: 'pa-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', voiceLocale: 'or-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', voiceLocale: 'as-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', isRTL: true, voiceLocale: 'ur-IN' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', voiceLocale: 'ne-NP' },
  { code: 'brx', name: 'Bodo', nativeName: "बर'", voiceLocale: 'hi-IN' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', voiceLocale: 'hi-IN' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर / كأشُر', isRTL: true, voiceLocale: 'ks-IN' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', voiceLocale: 'kok-IN' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', voiceLocale: 'hi-IN' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মইतै', voiceLocale: 'mni-IN' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', voiceLocale: 'sa-IN' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', voiceLocale: 'sat-IN' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', isRTL: true, voiceLocale: 'sd-IN' },
];

const translations: Record<string, Partial<TranslationKeys>> = {
  en,
  hi,
  mr,
  bn,
  gu,
  ta,
  te,
  kn,
  ml,
  pa,
  or,
  as,
  ur,
  ne,
  brx,
  doi,
  ks,
  kok,
  mai,
  mni,
  sa,
  sat,
  sd,
};

interface I18nContextType {
  language: string;
  setLanguage: (code: string) => Promise<void>;
  t: (key: keyof TranslationKeys, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  supportedLanguages: LanguageInfo[];
  currentLanguageInfo: LanguageInfo;
  voiceLocale: string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en');

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedLang && translations[savedLang]) {
          setLanguageState(savedLang);
          const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === savedLang);
          if (langMeta?.isRTL !== I18nManager.isRTL) {
            I18nManager.allowRTL(!!langMeta?.isRTL);
            I18nManager.forceRTL(!!langMeta?.isRTL);
          }
        }
      } catch (err) {
        console.error('Failed to load saved language:', err);
      }
    };
    loadSavedLanguage();
  }, []);

  const changeLanguage = async (code: string) => {
    if (!translations[code]) return;
    try {
      setLanguageState(code);
      await AsyncStorage.setItem(STORAGE_KEY, code);
      const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === code);
      const shouldRTL = !!langMeta?.isRTL;
      if (I18nManager.isRTL !== shouldRTL) {
        I18nManager.allowRTL(shouldRTL);
        I18nManager.forceRTL(shouldRTL);
      }
    } catch (err) {
      console.error('Failed to save language choice:', err);
    }
  };

  const currentLanguageInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (key: keyof TranslationKeys, params?: Record<string, string | number>): string => {
    const langDict = translations[language];
    let val = langDict ? langDict[key] : undefined;

    if (!val) {
      val = en[key] || (key as string);
    }

    if (params) {
      Object.keys(params).forEach((p) => {
        val = val!.replace(new RegExp(`{${p}}`, 'g'), String(params[p]));
      });
    }

    return val!;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
        isRTL: !!currentLanguageInfo.isRTL,
        supportedLanguages: SUPPORTED_LANGUAGES,
        currentLanguageInfo,
        voiceLocale: currentLanguageInfo.voiceLocale,
      }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    const fallbackLang = SUPPORTED_LANGUAGES[0];
    return {
      language: 'en',
      setLanguage: async () => {},
      t: (key) => en[key] || (key as string),
      isRTL: false,
      supportedLanguages: SUPPORTED_LANGUAGES,
      currentLanguageInfo: fallbackLang,
      voiceLocale: fallbackLang.voiceLocale,
    };
  }
  return context;
};

export const useI18n = useTranslation;
export default useTranslation;
