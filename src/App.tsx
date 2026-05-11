import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as htmlToImage from 'html-to-image';
import gifshot from 'gifshot';

// --- INLINE SVG ICON COMPONENTS ---
const VolumeIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const SettingsIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ChevronLeft = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const AccessibilityIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="16" cy="4" r="1" />
    <path d="m18 19 1-7-6 1" />
    <path d="m5 8 3-3 5.5 3-2.36 3.5" />
    <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
    <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
  </svg>
);

const LanguagesIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);

const StopIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
  </svg>
);

const PlayIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const PauseIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const CopyIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

const ShareIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>
  </svg>
);

const EyeIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const SunIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const MoonIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

const HeadphonesIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);

const MessageCircleIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
  </svg>
);

const BookmarkIcon = ({ size = 24, className = "", filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
  </svg>
);

const SearchIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const XIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

const DownloadIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
  </svg>
);

const ImageIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);

const TypeIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
  </svg>
);

const CheckIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const MusicIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
);

// --- AUDIO SOURCES ---
const AUDIO_SOURCES = [
  { 
    id: 'all', 
    title: 'Full Pagi & Petang', 
    url: 'https://raw.githubusercontent.com/klik2x/Med/d6a0ded864c16c621fc52c59089c0fff6aeead63/Dizkir%20Pagi-Petang.mp3' 
  },
  { 
    id: 'pagi-mishaari', 
    title: 'Dzikir Pagi (Mishaari)', 
    url: 'https://raw.githubusercontent.com/klik2x/Med/04ce4bf94171f18fff2dc180fa6ad1bd3d883b52/Doa%26Dzikir_Pagi.mp3' 
  },
  { 
    id: 'petang-mishaari', 
    title: 'Dzikir Petang (Mishaari)', 
    url: 'https://raw.githubusercontent.com/klik2x/Med/5471ae4830fb86af049cc039cf278d4b678dc26c/Doa%26Dzikir_Petang-SoreHari.mp3' 
  }
];

// --- DICTIONARY & UI STRINGS ---
const uiDict = {
  id: {
    pagi: "Dzikir Pagi",
    petang: "Dzikir Petang",
    next: "Next",
    prev: "Prev",
    a11yMode: "Aksesibilitas Ekstrem",
    theme: "Tema",
    light: "Terang",
    dark: "Gelap",
    showLatin: "Tampilkan Latin",
    hideLatin: "Sembunyikan Latin",
    listen: "Putar Suara",
    stop: "Berhenti",
    pause: "Jeda",
    resume: "Lanjut Suara",
    visualIndicator: "Suara diputar...",
    source: "Sumber",
    repeat: "Kali",
    footnote: "Catatan Kaki",
    arabicSize: "Ukuran Teks Arab",
    uiSize: "Ukuran Teks Latin & Arti",
    copy: "Salin",
    share: "Bagikan",
    copied: "Berhasil disalin!",
    readTranslation: "Baca Arti",
    translateNote: "Terjemahkan Catatan",
    volume: "Volume",
    progress: "Kemajuan",
    search: "Cari dzikir...",
    bookmarks: "Penyimpanan Jeda / Bookmark",
    noResults: "Dzikir tidak ditemukan",
    lineSpacing: "Jarak Baris Kalimat",
    contrast: "Mode Kontras",
    normal: "Standar",
    high: "Tinggi",
    ultra: "Maksimal",
    install: "Pasang Aplikasi",
    contactUs: "Contact us 💌",
    devBy: "Development by Te_eR™ Inovative",
    selectLang: "Bahasa Terjemahan",
    translating: "Menerjemahkan...",
    shareAs: "Bagikan Sebagai",
    asImage: "Gambar",
    asText: "Teks",
    preparing: "Menyiapkan...",
    shareLabel: "share via Doa Dzikir by Te_eR™ Inovative",
    audioPlayer: "Pemutar Audio",
    chooseAudio: "Pilih Audio Dzikir",
    playing: "Memutar",
    paused: "Berhenti Sejenak",
    playbackSpeed: "Kecepatan Baca",
    fontStyle: "Gaya Tulisan",
    dyslexicFont: "Ramah Disleksia",
    standardFont: "Standar",
    reportIssue: "Lapor Masalah",
    feedbackSent: "Terima kasih atas masukan Anda!",
    feedbackTitle: "Masukan Terjemahan",
    feedbackPlaceholder: "Jelaskan kesalahan atau saran perbaikan...",
    submit: "Kirim",
    cancel: "Batal",
    feedback: "Masukan",
    shareGif: "GIF (Animasi)",
    showNav: "Tampilkan Navigasi",
    hideNav: "Sembunyikan Navigasi",
  },
  en: {
    pagi: "Morning Dzikir",
    petang: "Evening Dzikir",
    next: "Next",
    prev: "Prev",
    a11yMode: "Extreme Accessibility",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    showLatin: "Show Latin",
    hideLatin: "Hide Latin",
    listen: "Listen",
    stop: "Stop",
    pause: "Pause",
    resume: "Resume",
    visualIndicator: "Speaking...",
    source: "Source",
    repeat: "Times",
    footnote: "Footnote",
    arabicSize: "Arabic Font Size",
    uiSize: "UI Font Size",
    copy: "Copy",
    share: "Share",
    copied: "Copied to clipboard!",
    readTranslation: "Read Translation",
    translateNote: "Translate Note",
    volume: "Volume",
    progress: "Progress",
    search: "Search dzikir...",
    bookmarks: "Saved Position / Bookmarks",
    noResults: "No dzikir found",
    lineSpacing: "Line Spacing",
    contrast: "Contrast Mode",
    normal: "Normal",
    high: "High",
    ultra: "Extreme",
    install: "Install App",
    contactUs: "Contact us 💌",
    devBy: "Development by Te_eR™ Inovative",
    selectLang: "Translation Language",
    translating: "Translating...",
    shareAs: "Share As",
    asImage: "Image",
    asText: "Text",
    preparing: "Preparing...",
    shareLabel: "share via Doa Dzikir by Te_eR™ Inovative",
    audioPlayer: "Audio Player",
    chooseAudio: "Choose Audio",
    playing: "Playing",
    paused: "Paused",
    playbackSpeed: "Playback Speed",
    fontStyle: "Font Style",
    dyslexicFont: "Dyslexia Friendly",
    standardFont: "Standard",
    reportIssue: "Report Issue",
    feedbackSent: "Thank you for your feedback!",
    feedbackTitle: "Translation Feedback",
    feedbackPlaceholder: "Describe the error or suggest an improvement...",
    submit: "Submit",
    cancel: "Cancel",
    feedback: "Feedback",
    shareGif: "GIF (Animated)",
    showNav: "Show Navigation",
    hideNav: "Hide Navigation",
  }
};

  const LANGUAGES = [
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'uz', name: 'Oʻzbekcha', flag: '🇺🇿' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  ];


// --- DATASET: DZIKIR PAGI ---
const pagiData = [
  {
    id: 0,
    title: "Membaca Ta'awwudz",
    arabic: "أَعُوْذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيْمِ",
    latin: "A'udzu billahi minash-shaytanir-rajim",
    translation: "Aku berlindung kepada Allah dari godaan setan yang terkutuk.",
    source: "Al-Qur'an",
    repeat: 1,
    note: "Membaca Ta'awwudz sebelum memulai dzikir."
  },
  {
    id: 1,
    title: "Membaca Ayat Kursi",
    arabic: "ٱللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ، لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَالْعَلِيُّ الْعَظِيمُ",
    latin: "Allahu laaa ilaaha illaa huwal hayyul qaiyoom; Laa taakhudzuhu sinatunw wa laa naum, lahu maa fissamaawaati wa maa fil ard; man zal ladzi yashfa'u indahuu illaa bi-iznih; ya'lamu maa bauna aiydeehim wa maa khalfahum, wa laa yuheetuna bishai'im min 'ilmihee illaa bimaa shaa'a, wasi'a kursiyyuhus samaawati wal arda wa laa ya'ooduho hifzuhumaa; wa Huwal Aliyyul 'Azeem",
    translation: "“Allah tidak ada Ilah (yang berhak diibadahi) melainkan Dia Yang Hidup Kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang ada di langit dan di bumi. Tidak ada yang dapat memberi syafa’at di sisi Allah tanpa izin-Nya. Allah mengetahui apa-apa yang (berada) dihadapan mereka, dan dibelakang mereka dan mereka tidak mengetahui apa-apa dari Ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, Allah Maha Tinggi lagi Mahabesar.” (QS Al-Baqarah: 255).",
    source: "QS. Al-Baqarah: 255",
    repeat: 1,
    note: "Barangsiapa yang membaca ayat ini ketika pagi hari, maka ia dilindungi dari (gangguan) jin hingga sore hari."
  },
  {
    id: 2,
    title: "Membaca Surat Al-Ikhlas",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ. اللَّهُ الصَّمَدُ. لَمْ يَلِدْ وَلَمْ يُولَدْ. وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    latin: "Bismillahirrahmanirrahim. Qul huwallahu ahad. Allahus somad. Lam yalid walam yulad. Walam yakun lahu kufuwan ahad.",
    translation: "“Katakanlah, ‘Dia-lah Allah Yang Maha Esa. Allah adalah (Rabb) yang segala sesuatu bergantung kepada-Nya. Dia tidak beranak dan tidak pula diperanakkan. Dan tidak ada seorang pun yang setara dengan-Nya.’” (QS. Al-Ikhlas : 1-4).",
    source: "QS. Al-Ikhlas: 1-4",
    repeat: 3,
    note: "Membaca 3 surat ini (Al-Ikhlas, Al-Falaq, An-Naas) setiap pagi dan sore hari cukup baginya dari segala sesuatu."
  },
  {
    id: 3,
    title: "Membaca Surat Al-Falaq",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ. مِن شَرِّ مَا خَلَقَ. وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ. وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ. وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    latin: "Bismillahirrahmanirrahim. Qul a'ụżdu birabbil-falaq. min syarri mā khalaq. wa min syarri gāsiqin iżā waqab. wa min syarrin-naffāṡāti fil-'uqad. wa min syarri ḥāsidin iżā ḥasad.",
    translation: "Katakanlah, “Aku berlindung kepada Tuhan yang menguasai subuh (fajar). dari kejahatan (makhluk yang) Dia ciptakan, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya), dan dari kejahatan orang yang dengki apabila dia dengki.” (QS. Al-Falaq: 1-5).",
    source: "QS. Al-Falaq: 1-5",
    repeat: 3,
    note: "Ibid."
  },
  {
    id: 4,
    title: "Membaca Surat An-Naas",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ. مَلِكِ النَّاسِ. إِلَهِ النَّاسِ. مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ. الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ. مِنَ الْجِنَّةِ وَ النَّاسِ",
    latin: "Bismillahirrahmanirrahim. Qul auzubirabbinnas malikinas illahinas minsyarril Waswasil khannas alladzi yuwaswisu fi sudurinas minal jinnati wannas.",
    translation: "”Katakanlah, ‘Aku berlindung kepada Rabb (yang memelihara dan menguasai) manusia. Raja manusia. Sembahan (Ilah) manusia. Dari kejahatan (bisikan) syaitan yang biasa bersembunyi. Yang membisikkan (kejahatan) ke dalam dada-dada manusia. Dari golongan jin dan manusia.’” (QS. An-Naas: 1-6).",
    source: "QS. An-Naas: 1-6",
    repeat: 3,
    note: "Ibid."
  },
  {
    id: 5,
    title: "Membaca Doa Perlindungan (Pagi)",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِيْ هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوْذُ بِكَ مِنْ شَرِّ مَا فِيْ هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوْذُ بِكَ مِنَ الْكَسَلِ وَسُوْءِ الْكِبَرِ، رَبِّ أَعُوْذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
    latin: "Ash-bahnaa wa ash-bahal mulku lillah walhamdulillah, laa ilaha illallah wahdahu laa syarika lah, lahul mulku walahul hamdu wa huwa ‘ala kulli syai-in qodir. Robbi as-aluka khoiro maa fii hadzal yaum wa khoiro maa ba’dahu, wa a’udzu bika min syarri maa fii hadzal yaum wa syarri maa ba’dahu. Robbi a’udzu bika minal kasali wa su-il kibar. Robbi a’udzu bika min ‘adzabin fin naari wa ‘adzabin fil qobri.",
    translation: "”Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji hanya milik Allah. Tidak ada ilah yang berhak diibadahi dengan benar kecuali Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya pujian. Dia-lah Yang Mahakuasa atas segala sesuatu. Wahai Rabb, aku mohon kepada-Mu kebaikan di hari ini dan kebaikan sesudahnya. Aku berlindung kepada-Mu dari kejahatan hari ini dan kejahatan sesudahnya. Wahai Rabb, aku berlindung kepada-Mu dari kemalasan dan kejelekan di hari tua. Wahai Rabb, aku berlindung kepada-Mu dari siksaan di Neraka dan siksaan di kubur.”",
    source: "HR. Muslim no. 2723",
    repeat: 1,
    note: "Doa memohon kebaikan hari ini dan perlindungan dari kejahatan serta adzab."
  },
  {
    id: 6,
    title: "Membaca Doa Perlindungan",
    arabic: "اَللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوْتُ وَإِلَيْكَ النُّشُوْرُ",
    latin: "Allahumma bika ash-bahnaa wa bika amsaynaa wa bika nahyaa wa bika namuutu wa ilaikan nusyuur.",
    translation: "“Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu sore. Dengan rahmat dan kehendak-Mu kami hidup dan dengan rahmat dan kehendak-Mu kami mati. Dan kepada-Mu kebangkitan.”",
    source: "HR. Al-Bukhari",
    repeat: 1,
    note: "Doa perlindungan di pagi hari."
  },
  {
    id: 7,
    title: "Membaca Sayyidul Istighfar",
    arabic: "اَللَّهُمَّ أَنْتَ رَبِّيْ لاَ إِلَـهَ إِلاَّ أَنْتَ، خَلَقْتَنِيْ وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوْبَ إِلاَّ أَنْتَ",
    latin: "Allahumma anta robbii laa ilaha illa anta, kholaq-tanii wa anaa ‘abduka, wa anaa ‘alaa ‘ahdika wa wa’dika mas-tatho’tu. A’udzu bika min syarri maa shona’tu, abuu-u laka bi ni’matika ‘alayya, wa abuu-u bi dzanbii fagh-fir lii fa-innahu laa yagh-firudz dzunuuba illa anta.",
    translation: "“Ya Allah, Engkau adalah Rabbku, tidak ada Ilah yang berhak diibadahi dengan benar kecuali Engkau. Engkau-lah yang menciptakanku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku dengan-Mu semampuku. Aku berlindung kepada-Mu dari kejelekan yang kuperbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku, oleh karena itu, ampunilah aku. Sesungguhnya tiada yang dapat mengampuni dosa kecuali Engkau.”",
    source: "HR. Al-Bukhari no. 6306",
    repeat: 1,
    note: "Barangsiapa membacanya di pagi hari dengan penuh keyakinan lalu dia mati di hari itu sebelum sore hari, maka dia termasuk penghuni surga."
  },
  {
    id: 8,
    title: "Membaca Doa Keselamatan Tubuh",
    arabic: "اَللَّهُمَّ عَافِنِيْ فِيْ بَدَنِيْ، اَللَّهُمَّ عَافِنِيْ فِيْ سَمْعِيْ، اَللَّهُمَّ عَافِنِيْ فِيْ بَصَرِيْ، لاَ إِلَـهَ إِلاَّ أَنْتَ. اَللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوْذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَـهَ إِلاَّ أَنْتَ",
    latin: "Allahumma afini fi badani. Allahumma afiini fi sami. Allahumma afiini fi bashari La ilaha illa ant. Allahumma inni auzubika minal kufri wal faqr, wa'azubika min adzabil qabr. La ilaha illa ant.",
    translation: "“Ya Allah, selamatkanlah tubuhku. Ya Allah, selamatkanlah pendengaranku. Ya Allah, selamatkanlah penglihatanku, tidak ada Ilah kecuali Engkau. Ya Allah, sesungguhnya aku berlindung kepada-Mu dari kekufuran dan kefakiran. Aku berlindung kepada-Mu dari siksa kubur, tidak ada Ilah kecuali Engkau.”",
    source: "HR. Abu Dawud no. 5090",
    repeat: 3,
    note: "Memohon perlindungan dari kekufuran, kefakiran, dan siksa kubur."
  },
  {
    id: 9,
    title: "Membaca Doa Keselamatan (Affiat)",
    arabic: "اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَاْلآخِرَةِ، اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِيْنِيْ وَدُنْيَايَ وَأَهْلِيْ وَمَالِيْ اللَّهُمَّ اسْتُرْ عَوْرَاتِى وَآمِنْ رَوْعَاتِى. اَللَّهُمَّ احْفَظْنِيْ مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِيْ، وَعَنْ يَمِيْنِيْ وَعَنْ شِمَالِيْ، وَمِنْ فَوْقِيْ، وَأَعُوْذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِيْ",
    latin: "Allahumma innii as-alukal ‘afwa wal ‘aafiyah fid dunyaa wal aakhiroh. Allahumma innii as-alukal ‘afwa wal ‘aafiyah fii diinii wa dun-yaya wa ahlii wa maalii. Allahumas-tur ‘awrootii wa aamin row’aatii. Allahumah fadni min bayni yadayya wa min kholfii wa ‘an yamiinii wa ‘an syimaalii wa min fawqii wa a’udzu bi ‘azhomatik an ughtala min tahtii.",
    translation: "“Ya Allah, sesungguhnya aku memohon kebajikan dan keselamatan di dunia dan akhirat. Ya Allah, sesungguhnya aku memohon kebajikan dan keselamatan dalam agama, dunia, keluarga dan hartaku. Ya Allah, tutupilah auratku (aib) dan tentramkan-lah aku dari rasa takut. Ya Allah, peliharalah aku dari depan, belakang, kanan, kiri dan dari atasku. Aku berlindung dengan kebesaran-Mu, agar aku tidak disambar dari bawahku.”",
    source: "HR. Abu Dawud no. 5074",
    repeat: 1,
    note: "Doa memohon perlindungan dari segala penjuru."
  },
  {
    id: 10,
    title: "Membaca Doa Perlindungan Kejahatan",
    arabic: "اَللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَاْلأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيْكَهُ، أَشْهَدُ أَنْ لاَ إِلَـهَ إِلاَّ أَنْتَ، أَعُوْذُ بِكَ مِنْ شَرِّ نَفْسِيْ، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِيْ سُوْءًا أَوْ أَجُرُّهُ إِلَى مُسْلِمٍ",
    latin: "Allahumma ‘aalimal ghoybi wasy syahaadah faathiros samaawaati wal ardh. Robba kulli syai-in wa maliikah. Asyhadu alla ilaha illa anta. A’udzu bika min syarri nafsii wa min syarrisy syaythooni wa syirkihi, wa an aqtarifa ‘alaa nafsii suu-an aw ajurruhu ilaa muslim.",
    translation: "“Ya Allah Yang Maha mengetahui yang ghaib dan yang nyata, wahai Rabb Pencipta langit dan bumi, Rabb atas segala sesuatu dan Yang Merajainya. Aku bersaksi bahwa tidak ada Ilah yang berhak diibadahi dengan benar kecuali Engkau. Aku berlindung kepada-Mu dari kejahatan diriku, syaitan dan ajakannya menyekutukan Allah.”",
    source: "HR. At-Tirmidzi no. 3392",
    repeat: 1,
    note: "Perlindungan dari kejahatan diri sendiri dan syaitan."
  },
  {
    id: 11,
    title: "Membaca Doa Terhindar Marabahaya",
    arabic: "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي اْلأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيْعُ الْعَلِيْمُ",
    latin: "Bismillahilladzi laa yadhurru ma’asmihi syai-un fil ardhi wa laa fis samaa-i wa huwas samii’ul ‘aliim.",
    translation: "“Dengan nama Allah yang bila disebut, segala sesuatu di bumi and langit tidak akan berbahaya, Dia-lah Yang Maha Mendengar lagi Maha Mengetahui.”",
    source: "HR. Abu Dawud no. 5088",
    repeat: 3,
    note: "Barangsiapa mengucapkannya tiga kali, maka tidak ada sesuatu pun yang membahayakannya."
  },
  {
    id: 12,
    title: "Membaca Keridhaan Kepada Allah",
    arabic: "رَضِيْتُ بِاللهِ رَبًّا، وَبِاْلإِسْلاَمِ دِيْنًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    latin: "Rodhiitu billahi robbaa, wa bil-islaami diinaa, wa bi-muhammadin shollallahu ‘alaihi wa sallama nabiyyaa.",
    translation: "“Aku ridha Allah sebagai Rabb, Islam sebagai agama and Muhammad shallallahu ‘alaihi wa sallam sebagai nabi (yang diutus oleh Allah).”",
    source: "HR. Abu Dawud no. 5072",
    repeat: 3,
    note: "Barangsiapa membacanya tiga kali di waktu pagi and sore, maka Allah pantas memberikan keridhaan kepadanya di hari kiamat."
  },
  {
    id: 13,
    title: "Membaca Doa Ya Hayyu Ya Qayyum",
    arabic: "يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْثُ، أَصْلِحْ لِيْ شَأْنِيْ كُلَّهُ وَلاَ تَكِلْنِيْ إِلَى نَفْسِيْ طَرْفَةَ عَيْنٍ",
    latin: "Yaa Hayyu Yaa Qoyyuum, bi-rohmatika astaghiits, ash-lih lii sya’nii kullahu wa laa takilnii ilaa nafsii thorfata ‘ain.",
    translation: "“Wahai Rabb Yang Maha Hidup, wahai Rabb Yang Terus Menerus Mengurus makhluk-Nya, dengan rahmat-Mu aku meminta pertolongan, perbaikilah segala urusanku and janganlah Engkau serahkan aku kepada diriku sendiri (meskipun) sekejap mata.”",
    source: "HR. Al-Hakim (I/545)",
    repeat: 1,
    note: "Disunnahkan dibaca pagi and petang."
  },
  {
    id: 14,
    title: "Membaca Doa Fitrah Islam (Pagi)",
    arabic: "أَصْبَحْنَا عَلَى فِطْرَةِ اْلإِسْلاَمِ وَعَلَى كَلِمَةِ اْلإِخْلاَصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ، حَنِيْفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ",
    latin: "Ash-bahnaa ‘ala fithrotil islaam wa ‘ala kalimatil ikhlaas, wa ‘ala diini nabiyyinaa muhammadin shollallahu ‘alaihi wa sallam, wa ‘ala millati abiinaa ibroohiima haniifam muslimaw wa maa kaana minal musyrikiin.",
    translation: "“Di waktu pagi kami berada di atas fitrah agama Islam, kalimat ikhlas, agama Nabi kami Muhammad shallallahu 'alaihi wa sallam, dan agama ayah kami Ibrahim yang hanif (lurus) lagi berserah diri kepada Allah, dan ia bukan termasuk orang-orang musyrik.”",
    source: "HR. Ahmad (III/406)",
    repeat: 1,
    note: "Menyatakan keteguhan di atas Islam setiap pagi."
  },
  {
    id: 15,
    title: "Membaca Kalimat Kebaikan (Tauhid)",
    arabic: "لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ.",
    latin: "Laa ilaha illallah wahdahu laa syarika lah, lahul mulku walahul hamdu wa huwa ‘ala kulli syai-in qodiir.",
    translation: "“Tidak ada Ilah yang berhak diibadahi dengan benar selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya segala puji. Dan Dia Mahakuasa atas segala sesuatu.”",
    source: "HR. Abu Dawud no. 5077",
    repeat: 10,
    note: "Membaca 10x mendapatkan pahala seperti memerdekakan empat budak Isma'il."
  },
  {
    id: 16,
    title: "Membaca Kalimat Tauhid 100X",
    arabic: "لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ..",
    latin: "Laa ilaha illallah wahdahu laa syarika lah, lahul mulku walahul hamdu wa huwa ‘ala kulli syai-in qodiir.",
    translation: "“Tidak ada Ilah yang berhak diibadahi dengan benar selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya segala puji. Dan Dia Maha kuasa atas segala sesuatu.”",
    source: "HR. Al-Bukhari no. 3293 & 6403",
    repeat: 100,
    note: "Mendapat 100 kebaikan, dihapus 100 keburukan, dan dilindungi dari syaitan hari itu hingga sore."
  },
  {
    id: 17,
    title: "Membaca Tasbih & Tahmid",
    arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
    latin: "Subhanallah wa bi-hamdih.",
    translation: "“Mahasuci Allah, aku memuji-Nya.”",
    source: "HR. Muslim no. 2691",
    repeat: 100,
    note: "Tidak ada yang membawa amalan lebih baik di hari kiamat kecuali yang mengucapkannya lebih banyak."
  },
  {
    id: 18,
    title: "Membaca Dzikir Pemberat Timbangan",
    arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",
    latin: "Subhanallah wa bi-hamdih, ‘adada kholqih wa ridhoo nafsih. wa zinata ‘arsyih, wa midaada kalimaatih.",
    translation: "“Mahasuci Allah, aku memuji-Nya sebanyak bilangan makhluk-Nya, Mahasuci Allah sesuai ke-ridhaan-Nya, Mahasuci seberat timbangan ‘Arsy-Nya, dan Mahasuci sebanyak tinta kalimat-Nya.”",
    source: "HR. Muslim no. 2726",
    repeat: 3,
    note: "Kalimat dzikir yang berat timbangannya di sisi Allah."
  },
  {
    id: 19,
    title: "Membaca Doa Ilmu & Amal",
    arabic: "اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً",
    latin: "Allahumma innii as-aluka ‘ilman naafi’a, wa rizqon thoyyibaa, wa ‘amalan mutaqobbalaa.",
    translation: "“Ya Allah, sesungguhnya aku meminta kepada-Mu ilmu yang bermanfaat, rizki yang halal (baik), dan amalan yang diterima.”",
    source: "HR. Ibnu Majah no. 925",
    repeat: 1,
    note: "Doa di pagi hari untuk keberkahan aktivitas sepanjang hari."
  },
  {
    id: 20,
    title: "Membaca Istighfar 100X",
    arabic: "أَسْتَغْفِرُ اللهَ وَأَتُوْبُ إِلَيْهِ",
    latin: "Astagh-firullah wa atuubu ilaih.",
    translation: "“Aku memohon ampunan kepada Allah dan bertaubat kepada-Nya.”",
    source: "HR. Al-Bukhari & Muslim",
    repeat: 100,
    note: "Rasulullah bertaubat kepada Allah dalam sehari seratus kali."
  }
];

// --- DATASET: DZIKIR PETANG ---
const petangData = pagiData.map((item) => {
  const newItem = { ...item };
  if (item.id === 5) {
    newItem.title = "Membaca Doa Perlindungan (Sore)";
    newItem.arabic = "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ، وَالْحَمْدُ للهِ، لَا إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.";
    newItem.latin = "Amsaynaa wa amsal mulku lillah walhamdulillah, laa ilaha illallah wahdahu laa syarika lah, lahul mulku walahul hamdu wa huwa ‘ala kulli syai-in qodir. Robbi as-aluka khoiro maa fii hadzihil lailah wa khoiro maa ba’daha, wa a’udzu bika min syarri maa fii hadzihil lailah wa syarri maa ba’daha. Robbi a’udzu bika minal kasali wa su-il kibar. Robbi a’udzu bika min ‘adzabin fin naari wa ‘adzabin fil qobri.";
    newItem.translation = "“Kami telah memasuki waktu sore dan kerajaan hanya milik Allah, segala puji hanya milik Allah. Tidak ada Ilah yang berhak diibadahi dengan benar kecuali Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya pujian. Dia-lah Yang Mahakuasa atas segala sesuatu. Wahai Rabb, aku mohon kepada-Mu kebaikan di malam ini dan kebaikan sesudahnya. Aku berlindung kepada-Mu dari kejahatan malam ini dan kejahatan sesudahnya. Wahai Rabb, aku berlindung kepada-Mu dari kemalasan dan kejelekan di hari tua. Wahai Rabb, aku berlindung kepada-Mu dari siksaan di Neraka dan siksaan di kubur.”";
  }
  if (item.id === 6) {
    newItem.title = "Membaca Doa Perlindungan (Waktu Sore)";
    newItem.arabic = "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا،وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيْرُ";
    newItem.latin = "Allahumma bika amsaynaa wa bika ash-bahnaa wa bika nahyaa wa bika namuutu wa ilaikal mashiir.";
    newItem.translation = "“Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu sore dan dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi. Dengan rahmat dan kehendak-Mu kami hidup dan dengan rahmat dan kehendak-Mu kami mati. Dan kepada-Mu tempat kembali (bagi semua makhluk).”";
  }
  if (item.id === 14) {
    newItem.title = "Membaca Doa Fitrah Islam (Sore)";
    newItem.arabic = "أَمْسَيْنَا عَلَى فِطْرَةِ اْلإِسْلاَمِ وَعَلَى كَلِمَةِ اْلإِخْلاَصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ، حَنِيْفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ";
    newItem.translation = "“Di waktu sore kami berada diatas fitrah agama Islam, kalimat ikhlas, agama Nabi kita Muhammad ﷺ dan agama ayah kami, Ibrahim, yang berdiri di atas jalan yang lurus, muslim dan tidak tergolong orang-orang yang musyrik.”";
  }
  return newItem;
});

// Item No 19 Petang is unique
petangData[19] = {
  id: 19,
  title: "Membaca Doa Perlindungan Kalimat Allah",
  arabic: "أَعُوْذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
  latin: "A’udzu bikalimaatillahit-taammaati min syarri maa kholaq.",
  translation: "“Aku berlindung dengan kalimat-kalimat Allah yang sempurna, dari kejahatan sesuatu yang diciptakan-Nya.”",
  source: "HR. Muslim no. 2709",
  repeat: 3,
  note: "Barangsiapa mengucapkannya di waktu petang, maka sengatan kalajengking tidak akan membahayakannya."
};

// Item No 20 Petang (Last index) is Istighfar
petangData[20] = { ...pagiData[20] };


export default function App() {
  const [category, setCategory] = useState<'pagi' | 'petang'>('pagi');
  const [pageIndex, setPageIndex] = useState(0);
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [isA11yMode, setIsA11yMode] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showLatin, setShowLatin] = useState(true);
  const [fontScaleArabic, setFontScaleArabic] = useState(1);
  const [fontScaleUI, setFontScaleUI] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dragX, setDragX] = useState(0);
  const [showNoteTranslation, setShowNoteTranslation] = useState(false);
  const [speechVolume, setSpeechVolume] = useState(1);
  const [speechProgress, setSpeechProgress] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('dzikir_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [contrastMode, setContrastMode] = useState<'normal' | 'high' | 'ultra'>('normal');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [targetLang, setTargetLang] = useState(() => localStorage.getItem('dzikir_target_lang') || 'id');
  const [translationCache, setTranslationCache] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('dzikir_translations');
    return saved ? JSON.parse(saved) : {};
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [uiTranslations, setUiTranslations] = useState<Record<string, string>>({});
  const [titleTranslation, setTitleTranslation] = useState("");
  const [currentLatinTranslation, setCurrentLatinTranslation] = useState("");
  const [showShareOptions, setShowShareOptions] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [flipProgress, setFlipProgress] = useState(0); // 0 to 1
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [fontFamily, setFontFamily] = useState<'sans' | 'dyslexic'>('sans');
  const [arabicLineHeight, setArabicLineHeight] = useState(1.6);
  const [arabicLetterSpacing, setArabicLetterSpacing] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showFooterNav, setShowFooterNav] = useState(true);
  const [feedbackText, setFeedbackText] = useState("");
  const shareCardRef = useRef<HTMLDivElement>(null);

  // --- AUDIO PLAYER STATE ---
  const [activeAudio, setActiveAudio] = useState<string>(AUDIO_SOURCES[0].url);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const playerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (activeAudio && playerRef.current) {
      playerRef.current.load();
      if (isAudioPlaying) {
        playerRef.current.play().catch(() => setIsAudioPlaying(false));
      }
    }
  }, [activeAudio]);

  const toggleAudio = () => {
    if (!playerRef.current) return;
    vibrate(20);
    if (isAudioPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play().catch(console.error);
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  const stopAudio = () => {
    if (!playerRef.current) return;
    vibrate(30);
    playerRef.current.pause();
    playerRef.current.playbackRate = playbackSpeed;
    playerRef.current.currentTime = 0;
    setIsAudioPlaying(false);
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;

    const onTimeUpdate = () => setAudioCurrentTime(p.currentTime);
    const onLoadedMetadata = () => setAudioDuration(p.duration);
    const onEnded = () => setIsAudioPlaying(false);

    p.addEventListener('timeupdate', onTimeUpdate);
    p.addEventListener('loadedmetadata', onLoadedMetadata);
    p.addEventListener('ended', onEnded);

    return () => {
      p.removeEventListener('timeupdate', onTimeUpdate);
      p.removeEventListener('loadedmetadata', onLoadedMetadata);
      p.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('dzikir_target_lang', targetLang);
    // Update dynamic meta description and html lang
    const langName = LANGUAGES.find(l => l.code === targetLang)?.name || 'Language';
    document.documentElement.lang = targetLang;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `Dzikir Pagi & Petang translated to ${langName}. Koleksi doa Al-Qur'an & Hadist inklusif oleh Te_eR™ Inovative.`);
    }
  }, [targetLang]);

  useEffect(() => {
    localStorage.setItem('dzikir_translations', JSON.stringify(translationCache));
  }, [translationCache]);

  const translateText = async (text: string, targetCode: string, _isUI = false) => {
    if (targetCode === 'id' || !text) return text;
    const cacheKey = `${targetCode}:${text}`;
    if (translationCache[cacheKey]) return translationCache[cacheKey];

    setIsTranslating(true);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      // Google Translate GTX returns an array of chunks
      const result = data[0].map((x: any) => x[0]).join('');
      
      if (result) {
        setTranslationCache(prev => ({ ...prev, [cacheKey]: result }));
        return result;
      }
      return text;
    } catch (error) {
      console.error("Translation error (Google Translate):", error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  useEffect(() => {
    localStorage.setItem('dzikir_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const vibrate = (duration = 10) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  };

  const toggleBookmark = (id: number) => {
    vibrate(20);
    const bKey = `${category}-${id}`;
    setBookmarks(prev => 
      prev.includes(bKey) ? prev.filter(k => k !== bKey) : [...prev, bKey]
    );
  };
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    audioRef.current = new Audio('https://www.soundjay.com/misc/sounds/paper-flip-1.mp3');
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  const playTurnSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    // Sync font scaling with A11y mode
    if (isA11yMode) {
      setFontScaleArabic(1.6);
      setFontScaleUI(1.4);
    } else {
      setFontScaleArabic(1);
      setFontScaleUI(1);
    }
  }, [isA11yMode]);

  const adjustFont = (type: 'arabic' | 'ui', delta: number) => {
    if (type === 'arabic') {
      setFontScaleArabic(prev => Math.min(2, Math.max(0.8, prev + delta)));
    } else {
      setFontScaleUI(prev => Math.min(2, Math.max(0.8, prev + delta)));
    }
  };

  // --- UI TRANSLATION LOGIC ---
  useEffect(() => {
    const updateUI = async () => {
      if (targetLang === 'id') {
        setUiTranslations({});
        return;
      }
      const currentUIDict = uiDict[lang];
      const translatedUI: Record<string, string> = {};
      
      // We only translate the values of the UI dictionary
      const entries = Object.entries(currentUIDict);
      for (const [key, value] of entries) {
        translatedUI[key] = await translateText(value as string, targetLang, true);
      }
      setUiTranslations(translatedUI);
    };
    updateUI();
  }, [targetLang, lang]);

  const t = useMemo(() => {
    const base = uiDict[lang];
    return { ...base, ...uiTranslations };
  }, [lang, uiTranslations]);

  const list = category === 'pagi' ? pagiData : petangData;
  const item = list[pageIndex];

  const [currentTranslation, setCurrentTranslation] = useState("");
  const [currentNoteTranslation, setCurrentNoteTranslation] = useState("");

  useEffect(() => {
    const updateTranslations = async () => {
      if (targetLang === 'id') {
        setCurrentTranslation(item.translation);
        setCurrentNoteTranslation(item.note || "");
        setCurrentLatinTranslation(item.latin);
        setTitleTranslation(item.title);
      } else {
        const tTitle = await translateText(item.title, targetLang, true);
        setTitleTranslation(tTitle);
        const tMain = await translateText(item.translation, targetLang);
        setCurrentTranslation(tMain);
        
        // Latin and Arabic remain original (strict rule)
        setCurrentLatinTranslation(item.latin);
        
        if (item.note) {
          const tNote = await translateText(item.note, targetLang);
          setCurrentNoteTranslation(tNote);
        }
      }
    };
    updateTranslations();
  }, [item, targetLang, translationCache]);

  const stopAll = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setSpeechProgress(0);
  }, []);

  const handleNext = useCallback(() => {
    vibrate(15);
    stopAll();
    playTurnSound();
    setPageIndex((p) => (p + 1) % list.length);
  }, [list.length, stopAll]);

  const handlePrev = useCallback(() => {
    vibrate(15);
    stopAll();
    playTurnSound();
    setPageIndex((p) => (p - 1 + list.length) % list.length);
  }, [list.length, stopAll]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
    setDragX(0);
  };

  const pauseSpeak = useCallback(() => {
    if (synthRef.current?.speaking && !synthRef.current?.paused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeSpeak = useCallback(() => {
    if (synthRef.current?.paused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  const speak = useCallback((text: string, vLang: string) => {
    if (!synthRef.current) return;
    
    // If it's already speaking the same text but paused, resume it
    if (synthRef.current.paused && isSpeaking && currentUtteranceRef.current?.text === text) {
      resumeSpeak();
      return;
    }

    stopAll();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = vLang;

    // --- ENHANCED VOICE SELECTION ---
    // If Arabic, attempt to find a Middle Eastern Male voice
    if (vLang === 'ar-SA') {
      const voices = synthRef.current.getVoices();
      const maleArabicVoice = voices.find(v => 
        (v.lang === 'ar-SA' || v.lang.startsWith('ar')) && 
        (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('m') || v.name.toLowerCase().includes('nahid') || v.name.toLowerCase().includes('hamza'))
      );
      if (maleArabicVoice) {
        utterance.voice = maleArabicVoice;
      }
    }

    utterance.rate = isA11yMode ? (playbackSpeed * 0.7) : playbackSpeed;
    utterance.volume = speechVolume;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeechProgress(0);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeechProgress(100);
    };

    utterance.onboundary = (event) => {
      if (text.length > 0) {
        setSpeechProgress((event.charIndex / text.length) * 100);
      }
    };

    currentUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [stopAll, isA11yMode, isSpeaking, resumeSpeak, speechVolume]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(t.copied);
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareAsText = async () => {
    const shareUrl = window.location.href;
    const shareText = `${titleTranslation || item.title}\n\n${item.arabic}\n\n${item.latin}\n\n${currentTranslation || item.translation}\n\n${t.footnote}: ${currentNoteTranslation || item.note || "-"}\n\n${t.shareLabel}\n${shareUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: titleTranslation || item.title,
          text: shareText,
          url: shareUrl
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
    setShowShareOptions(false);
  };

  const shareAsImage = async () => {
    if (!shareCardRef.current) return;
    setIsCapturing(true);
    vibrate(50);
    
    try {
      // Small delay to ensure isCapturing state renders the branding overlay
      await new Promise(r => setTimeout(r, 200));
      
      const dataUrl = await htmlToImage.toJpeg(shareCardRef.current, {
        quality: 0.95,
        backgroundColor: isDarkMode ? '#020617' : '#fafaf9',
        cacheBust: true,
      });
      
      const link = document.createElement('a');
      link.download = `dzikir-${item.id}.jpg`;
      link.href = dataUrl;
      link.click();
      
      setToast(t.copied);
    } catch (err) {
      console.error("Capture failed:", err);
    } finally {
      setIsCapturing(false);
      setShowShareOptions(false);
    }
  };

  const shareAsGif = async () => {
    if (!shareCardRef.current) return;
    setIsCapturing(true);
    setCaptureProgress(0);
    setFlipProgress(0);
    vibrate(50);
    setToast(t.preparing);

    try {
      const frames = [];
      const frameCount = 8;
      
      for (let i = 0; i <= frameCount; i++) {
        const progress = i / frameCount;
        setFlipProgress(progress);
        setCaptureProgress(progress * 100);
        
        // Wait for render
        await new Promise(r => setTimeout(r, 150));
        
        const dataUrl = await htmlToImage.toJpeg(shareCardRef.current, {
          quality: 0.8,
          backgroundColor: isDarkMode ? '#020617' : '#fafaf9',
          width: 400, // Reduced size for GIF performance
          height: 600,
        });
        frames.push(dataUrl);
      }

      gifshot.createGIF({
        images: frames,
        gifWidth: 400,
        gifHeight: 600,
        interval: 0.15,
        numFrames: frames.length,
        frameDuration: 1,
      }, (obj: any) => {
        if (!obj.error) {
          const link = document.createElement('a');
          link.download = `dzikir-${item.id}.gif`;
          link.href = obj.image;
          link.click();
          setToast(t.copied);
        } else {
          console.error("GIF generation error:", obj.error);
        }
        setIsCapturing(false);
        setFlipProgress(0);
        setShowShareOptions(false);
      });
    } catch (err) {
      console.error("GIF export failed:", err);
      setIsCapturing(false);
      setFlipProgress(0);
    }
  };

  // --- STYLING LOGIC ---
  const isDarkMode = theme === 'dark' || isA11yMode;
  const contrastClass = contrastMode === 'ultra' ? 'contrast-[1.15] brightness-[1.05] saturate-[1.2]' : contrastMode === 'high' ? 'contrast-[1.1]' : '';
  const spacingClass = lineSpacing === 2 ? 'line-spacing-2' : lineSpacing === 1.5 ? 'line-spacing-1-5' : 'line-spacing-1';
  const fontClass = fontFamily === 'dyslexic' ? 'font-dyslexic tracking-wide leading-relaxed' : '';
  
  const themeClass = isA11yMode 
    ? "bg-black text-yellow-300 font-bold" 
    : isDarkMode 
      ? "bg-slate-950 text-slate-200" 
      : "bg-stone-50 text-slate-800";
  
  const cardClass = isA11yMode 
    ? "bg-black border-4 border-yellow-300 ring-2 ring-yellow-400" 
    : isDarkMode
      ? "bg-slate-900 border border-slate-800 shadow-2xl shadow-blue-500/10"
      : "bg-white border border-stone-200 shadow-lg";

  const getFontSize = (base: string, scale: number) => {
    const scaleClasses: Record<string, string> = {
      'text-base': scale > 1.8 ? 'text-4xl' : scale > 1.5 ? 'text-3xl' : scale > 1.2 ? 'text-2xl' : 'text-base',
      'text-lg': scale > 1.8 ? 'text-5xl' : scale > 1.5 ? 'text-4xl' : scale > 1.2 ? 'text-3xl' : 'text-lg',
      'text-3xl': scale > 1.8 ? 'text-7xl' : scale > 1.5 ? 'text-6xl' : scale > 1.2 ? 'text-5xl' : 'text-3xl',
    };
    return scaleClasses[base] || base;
  };

  const arabicSize = isA11yMode ? "text-5xl md:text-8xl" : getFontSize('text-3xl', fontScaleArabic) + " md:" + (fontScaleArabic > 1.5 ? "text-9xl" : fontScaleArabic > 1.2 ? "text-8xl" : "text-6xl");
  const latinSize = isA11yMode ? "text-3xl md:text-5xl" : getFontSize('text-lg', fontScaleUI) + " md:" + (fontScaleUI > 1.5 ? "text-5xl" : fontScaleUI > 1.2 ? "text-4xl" : "text-xl");
  const translationSize = isA11yMode ? "text-2xl md:text-4xl" : getFontSize('text-base', fontScaleUI) + " md:" + (fontScaleUI > 1.5 ? "text-4xl" : fontScaleUI > 1.2 ? "text-3xl" : "text-lg");

  const handleSubmitFeedback = () => {
    vibrate(50);
    setToast(t.feedbackSent);
    setTimeout(() => setToast(null), 3000);
    setShowFeedbackModal(false);
    setFeedbackText("");
  };

  return (
    <div id="app-root" className={`min-h-screen flex flex-col transition-all duration-500 ${themeClass} ${contrastClass} ${fontClass}`}>
      <style>{`
        .font-dyslexic {
          font-family: 'Comic Sans MS', cursive, sans-serif !important;
          font-weight: 500 !important;
        }
        @media (min-width: 768px) {
          .line-spacing-1 { line-height: 1.2; }
          .line-spacing-1-5 { line-height: 1.6; }
          .line-spacing-2 { line-height: 2.2; }
        }
        .page-fold {
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          background: linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 100%);
          z-index: 60;
          pointer-events: none;
        }
      `}</style>
      
      {/* TOP HEADER */}
      <header className={`sticky top-0 z-50 p-4 flex items-center justify-between border-b ${isA11yMode ? 'bg-black border-yellow-300' : isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-stone-200'} backdrop-blur-md`} id="main-header">
        <div className="flex items-center gap-3">
           <VolumeIcon size={isA11yMode ? 40 : 28} className={isA11yMode ? "text-yellow-300" : "text-blue-500"} />
           <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter">{(category === 'pagi' ? t.pagi : t.petang) || `Dzikir ${category}`}</h1>
        </div>
        
        <div className="flex gap-2">
          {installPrompt && (
            <button 
               onClick={handleInstall}
               className={`p-3 rounded-xl transition-all ${isA11yMode ? 'border-4 border-yellow-300' : isDarkMode ? 'bg-slate-800 text-white' : 'bg-green-100 text-green-700 font-bold'}`}
               aria-label={t.install}
            >
              <DownloadIcon size={isA11yMode ? 32 : 24} />
            </button>
          )}
          <button 
             onClick={() => { vibrate(10); setIsSearchOpen(true); }}
             className={`p-3 rounded-xl transition-all ${isA11yMode ? 'border-4 border-yellow-300' : isDarkMode ? 'bg-slate-800 text-white' : 'bg-stone-100'}`}
             aria-label={t.search}
          >
            <SearchIcon size={isA11yMode ? 32 : 24} />
          </button>
          <button 
            id="cat-toggle"
            aria-label={`Switch to ${category === 'pagi' ? 'Morning' : 'Evening'} Dzikir`}
            onClick={() => { vibrate(20); setCategory(category === 'pagi' ? 'petang' : 'pagi'); setPageIndex(0); stopAll(); }}
            className={`px-4 py-2 rounded-xl font-bold uppercase transition-all ${isA11yMode ? 'border-4 border-yellow-300' : isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800'}`}
          >
            {category === 'pagi' ? '🏠' : '🌙'} {category}
          </button>
          <button 
            id="btn-settings"
            aria-expanded={showSettings}
            aria-label={t.theme}
            onClick={() => { vibrate(10); setShowSettings(!showSettings); }}
            className={`p-3 rounded-xl transition-all ${isA11yMode ? 'border-4 border-yellow-300' : isDarkMode ? 'bg-slate-800 text-white' : 'bg-stone-100'}`}
          >
            <SettingsIcon size={isA11yMode ? 32 : 24} />
          </button>
        </div>
      </header>

      {/* FEEDBACK MODAL */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowFeedbackModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
              onClick={(e) => e.stopPropagation()}
            >
               <h3 className="text-2xl font-black uppercase tracking-tight mb-6">{t.feedbackTitle}</h3>
               <textarea 
                 autoFocus
                 value={feedbackText}
                 onChange={(e) => setFeedbackText(e.target.value)}
                 placeholder={t.feedbackPlaceholder}
                 className={`w-full h-40 p-4 rounded-3xl border-none ring-2 ring-transparent bg-black/5 focus:ring-blue-500 outline-none font-medium mb-6 resize-none`}
               />
               <div className="flex gap-4">
                  <button 
                    onClick={() => setShowFeedbackModal(false)}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest bg-black/5 hover:bg-black/10 transition-all`}
                  >
                    {t.cancel}
                  </button>
                  <button 
                    onClick={handleSubmitFeedback}
                    disabled={!feedbackText.trim()}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50`}
                  >
                    {t.submit}
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-20"
          >
             <motion.div 
               initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }}
               className={`w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}
             >
                <button onClick={() => setIsSearchOpen(false)} className="absolute top-4 right-4 p-2 opacity-50 hover:opacity-100"><XIcon /></button>
                <div className="flex flex-col gap-6">
                   <div className="relative">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                      <input 
                        autoFocus
                        type="search" value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.search}
                        className={`w-full p-4 pl-12 rounded-2xl border-none ring-2 ring-transparent bg-black/5 focus:ring-blue-500 outline-none font-bold`}
                      />
                   </div>
                   <div className="max-h-[50vh] overflow-y-auto flex flex-col gap-2">
                       {list.filter(d => 
                         d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         d.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.latin.toLowerCase().includes(searchQuery.toLowerCase())
                       ).map((d) => {
                         const originalIndex = list.findIndex(item => item.id === d.id);
                         const cacheKey = `${targetLang}:${d.title}`;
                         const displayTitle = (targetLang === 'id') ? d.title : (translationCache[cacheKey] || d.title);

                         return (
                           <button 
                             key={d.id}
                             onClick={() => { setPageIndex(originalIndex); setIsSearchOpen(false); setSearchQuery(""); stopAll(); }}
                             className="p-4 rounded-xl hover:bg-blue-500 hover:text-white transition-all text-left flex items-start justify-between group"
                           >
                             <div className="flex flex-col gap-1">
                                <span className="font-black text-sm uppercase tracking-tight">{displayTitle}</span>
                                <span className="text-xs opacity-60 line-clamp-1">{d.translation}</span>
                             </div>
                             <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                           </button>
                         );
                       })}
                      {list.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <div className="text-center py-8 opacity-40 font-black italic">{t.noResults}</div>
                      )}
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SETTINGS PANEL */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`overflow-hidden border-b-2 ${isA11yMode ? 'bg-black border-yellow-300' : isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200'}`}
          >
            <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
                className="p-4 flex items-center justify-between rounded-2xl bg-black/5 hover:bg-black/10 transition-all font-bold"
              >
                <div className="flex items-center gap-3"><LanguagesIcon size={24} /> {t.lang}</div>
                <span className="uppercase">{lang}</span>
              </button>
              
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-4 flex items-center justify-between rounded-2xl bg-black/5 hover:bg-black/10 transition-all font-bold"
              >
                <div className="flex items-center gap-3">{theme === 'light' ? <SunIcon size={24}/> : <MoonIcon size={24}/>} {t.theme}</div>
                <span className="uppercase">{theme}</span>
              </button>

              <button 
                onClick={() => setIsA11yMode(!isA11yMode)}
                className={`p-4 flex items-center justify-between rounded-2xl transition-all font-bold ${isA11yMode ? 'bg-yellow-300 text-black' : 'bg-black/5'}`}
              >
                <div className="flex items-center gap-3"><AccessibilityIcon size={24}/> {t.a11yMode}</div>
                <span>{isA11yMode ? 'ON' : 'OFF'}</span>
              </button>

              <button 
                onClick={() => setShowLatin(!showLatin)}
                className={`p-4 flex items-center justify-between rounded-2xl transition-all font-bold ${showLatin ? 'bg-blue-500 text-white' : 'bg-black/5'}`}
              >
                <div className="flex items-center gap-3">{showLatin ? <EyeIcon size={24}/> : <EyeOffIcon size={24}/>} {t.showLatin}</div>
                <span>{showLatin ? 'ON' : 'OFF'}</span>
              </button>

              <button 
                onClick={() => setShowFooterNav(!showFooterNav)}
                className={`p-4 flex items-center justify-between rounded-2xl transition-all font-bold ${showFooterNav ? 'bg-blue-500 text-white' : 'bg-black/5'}`}
              >
                <div className="flex items-center gap-3">{showFooterNav ? <EyeIcon size={24}/> : <EyeOffIcon size={24}/>} {t.showNav}</div>
                <span>{showFooterNav ? 'ON' : 'OFF'}</span>
              </button>

              <div className="p-4 rounded-2xl bg-black/5 flex flex-col gap-3">
                <span className="text-xs font-black uppercase opacity-60 tracking-widest">{t.fontStyle}</span>
                <div className="flex items-center gap-2">
                   {(['sans', 'dyslexic'] as const).map(v => (
                     <button key={v} onClick={() => { vibrate(); setFontFamily(v); }} className={`flex-1 p-2 rounded-xl font-black text-xs uppercase transition-all ${fontFamily === v ? 'bg-blue-500 text-white' : 'bg-white/50 dark:bg-white/10'}`}>{v === 'sans' ? t.standardFont : t.dyslexicFont}</button>
                   ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/5 flex flex-col gap-3">
                <span className="text-xs font-black uppercase opacity-60 tracking-widest">{t.playbackSpeed}</span>
                <div className="flex items-center gap-2">
                   {[0.5, 0.75, 1, 1.25, 1.5].map(v => (
                     <button key={v} onClick={() => { vibrate(); setPlaybackSpeed(v); }} className={`flex-1 p-2 rounded-xl font-black text-xs transition-all ${playbackSpeed === v ? 'bg-blue-500 text-white' : 'bg-white/50 dark:bg-white/10'}`}>{v}x</button>
                   ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/5 flex flex-col gap-3">
                <span className="text-xs font-black uppercase opacity-60 tracking-widest">{t.arabicSize}</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => { vibrate(); adjustFont('arabic', -0.1); }} className="flex-1 bg-white/50 dark:bg-white/10 p-2 rounded-xl font-black text-xl hover:bg-white/80 transition-all">-</button>
                  <span className="font-mono font-black">{Math.round(fontScaleArabic * 100)}%</span>
                  <button onClick={() => { vibrate(); adjustFont('arabic', 0.1); }} className="flex-1 bg-white/50 dark:bg-white/10 p-2 rounded-xl font-black text-xl hover:bg-white/80 transition-all">+</button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/5 flex flex-col gap-3">
                <span className="text-xs font-black uppercase opacity-60 tracking-widest">Arab: Jarak Baris</span>
                <div className="flex items-center gap-2">
                   {[1.2, 1.6, 2, 2.5].map(v => (
                     <button key={v} onClick={() => { vibrate(10); setArabicLineHeight(v); }} className={`flex-1 p-2 rounded-xl font-black text-xs transition-all ${arabicLineHeight === v ? 'bg-orange-500 text-white' : 'bg-white/50 dark:bg-white/10'}`}>{v}x</button>
                   ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/5 flex flex-col gap-3">
                <span className="text-xs font-black uppercase opacity-60 tracking-widest">Arab: Jarak Kata</span>
                <div className="flex items-center gap-2">
                   {[0, 1, 2, 4].map(v => (
                     <button key={v} onClick={() => { vibrate(10); setArabicLetterSpacing(v); }} className={`flex-1 p-2 rounded-xl font-black text-xs transition-all ${arabicLetterSpacing === v ? 'bg-orange-500 text-white' : 'bg-white/50 dark:bg-white/10'}`}>{v}px</button>
                   ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/5 flex flex-col gap-3">
                <span className="text-xs font-black uppercase opacity-60 tracking-widest">{t.uiSize}</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => { vibrate(); adjustFont('ui', -0.1); }} className="flex-1 bg-white/50 dark:bg-white/10 p-2 rounded-xl font-black text-xl hover:bg-white/80 transition-all">-</button>
                  <span className="font-mono font-black">{Math.round(fontScaleUI * 100)}%</span>
                  <button onClick={() => { vibrate(); adjustFont('ui', 0.1); }} className="flex-1 bg-white/50 dark:bg-white/10 p-2 rounded-xl font-black text-xl hover:bg-white/80 transition-all">+</button>
                </div>
              </div>

              {/* GRANULAR A11Y OPTIONS */}
              <div className="p-4 rounded-2xl bg-black/5 flex flex-col gap-3">
                <span className="text-xs font-black uppercase opacity-60 tracking-widest">{t.lineSpacing}</span>
                <div className="flex items-center gap-2">
                   {[1, 1.5, 2].map(v => (
                     <button key={v} onClick={() => { vibrate(); setLineSpacing(v); }} className={`flex-1 p-2 rounded-xl font-black transition-all ${lineSpacing === v ? 'bg-blue-500 text-white' : 'bg-white/50 dark:bg-white/10'}`}>{v}x</button>
                   ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/5 flex flex-col gap-3">
                <span className="text-xs font-black uppercase opacity-60 tracking-widest">{t.contrast}</span>
                <div className="flex items-center gap-2">
                   {(['normal', 'high', 'ultra'] as const).map(v => (
                     <button key={v} onClick={() => { vibrate(); setContrastMode(v); }} className={`flex-1 p-2 rounded-xl font-black text-[10px] uppercase transition-all ${contrastMode === v ? 'bg-blue-500 text-white' : 'bg-white/50 dark:bg-white/10'}`}>{t[v]}</button>
                   ))}
                </div>
              </div>

              {/* TARGET LANGUAGE SELECTOR */}
              <div className="p-4 rounded-2xl bg-black/5 flex flex-col gap-3 md:col-span-2">
                <span className="text-xs font-black uppercase opacity-60 tracking-widest">{t.selectLang}</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                   {LANGUAGES.map(l => (
                     <button 
                       key={l.code} 
                       onClick={() => { vibrate(); setTargetLang(l.code); }} 
                       className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-all ${targetLang === l.code ? 'bg-blue-600 text-white' : 'bg-white/50 dark:bg-white/10'}`}
                     >
                       <span>{l.flag}</span>
                       <span className="truncate">{l.name}</span>
                     </button>
                   ))}
                </div>
              </div>
            </div>
            
            {/* FOOTER EXTRA */}
            <div className={`p-6 border-t ${isA11yMode ? 'border-yellow-300' : 'border-black/5'} flex flex-col items-center gap-2 opacity-80`}>
               <a href="mailto:hijr.time+doadzikir@gmail.com" className="flex items-center gap-2 font-black text-sm hover:underline">
                 {t.contactUs}
               </a>
               <p className="text-[10px] font-bold italic opacity-60">
                 {t.devBy} @{new Date().getFullYear()}
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VISUAL INDICATOR (AUDIOBOOK STATUS) */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div 
            role="alert"
            aria-live="polite"
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className={`fixed bottom-40 left-1/2 -translate-x-1/2 z-50 p-4 px-8 rounded-3xl shadow-2xl flex flex-col gap-4 min-w-[320px] transition-colors ${isA11yMode ? 'bg-yellow-300 text-black font-black border-4 border-black' : isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2 items-center">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isA11yMode ? 'bg-black' : 'bg-blue-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isA11yMode ? 'bg-black' : 'bg-blue-500'}`}></span>
                </span>
                <span className="font-black text-sm uppercase tracking-widest">{isPaused ? t.pause : t.visualIndicator}</span>
              </div>
              <div className="flex gap-2 text-xs opacity-60 font-black">
                {Math.round(speechProgress)}%
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${speechProgress}%` }}
                 className={`h-full ${isA11yMode ? 'bg-black' : 'bg-blue-500'}`}
               />
            </div>

            {/* CONTROLS & VOLUME */}
            <div className="flex items-center justify-between gap-6">
              <div className="flex gap-4 items-center">
                {isPaused ? (
                  <button onClick={resumeSpeak} className="hover:scale-110 transition-transform focus:ring-2 focus:ring-blue-500 rounded-full p-2 bg-black/5"><PlayIcon size={24} /></button>
                ) : (
                  <button onClick={pauseSpeak} className="hover:scale-110 transition-transform focus:ring-2 focus:ring-blue-500 rounded-full p-2 bg-black/5"><PauseIcon size={24} /></button>
                )}
                <button onClick={stopAll} className="hover:scale-110 transition-transform focus:ring-2 focus:ring-blue-500 rounded-full p-2 bg-black/5"><StopIcon size={24} /></button>
              </div>

              <div className="flex-1 flex items-center gap-3">
                 <VolumeIcon size={18} className="opacity-60" />
                 <input 
                   type="range" min="0" max="1" step="0.1" 
                   value={speechVolume} 
                   onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                   className="flex-1 accent-blue-500 h-1 rounded-lg cursor-pointer"
                 />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION DIALOG */}
      <AnimatePresence>
        {showConfirmDialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`max-w-sm w-full p-6 rounded-3xl shadow-2xl ${isA11yMode ? 'bg-yellow-300 text-black font-black' : isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className={`p-4 rounded-full ${isA11yMode ? 'bg-black' : 'bg-green-500/10 text-green-500'}`}>
                  <CopyIcon size={40} className={isA11yMode ? "text-yellow-300" : ""} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">{showConfirmDialog}</h3>
                <p className="opacity-70 text-sm">Konten telah berhasil disalin ke clipboard karena fitur berbagi tidak tersedia atau dibatalkan.</p>
                <button 
                  onClick={() => setShowConfirmDialog(null)}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest ${isA11yMode ? 'bg-black text-yellow-300' : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors'}`}
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[60] bg-green-600 text-white px-6 py-3 rounded-full font-black shadow-2xl flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SLIDE CONTENT */}
      <main 
        className="flex-1 flex flex-col items-center p-4 md:p-8 overflow-hidden touch-none" 
        id="main-content"
        style={{ perspective: '1500px' }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${category}-${pageIndex}`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: 600, rotateY: 90, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              x: isCapturing ? (-600 * flipProgress) : 0, 
              rotateY: isCapturing ? (-90 * flipProgress) : 0, 
              scale: 1 
            }}
            exit={{ opacity: 0, x: -600, rotateY: -90, scale: 0.8 }}
            whileHover={{ scale: isA11yMode ? 1 : 1.01, boxShadow: '0 35px 60px -15px rgba(0, 0, 0, 0.6)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className={`w-full max-w-4xl h-full flex flex-col p-6 md:p-12 transition-all relative overflow-y-auto ${cardClass}`}
            style={{ transformStyle: 'preserve-3d', boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.1), 0 25px 50px -12px rgba(0,0,0,0.4)' }}
          >
             {/* Realistic Page Curl Shadow Overlay during transition */}
             <motion.div 
               className="absolute top-0 right-0 h-full w-full pointer-events-none z-[60]"
               initial={{ opacity: 0, background: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 100%)' }}
               animate={{ opacity: 0 }}
               exit={{ opacity: 1, background: 'linear-gradient(to right, transparent 80%, rgba(0,0,0,0.1) 90%, rgba(0,0,0,0.3) 100%)' }}
             />

             <div ref={shareCardRef} className="w-full h-full flex flex-col relative rounded-inherit">
                {/* INNER SHADOW OVERLAY FOR DEPTH DURING FLIP */}
                <motion.div 
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0.5 }}
                  className="absolute inset-0 pointer-events-none z-50 bg-black/30 rounded-inherit mix-blend-multiply"
                  style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.1) 100%)' }}
                />
                
                <div className="flex justify-between items-center opacity-60 mb-6 relative z-10">
                   <span className="font-black uppercase tracking-tighter text-2xl">{titleTranslation || item.title}</span>
                   <div className="flex items-center gap-4">
                      <span className="font-mono text-xl">{pageIndex + 1} / {list.length}</span>
                   </div>
                </div>

                <div className="flex-1 flex flex-col gap-10 relative z-10">
                  {/* 1. ARABIC */}
                  <section className="relative">
                    <div 
                      role="button" tabIndex={0}
                      onClick={() => speak(item.arabic, 'ar-SA')}
                      className={`text-right dir-rtl cursor-pointer p-4 rounded-3xl hover:bg-yellow-500/5 transition-all ${arabicSize}`}
                      style={{ 
                        direction: 'rtl', 
                        lineHeight: arabicLineHeight, 
                        letterSpacing: `${arabicLetterSpacing}px` 
                      }}
                    >
                      {item.arabic}
                    </div>
                  </section>

                  {/* 2. LATIN (TOGGLEABLE) */}
                  {showLatin && (
                    <section className="relative">
                      <div 
                        role="button" tabIndex={0}
                        onClick={() => speak(item.latin, 'id-ID')}
                        className={`p-6 border-l-8 italic cursor-pointer transition-all bg-black/5 hover:bg-blue-500/5 ${isDarkMode ? 'border-yellow-300' : 'border-blue-500'} ${latinSize}`}
                      >
                         {item.latin}
                      </div>
                    </section>
                  )}

                  {/* 3. TRANSLATION */}
                  <section className="relative group">
                    <div className="flex items-start gap-4">
                      <div 
                        className={`flex-1 p-6 rounded-3xl break-words transition-all font-medium ${isA11yMode ? 'bg-black' : isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'} ${translationSize} ${spacingClass} relative`}
                      >
                        <h3 className="font-black underline uppercase mb-3 tracking-tighter text-sm opacity-60">[{t.translation}]</h3>
                        {isTranslating ? (
                          <div className="flex items-center gap-2 animate-pulse opacity-50">
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                            <span className="text-xs font-black">{t.translating}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            <span>{currentTranslation || item.translation}</span>
                            <button 
                              onClick={() => { vibrate(10); setShowFeedbackModal(true); }}
                              className="text-[10px] font-black uppercase opacity-30 hover:opacity-100 self-end flex items-center gap-1 group transition-all"
                            >
                              <MessageCircleIcon size={12} className="group-hover:text-blue-500" />
                              {t.reportIssue}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* 4. FOOTNOTE / NOTE / SOURCE */}
                  <footer className="mt-8 pt-8 border-t border-black/10 flex flex-col gap-6 pb-24">
                    <div className="flex items-center justify-between">
                      <span className={`px-5 py-2 rounded-full font-black ${isDarkMode ? 'bg-yellow-300 text-black' : 'bg-slate-950 text-white'}`}>
                         {item.repeat}X {t.repeat}
                      </span>
                      <span className="text-sm font-black italic opacity-40 uppercase tracking-widest">{item.source}</span>
                    </div>
                    
                    {item.note && (
                      <div className={`p-6 rounded-3xl flex flex-col gap-4 border-2 transition-all ${isA11yMode ? 'border-yellow-300 bg-black' : 'border-dashed border-black/10 bg-stone-100/30'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-black uppercase text-xs opacity-50 tracking-[0.2em]">
                            <MessageCircleIcon size={16} />
                            {t.footnote}
                          </div>
                          <div className="flex gap-2">
                             <button 
                               onClick={() => { vibrate(10); speak(currentNoteTranslation || item.note, targetLang === 'id' ? 'id-ID' : targetLang); }}
                               className={`p-2 rounded-full transition-all bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white`}
                               title={t.listen}
                             >
                                <VolumeIcon size={14} />
                             </button>
                             <button 
                               onClick={() => { vibrate(10); setShowNoteTranslation(!showNoteTranslation); }}
                               className={`text-[10px] font-black uppercase border px-2 py-1 rounded-lg transition-all ${showNoteTranslation ? 'bg-blue-500 text-white border-blue-500' : 'opacity-40 border-current hover:opacity-100'}`}
                             >
                               {t.translateNote}
                             </button>
                          </div>
                        </div>
                        <div className="text-sm italic opacity-80 leading-relaxed font-medium">
                          {isTranslating ? t.translating : (currentNoteTranslation || item.note)}
                        </div>
                        {showNoteTranslation && (
                          <div className={`mt-2 p-4 rounded-2xl text-sm font-bold border-l-4 transition-all ${isDarkMode ? 'bg-slate-800/80 border-blue-500 text-blue-100' : 'bg-blue-50 border-blue-500 text-blue-900'}`}>
                             ⭐ {targetLang === 'id' ? 'Keterangan: ' : 'Note: '}
                             {isTranslating ? t.translating : (currentNoteTranslation || item.note)}
                          </div>
                        )}
                      </div>
                    )}
                  </footer>
                </div>

                {/* CAPTURE BRANDING Overlay (Visible only when capturing) */}
                {isCapturing && (
                  <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-1 z-50 py-4 bg-inherit border-t border-black/10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 text-blue-500">{t.shareLabel}</p>
                    <p className="text-[8px] font-mono opacity-30">{window.location.origin}</p>
                  </div>
                )}
             </div>

            {/* PERSISTENT ACTION HUB (BOTTOM RIGHT) */}
            <div className="absolute bottom-6 right-6 flex gap-3 z-30">
               <button 
                 onClick={() => toggleBookmark(item.id)}
                 className={`p-4 rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 ${bookmarks.includes(`${category}-${item.id}`) ? 'bg-yellow-400 text-black' : isA11yMode ? 'bg-yellow-300 text-black border-4 border-white' : 'bg-slate-200 text-slate-800'}`}
                 aria-label={t.bookmark}
                 title={t.bookmark}
               >
                 <BookmarkIcon size={24} filled={bookmarks.includes(`${category}-${item.id}`)} />
               </button>
               <button 
                 onClick={() => speak(currentTranslation || item.translation, targetLang === 'id' ? (lang === 'id' ? 'id-ID' : 'en-US') : targetLang)}
                 className={`p-4 rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 ${isA11yMode ? 'bg-yellow-300 text-black border-4 border-white' : 'bg-green-500 text-white'}`}
                 aria-label={t.readTranslation}
                 title={t.readTranslation}
               >
                 <HeadphonesIcon size={24} />
               </button>
               <button 
                onClick={() => copyToClipboard(`${item.arabic}\n\n${currentTranslation || item.translation}`)}
                className={`p-4 rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 ${isA11yMode ? 'bg-yellow-300 text-black border-4 border-white' : 'bg-blue-600 text-white'}`}
                aria-label={t.copy}
               >
                 <CopyIcon size={24} />
               </button>
               <button 
                onClick={() => { vibrate(30); setShowShareOptions(true); }}
                className={`p-4 rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 ${isA11yMode ? 'bg-yellow-300 text-black border-4 border-white' : 'bg-slate-900 text-white'}`}
                aria-label={t.share}
               >
                 <ShareIcon size={24} />
               </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* SHARE MODAL */}
      <AnimatePresence>
        {showShareOptions && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setShowShareOptions(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}
              onClick={(e) => e.stopPropagation()}
            >
               <h3 className="text-2xl font-black uppercase tracking-tight text-center mb-8">{t.shareAs}</h3>
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={shareAsImage}
                    disabled={isCapturing}
                    className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-blue-500 text-white active:scale-95 transition-all disabled:opacity-50"
                  >
                     {isCapturing ? (
                       <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white" />
                     ) : (
                       <ImageIcon size={40} />
                     )}
                     <span className="font-black uppercase tracking-widest text-xs">{isCapturing ? t.preparing : t.asImage}</span>
                  </button>
                  <button 
                    onClick={shareAsGif}
                    disabled={isCapturing}
                    className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-purple-600 text-white active:scale-95 transition-all disabled:opacity-50"
                  >
                     {isCapturing ? (
                        <div className="flex flex-col items-center gap-2">
                           <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white" />
                           <span className="text-[10px] font-mono">{Math.round(captureProgress)}%</span>
                        </div>
                     ) : (
                       <MusicIcon size={40} /> // Using MusicIcon as a representative for animation/video
                     )}
                     <span className="font-black uppercase tracking-widest text-xs">{isCapturing ? t.preparing : t.shareGif}</span>
                  </button>
                  <button 
                    onClick={shareAsText}
                    className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-slate-800 text-white active:scale-95 transition-all col-span-2"
                  >
                     <TypeIcon size={40} />
                     <span className="font-black uppercase tracking-widest text-xs">{t.asText}</span>
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUDIO MINI PLAYER (METALLIC GOLD STYLE) */}
      <div className={`mt-auto p-4 flex flex-col gap-3 relative z-[45] ${isA11yMode ? 'bg-black' : isDarkMode ? 'bg-slate-900 border-t border-slate-800' : 'bg-stone-50 border-t border-stone-200'}`}>
        <audio ref={playerRef} src={activeAudio} />
        
        {/* PLAYER BODY */}
        <div 
          className={`flex flex-col gap-4 p-5 rounded-[2.5rem] shadow-2xl relative overflow-hidden ${isA11yMode ? 'border-4 border-yellow-400 bg-black' : 'bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-600 border-2 border-yellow-100 shadow-[0_20px_50px_rgba(0,0,0,0.3)]'}`}
          style={isA11yMode ? {} : { boxShadow: 'inset 0 4px 10px rgba(255,255,255,1), 0 15px 30px -10px rgba(0,0,0,0.4)' }}
        >
          {/* Animated Waveform Simulation */}
          {isAudioPlaying && !isA11yMode && (
            <div className="absolute inset-0 h-full flex items-center justify-center gap-1 opacity-20 pointer-events-none">
               {[...Array(15)].map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ height: [10, 40, 20, 50, 15] }}
                   transition={{ repeat: Infinity, duration: 0.4 + Math.random(), ease: 'easeInOut' }}
                   className="w-2 bg-yellow-900/40 rounded-full"
                 />
               ))}
            </div>
          )}

          {/* Progress Bar Area */}
          <div className="flex flex-col gap-1 relative z-10">
             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-yellow-950/70">
                <span>{formatTime(audioCurrentTime)}</span>
                <span className="font-black flex items-center gap-2">
                   <div className="flex gap-0.5 h-3 items-end">
                      {[1,2,3].map(i => (
                        <motion.div key={i} animate={isAudioPlaying ? { height: [4, 12, 4] } : { height: 4 }} transition={{ repeat: Infinity, duration: 0.5 + (i * 0.2) }} className="w-1 bg-yellow-900 rounded-full" />
                      ))}
                   </div>
                   {AUDIO_SOURCES.find(s => s.url === activeAudio)?.title}
                </span>
                <span>{formatTime(audioDuration)}</span>
             </div>
             
             {/* Enhanced Progress Scrub */}
             <div className="group relative h-4 flex items-center cursor-pointer">
                <input 
                  type="range"
                  min="0"
                  max={audioDuration || 0}
                  value={audioCurrentTime}
                  onChange={(e) => {
                    const time = parseFloat(e.target.value);
                    if(playerRef.current) playerRef.current.currentTime = time;
                    setAudioCurrentTime(time);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                />
                <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={false}
                     animate={{ width: `${(audioCurrentTime / (audioDuration || 1)) * 100}%` }}
                     className="h-full bg-yellow-950 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                   />
                </div>
                {/* Scrub Handle */}
                <motion.div 
                   style={{ left: `${(audioCurrentTime / (audioDuration || 1)) * 100}%` }}
                   className="absolute h-5 w-5 bg-white border-2 border-yellow-700 rounded-full shadow-lg -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                />
             </div>
          </div>

          <div className="flex items-center justify-between gap-4">
             {/* Dropdown List */}
             <div className="relative flex-1 group">
                <select 
                  value={activeAudio}
                  onChange={(e) => { vibrate(10); setActiveAudio(e.target.value); }}
                  className={`w-full p-3 pl-10 rounded-2xl text-xs font-black appearance-none outline-none transition-all ${isA11yMode ? 'bg-black text-yellow-400 border-2 border-yellow-400' : 'bg-white/40 border-b-4 border-yellow-700/30 focus:bg-white/60 text-yellow-950'}`}
                >
                  {AUDIO_SOURCES.map(source => (
                    <option key={source.id} value={source.url}>{source.title}</option>
                  ))}
                </select>
                <MusicIcon size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isA11yMode ? 'text-yellow-400' : 'text-yellow-900/60'}`} />
             </div>

             {/* Main Controls */}
             <div className="flex items-center gap-2">
                <button 
                  onClick={stopAudio}
                  className={`p-4 rounded-full transition-all active:scale-90 ${isA11yMode ? 'bg-black text-yellow-400 border-4 border-yellow-400' : 'bg-gradient-to-b from-stone-800 to-black text-yellow-400 shadow-xl'}`}
                  aria-label="Stop"
                >
                  <StopIcon size={18} />
                </button>
                <button 
                   onClick={toggleAudio}
                   className={`p-6 rounded-full transition-all active:scale-90 shadow-2xl relative group ${isA11yMode ? 'bg-yellow-400 text-black border-4 border-white' : 'bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600 text-yellow-950 border-2 border-yellow-200'}`}
                   aria-label={isAudioPlaying ? t.paused : t.playing}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {isAudioPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION FOOTER */}
      {showFooterNav && (
        <footer className={`sticky bottom-0 p-4 md:p-6 flex flex-col gap-4 z-50 border-t ${isA11yMode ? 'bg-black border-yellow-300' : isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200'}`}>
          <div className="flex gap-4 md:gap-8 w-full font-black">
            <button 
              onClick={handlePrev}
              className={`flex-1 p-4 md:p-6 rounded-[25px] text-lg md:text-xl transition-all active:scale-95 border-b-4 focus:ring-4 focus:ring-blue-400 outline-none ${isA11yMode ? 'bg-black border-yellow-300 text-yellow-300 shadow-[8px_8px_0px_#fde047]' : isDarkMode ? 'bg-slate-800 border-slate-700 text-white shadow-lg' : 'bg-slate-100 border-slate-200 text-slate-800 shadow-md'}`}
            >
              <ChevronLeft size={isA11yMode ? 48 : 24} className="inline mr-2" /> <span>{t.prev}</span>
            </button>
            
            <button 
              onClick={handleNext}
              className={`flex-1 p-4 md:p-6 rounded-[25px] text-lg md:text-xl transition-all active:scale-95 border-b-4 focus:ring-4 focus:ring-blue-400 outline-none ${isA11yMode ? 'bg-yellow-300 border-yellow-400 text-black shadow-[8px_8px_0px_#ffffff]' : isDarkMode ? 'bg-blue-600 border-blue-700 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-white shadow-xl'}`}
            >
              <span>{t.next}</span> <ChevronRight size={isA11yMode ? 48 : 24} className="inline ml-2" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-1 opacity-50">
            <a href="mailto:hijr.time+doadzikir@gmail.com" className="flex items-center gap-2 font-black text-[10px] md:text-xs hover:underline">
              {t.contactUs}
            </a>
            <p className="text-[10px] md:text-xs font-bold italic text-center">
              {t.devBy} @{new Date().getFullYear()}
            </p>
          </div>
        </footer>
      )}

      <style>{`
        .accessibility button:focus { outline: 10px solid #fde047; outline-offset: 8px; }
        .dir-rtl { direction: rtl; font-family: 'Amiri', serif; }
        * { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
