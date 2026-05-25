import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  DAY_OPTIONS,
  SETTING_TABS,
  WORKSPACE_TABS,
  mergeClientSettings,
} from "../../data/settingsData";

const LANGUAGE_TO_CODE = {
  English: "en",
  Vietnamese: "vi",
};

function normalizeLanguage(language) {
  return language === "Vietnamese" ? "Vietnamese" : "English";
}

const TAB_LABEL_KEYS = {
  account: "tabAccount",
  general: "tabGeneral",
  subscription: "tabSubscription",
  theme: "tabTheme",
  sidebar: "tabSidebar",
  quickAdd: "tabQuickAdd",
  productivity: "tabProductivity",
  reminders: "tabReminders",
  notifications: "tabNotifications",
  backups: "tabBackups",
  integrations: "tabIntegrations",
  calendars: "tabCalendars",
  wsGeneral: "tabWsGeneral",
  wsPeople: "tabWsPeople",
  wsSubscription: "tabWsSubscription",
};

const DAY_KEY_MAP = {
  Mon: "dayMon",
  Tue: "dayTue",
  Wed: "dayWed",
  Thu: "dayThu",
  Fri: "dayFri",
  Sat: "daySat",
  Sun: "daySun",
};

const I18N = {
  en: {
    settingsTitle: "Settings",
    close: "Close",
    cancel: "Cancel",
    update: "Update",
    saving: "Saving…",
    searchPlaceholder: "Search",
    searchSettingsAria: "Search settings",
    workspaceFallback: "Workspace",
    loadingSettings: "Loading settings…",
    saveSuccess: "Settings updated successfully.",
    saveFailed: "Failed to save settings",

    tabAccount: "Account",
    tabGeneral: "General",
    tabSubscription: "Subscription",
    tabTheme: "Theme",
    tabSidebar: "Sidebar",
    tabQuickAdd: "Quick Add",
    tabProductivity: "Productivity",
    tabReminders: "Reminders",
    tabNotifications: "Notifications",
    tabBackups: "Backups",
    tabIntegrations: "Integrations",
    tabCalendars: "Calendars",
    tabWsGeneral: "General",
    tabWsPeople: "People",
    tabWsSubscription: "Subscription",

    accountIntro: "Manage your profile and sign-in credentials. Changes apply immediately after you click Update.",
    fullName: "Full name",
    gmail: "Gmail",
    changePassword: "Change password",
    currentPassword: "Current password",
    newPassword: "New password",
    currentPasswordPlaceholder: "Required to set a new password",
    newPasswordPlaceholder: "At least 6 characters",

    generalIntro: "Customize language, time format, and your default home view.",
    language: "Language",
    langEnglish: "English",
    langVietnamese: "Vietnamese",
    langFrench: "French",
    langGerman: "German",
    timeFormat: "Time format",
    time12h: "12-hour",
    time24h: "24-hour",
    weekStart: "Start of week",
    monday: "Monday",
    sunday: "Sunday",
    homeView: "Home view",
    viewInbox: "Inbox",
    viewToday: "Today",
    viewUpcoming: "Upcoming",

    subscriptionIntro: "Your current plan and billing details.",
    planPrefix: "Plan",
    planFree: "Free",
    planPro: "Pro",
    planProDesc: "Unlimited projects, reminders, and team features.",
    planFreeDesc: "Core task management with up to 5 active projects.",
    upgradeToPro: "Upgrade to Pro",
    upgradeSoon: "Upgrade coming soon",

    themeIntro: "Choose how TaskFlow looks on your device.",
    theme: "Theme",
    themeSystem: "Match system",
    themeLight: "Light",
    themeDark: "Dark",
    reduceMotion: "Reduce motion",
    reduceMotionDesc: "Minimize motion effects throughout the app.",

    sidebarIntro: "Control what appears in your left sidebar.",
    showTaskCounts: "Show task counts",
    showTaskCountsDesc: "Display counts next to Inbox and Today.",
    showCompletedCount: "Show completed count",
    showCompletedCountDesc: "Include completed tasks in project counts.",
    compactSidebar: "Compact sidebar",
    compactSidebarDesc: "Use smaller spacing for navigation items.",

    quickAddIntro: "Configure how new tasks are created with Quick Add.",
    smartDateParsing: "Smart date parsing",
    smartDateParsingDesc: 'Understand phrases like "tomorrow at 9am".',
    defaultToInbox: "Default to Inbox",
    defaultToInboxDesc: "New tasks go to Inbox unless a project is selected.",
    addToBottom: "Add to bottom of list",
    addToBottomDesc: "Place new tasks at the end instead of the top.",

    productivityIntro: "Celebrate your progress and set goals to keep your momentum.",
    karma: "Todoist Karma",
    karmaDesc: "Stay motivated with Karma points.",
    goals: "Goals",
    dailyTasks: "Daily tasks",
    weeklyTasks: "Weekly tasks",
    goalCelebrations: "Goal celebrations",
    goalCelebrationsDesc: "Celebrate when you reach daily and weekly goals.",
    daysOff: "Days off",
    vacationMode: "Vacation mode",
    vacationModeDesc: "Streaks and Karma stay while you take time off.",

    remindersIntro: "Set default reminder behavior for tasks with due dates.",
    defaultReminder: "Default reminder",
    reminderNone: "No default reminder",
    reminderAtDue: "At due time",
    reminder5m: "5 minutes before",
    reminder30m: "30 minutes before",
    reminder1h: "1 hour before",
    reminder1d: "1 day before",
    autoRemind: "Auto-remind on due date",
    autoRemindDesc: "Automatically add a reminder when you set a due date.",

    notificationsIntro: "Choose how and when TaskFlow notifies you.",
    emailNotifications: "Email notifications",
    emailNotificationsDesc: "Receive updates and reminders by email.",
    desktopNotifications: "Desktop notifications",
    desktopNotificationsDesc: "Show browser notifications for due tasks.",
    reminderAlerts: "Reminder alerts",
    reminderAlertsDesc: "Get notified when reminders trigger.",
    productUpdates: "Product updates",
    productUpdatesDesc: "Occasional emails about new features.",

    backupsIntro: "Keep your data safe with automatic backups and manual exports.",
    autoBackups: "Automatic backups",
    autoBackupsDesc: "Save a snapshot of your tasks in the cloud.",
    backupFrequency: "Backup frequency",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    exportNow: "Export data now",
    exporting: "Exporting…",
    exportSuccess: "Backup downloaded successfully.",
    exportFailed: "Export failed",

    integrationsIntro: "Connect TaskFlow with your favorite tools.",
    googleCalendarDesc: "Sync tasks with due dates to Google Calendar.",
    slackDesc: "Get task notifications in Slack channels.",
    githubDesc: "Link commits and pull requests to tasks.",

    calendarsIntro: "Customize calendar and Upcoming view behavior.",
    weekStartsOn: "Week starts on",
    timezone: "Timezone",
    timezoneAuto: "Auto-detect",
    showWeekends: "Show weekends",
    showWeekendsDesc: "Display Saturday and Sunday in calendar views.",

    workspaceGeneralIntro: "Manage your team workspace preferences.",
    workspaceName: "Workspace name",
    allowInvites: "Allow invites",
    allowInvitesDesc: "Let workspace members invite new people.",

    workspacePeopleIntro: "Invite teammates to collaborate in this workspace.",
    invitePlaceholder: "colleague@company.com",
    invite: "Invite",
    remove: "Remove",
    noPendingInvites: "No pending invites yet.",

    workspaceSubscriptionIntro: "Team workspace billing and plan details.",
    teamFreeName: "Team Free",
    teamFreeDesc: "Up to 5 members, shared projects, and basic collaboration.",
    currentPlan: "Current plan",
    teamProName: "Team Pro",

    dayMon: "Mon",
    dayTue: "Tue",
    dayWed: "Wed",
    dayThu: "Thu",
    dayFri: "Fri",
    daySat: "Sat",
    daySun: "Sun",
  },
  vi: {
    settingsTitle: "Cài đặt",
    close: "Đóng",
    cancel: "Hủy",
    update: "Cập nhật",
    saving: "Đang lưu…",
    searchPlaceholder: "Tìm kiếm",
    searchSettingsAria: "Tìm kiếm cài đặt",
    workspaceFallback: "Không gian làm việc",
    loadingSettings: "Đang tải cài đặt…",
    saveSuccess: "Đã cập nhật cài đặt thành công.",
    saveFailed: "Lưu cài đặt thất bại",

    tabAccount: "Tài khoản",
    tabGeneral: "Chung",
    tabSubscription: "Gói dịch vụ",
    tabTheme: "Giao diện",
    tabSidebar: "Thanh bên",
    tabQuickAdd: "Thêm nhanh",
    tabProductivity: "Năng suất",
    tabReminders: "Nhắc việc",
    tabNotifications: "Thông báo",
    tabBackups: "Sao lưu",
    tabIntegrations: "Tích hợp",
    tabCalendars: "Lịch",
    tabWsGeneral: "Chung",
    tabWsPeople: "Thành viên",
    tabWsSubscription: "Gói dịch vụ",

    accountIntro: "Quản lý hồ sơ và thông tin đăng nhập. Thay đổi sẽ được áp dụng ngay sau khi bạn bấm Cập nhật.",
    fullName: "Họ và tên",
    gmail: "Gmail",
    changePassword: "Đổi mật khẩu",
    currentPassword: "Mật khẩu hiện tại",
    newPassword: "Mật khẩu mới",
    currentPasswordPlaceholder: "Bắt buộc khi đặt mật khẩu mới",
    newPasswordPlaceholder: "Ít nhất 6 ký tự",

    generalIntro: "Tùy chỉnh ngôn ngữ, định dạng thời gian và màn hình mặc định.",
    language: "Ngôn ngữ",
    langEnglish: "Tiếng Anh",
    langVietnamese: "Tiếng Việt",
    langFrench: "Tiếng Pháp",
    langGerman: "Tiếng Đức",
    timeFormat: "Định dạng giờ",
    time12h: "12 giờ",
    time24h: "24 giờ",
    weekStart: "Bắt đầu tuần",
    monday: "Thứ Hai",
    sunday: "Chủ Nhật",
    homeView: "Màn hình mặc định",
    viewInbox: "Hộp thư đến",
    viewToday: "Hôm nay",
    viewUpcoming: "Sắp tới",

    subscriptionIntro: "Gói hiện tại và thông tin thanh toán của bạn.",
    planPrefix: "Gói",
    planFree: "Miễn phí",
    planPro: "Pro",
    planProDesc: "Không giới hạn dự án, nhắc việc và tính năng nhóm.",
    planFreeDesc: "Quản lý công việc cơ bản với tối đa 5 dự án đang hoạt động.",
    upgradeToPro: "Nâng cấp lên Pro",
    upgradeSoon: "Tính năng nâng cấp sắp ra mắt",

    themeIntro: "Chọn giao diện TaskFlow trên thiết bị của bạn.",
    theme: "Giao diện",
    themeSystem: "Theo hệ thống",
    themeLight: "Sáng",
    themeDark: "Tối",
    reduceMotion: "Giảm hiệu ứng chuyển động",
    reduceMotionDesc: "Giảm hiệu ứng chuyển động trong toàn bộ ứng dụng.",

    sidebarIntro: "Tùy chỉnh nội dung hiển thị ở thanh bên trái.",
    showTaskCounts: "Hiện số lượng công việc",
    showTaskCountsDesc: "Hiển thị số lượng cạnh Hộp thư đến và Hôm nay.",
    showCompletedCount: "Hiện số việc đã hoàn thành",
    showCompletedCountDesc: "Bao gồm việc đã hoàn thành trong số lượng dự án.",
    compactSidebar: "Thanh bên gọn",
    compactSidebarDesc: "Dùng khoảng cách nhỏ hơn cho mục điều hướng.",

    quickAddIntro: "Tùy chỉnh cách tạo công việc mới bằng Thêm nhanh.",
    smartDateParsing: "Phân tích ngày thông minh",
    smartDateParsingDesc: 'Hiểu cụm như "ngày mai lúc 9 giờ".',
    defaultToInbox: "Mặc định vào Hộp thư đến",
    defaultToInboxDesc: "Việc mới sẽ vào Hộp thư đến nếu chưa chọn dự án.",
    addToBottom: "Thêm vào cuối danh sách",
    addToBottomDesc: "Đặt việc mới ở cuối thay vì đầu danh sách.",

    productivityIntro: "Ăn mừng tiến bộ mỗi ngày giúp bạn duy trì thành công lâu dài. Hãy đặt mục tiêu để giữ nhịp làm việc!",
    karma: "Điểm Karma Todoist",
    karmaDesc: "Giữ động lực với điểm Karma.",
    goals: "Mục tiêu",
    dailyTasks: "Công việc mỗi ngày",
    weeklyTasks: "Công việc mỗi tuần",
    goalCelebrations: "Ăn mừng khi đạt mục tiêu",
    goalCelebrationsDesc: "Ăn mừng khi đạt mục tiêu ngày và tuần.",
    daysOff: "Ngày nghỉ",
    vacationMode: "Chế độ nghỉ phép",
    vacationModeDesc: "Chuỗi ngày và Karma được giữ nguyên khi bạn nghỉ.",

    remindersIntro: "Đặt hành vi nhắc việc mặc định cho công việc có ngày đến hạn.",
    defaultReminder: "Nhắc việc mặc định",
    reminderNone: "Không nhắc mặc định",
    reminderAtDue: "Đúng giờ đến hạn",
    reminder5m: "Trước 5 phút",
    reminder30m: "Trước 30 phút",
    reminder1h: "Trước 1 giờ",
    reminder1d: "Trước 1 ngày",
    autoRemind: "Tự nhắc khi đặt ngày hạn",
    autoRemindDesc: "Tự động thêm nhắc việc khi bạn chọn ngày đến hạn.",

    notificationsIntro: "Chọn cách và thời điểm TaskFlow gửi thông báo cho bạn.",
    emailNotifications: "Thông báo qua email",
    emailNotificationsDesc: "Nhận cập nhật và nhắc việc qua email.",
    desktopNotifications: "Thông báo trên máy tính",
    desktopNotificationsDesc: "Hiện thông báo trình duyệt cho việc đến hạn.",
    reminderAlerts: "Cảnh báo nhắc việc",
    reminderAlertsDesc: "Nhận thông báo khi nhắc việc được kích hoạt.",
    productUpdates: "Cập nhật sản phẩm",
    productUpdatesDesc: "Nhận email về tính năng mới (không thường xuyên).",

    backupsIntro: "Giữ dữ liệu an toàn với sao lưu tự động và xuất thủ công.",
    autoBackups: "Sao lưu tự động",
    autoBackupsDesc: "Lưu ảnh chụp dữ liệu công việc của bạn lên đám mây.",
    backupFrequency: "Tần suất sao lưu",
    daily: "Hàng ngày",
    weekly: "Hàng tuần",
    monthly: "Hàng tháng",
    exportNow: "Xuất dữ liệu ngay",
    exporting: "Đang xuất…",
    exportSuccess: "Đã tải bản sao lưu thành công.",
    exportFailed: "Xuất dữ liệu thất bại",

    integrationsIntro: "Kết nối TaskFlow với các công cụ bạn yêu thích.",
    googleCalendarDesc: "Đồng bộ công việc có ngày hạn với Google Calendar.",
    slackDesc: "Nhận thông báo công việc trong kênh Slack.",
    githubDesc: "Liên kết commit và pull request với công việc.",

    calendarsIntro: "Tùy chỉnh hành vi của Lịch và màn hình Sắp tới.",
    weekStartsOn: "Tuần bắt đầu từ",
    timezone: "Múi giờ",
    timezoneAuto: "Tự động nhận diện",
    showWeekends: "Hiển thị cuối tuần",
    showWeekendsDesc: "Hiển thị Thứ Bảy và Chủ Nhật trong lịch.",

    workspaceGeneralIntro: "Quản lý tùy chọn không gian làm việc nhóm.",
    workspaceName: "Tên không gian làm việc",
    allowInvites: "Cho phép mời thành viên",
    allowInvitesDesc: "Cho phép thành viên mời người mới vào không gian làm việc.",

    workspacePeopleIntro: "Mời đồng đội cộng tác trong không gian làm việc này.",
    invitePlaceholder: "dongnghiep@congty.com",
    invite: "Mời",
    remove: "Xóa",
    noPendingInvites: "Chưa có lời mời nào đang chờ.",

    workspaceSubscriptionIntro: "Thông tin gói và thanh toán của không gian làm việc nhóm.",
    teamFreeName: "Nhóm miễn phí",
    teamFreeDesc: "Tối đa 5 thành viên, dự án chia sẻ và cộng tác cơ bản.",
    currentPlan: "Gói hiện tại",
    teamProName: "Nhóm Pro",

    dayMon: "T2",
    dayTue: "T3",
    dayWed: "T4",
    dayThu: "T5",
    dayFri: "T6",
    daySat: "T7",
    daySun: "CN",
  },
  fr: {
    settingsTitle: "Parametres",
    close: "Fermer",
    cancel: "Annuler",
    update: "Mettre a jour",
    saving: "Enregistrement…",
    searchPlaceholder: "Rechercher",
    searchSettingsAria: "Rechercher des parametres",
    workspaceFallback: "Espace de travail",
    loadingSettings: "Chargement des parametres…",
    saveSuccess: "Parametres mis a jour avec succes.",
    saveFailed: "Echec de l'enregistrement des parametres",

    tabAccount: "Compte",
    tabGeneral: "General",
    tabSubscription: "Abonnement",
    tabTheme: "Theme",
    tabSidebar: "Barre laterale",
    tabQuickAdd: "Ajout rapide",
    tabProductivity: "Productivite",
    tabReminders: "Rappels",
    tabNotifications: "Notifications",
    tabBackups: "Sauvegardes",
    tabIntegrations: "Integrations",
    tabCalendars: "Calendriers",
    tabWsGeneral: "General",
    tabWsPeople: "Personnes",
    tabWsSubscription: "Abonnement",

    accountIntro: "Gerez votre profil et vos identifiants de connexion. Les changements sont appliques apres mise a jour.",
    fullName: "Nom complet",
    gmail: "Gmail",
    changePassword: "Changer le mot de passe",
    currentPassword: "Mot de passe actuel",
    newPassword: "Nouveau mot de passe",
    currentPasswordPlaceholder: "Requis pour definir un nouveau mot de passe",
    newPasswordPlaceholder: "Au moins 6 caracteres",

    generalIntro: "Personnalisez la langue, le format d'heure et la vue d'accueil par defaut.",
    language: "Langue",
    langEnglish: "Anglais",
    langVietnamese: "Vietnamien",
    langFrench: "Francais",
    langGerman: "Allemand",
    timeFormat: "Format de l'heure",
    time12h: "12 heures",
    time24h: "24 heures",
    weekStart: "Debut de semaine",
    monday: "Lundi",
    sunday: "Dimanche",
    homeView: "Vue d'accueil",
    viewInbox: "Boite de reception",
    viewToday: "Aujourd'hui",
    viewUpcoming: "A venir",

    subscriptionIntro: "Votre plan actuel et les informations de facturation.",
    planPrefix: "Plan",
    planFree: "Gratuit",
    planPro: "Pro",
    planProDesc: "Projets illimites, rappels et fonctionnalites d'equipe.",
    planFreeDesc: "Gestion des taches de base avec jusqu'a 5 projets actifs.",
    upgradeToPro: "Passer a Pro",
    upgradeSoon: "Mise a niveau bientot disponible",

    themeIntro: "Choisissez l'apparence de TaskFlow sur votre appareil.",
    theme: "Theme",
    themeSystem: "Selon le systeme",
    themeLight: "Clair",
    themeDark: "Sombre",
    reduceMotion: "Reduire les animations",
    reduceMotionDesc: "Reduire les effets de mouvement dans l'application.",

    sidebarIntro: "Controlez ce qui apparait dans la barre laterale gauche.",
    showTaskCounts: "Afficher le nombre de taches",
    showTaskCountsDesc: "Afficher les compteurs a cote de Reception et Aujourd'hui.",
    showCompletedCount: "Afficher les terminees",
    showCompletedCountDesc: "Inclure les taches terminees dans les compteurs des projets.",
    compactSidebar: "Barre laterale compacte",
    compactSidebarDesc: "Utiliser un espacement plus compact.",

    quickAddIntro: "Configurez la creation des nouvelles taches avec Ajout rapide.",
    smartDateParsing: "Analyse intelligente des dates",
    smartDateParsingDesc: 'Comprend des phrases comme "demain a 9h".',
    defaultToInbox: "Par defaut dans la reception",
    defaultToInboxDesc: "Les nouvelles taches vont dans la reception sans projet choisi.",
    addToBottom: "Ajouter en bas de la liste",
    addToBottomDesc: "Placer les nouvelles taches en bas au lieu du haut.",

    productivityIntro: "Celebrez vos progres et fixez des objectifs pour garder votre elan.",
    karma: "Karma Todoist",
    karmaDesc: "Restez motive avec les points Karma.",
    goals: "Objectifs",
    dailyTasks: "Taches quotidiennes",
    weeklyTasks: "Taches hebdomadaires",
    goalCelebrations: "Celebration des objectifs",
    goalCelebrationsDesc: "Celebrez vos objectifs quotidiens et hebdomadaires.",
    daysOff: "Jours de repos",
    vacationMode: "Mode vacances",
    vacationModeDesc: "Les series et le Karma restent pendant vos pauses.",

    remindersIntro: "Definissez les rappels par defaut pour les taches avec echeance.",
    defaultReminder: "Rappel par defaut",
    reminderNone: "Aucun rappel par defaut",
    reminderAtDue: "A l'heure d'echeance",
    reminder5m: "5 minutes avant",
    reminder30m: "30 minutes avant",
    reminder1h: "1 heure avant",
    reminder1d: "1 jour avant",
    autoRemind: "Rappel automatique a l'echeance",
    autoRemindDesc: "Ajouter automatiquement un rappel quand vous fixez une echeance.",

    notificationsIntro: "Choisissez comment et quand TaskFlow vous notifie.",
    emailNotifications: "Notifications e-mail",
    emailNotificationsDesc: "Recevez mises a jour et rappels par e-mail.",
    desktopNotifications: "Notifications bureau",
    desktopNotificationsDesc: "Afficher des notifications navigateur pour les taches echeance.",
    reminderAlerts: "Alertes de rappel",
    reminderAlertsDesc: "Etre notifie quand les rappels se declenchent.",
    productUpdates: "Mises a jour produit",
    productUpdatesDesc: "E-mails occasionnels sur les nouvelles fonctionnalites.",

    backupsIntro: "Gardez vos donnees en securite avec sauvegardes auto et export manuel.",
    autoBackups: "Sauvegardes automatiques",
    autoBackupsDesc: "Enregistrer un instantane de vos taches dans le cloud.",
    backupFrequency: "Frequence de sauvegarde",
    daily: "Quotidienne",
    weekly: "Hebdomadaire",
    monthly: "Mensuelle",
    exportNow: "Exporter les donnees maintenant",
    exporting: "Export en cours…",
    exportSuccess: "Sauvegarde telechargee avec succes.",
    exportFailed: "Echec de l'export",

    integrationsIntro: "Connectez TaskFlow a vos outils preferes.",
    googleCalendarDesc: "Synchroniser les taches avec echeance vers Google Calendar.",
    slackDesc: "Recevoir les notifications de taches dans Slack.",
    githubDesc: "Lier commits et pull requests aux taches.",

    calendarsIntro: "Personnalisez le calendrier et la vue A venir.",
    weekStartsOn: "Semaine commence le",
    timezone: "Fuseau horaire",
    timezoneAuto: "Detection automatique",
    showWeekends: "Afficher les week-ends",
    showWeekendsDesc: "Afficher samedi et dimanche dans les vues calendrier.",

    workspaceGeneralIntro: "Gerez les preferences de votre espace equipe.",
    workspaceName: "Nom de l'espace",
    allowInvites: "Autoriser les invitations",
    allowInvitesDesc: "Permettre aux membres d'inviter de nouvelles personnes.",

    workspacePeopleIntro: "Invitez des collegues a collaborer dans cet espace.",
    invitePlaceholder: "collegue@entreprise.com",
    invite: "Inviter",
    remove: "Supprimer",
    noPendingInvites: "Aucune invitation en attente.",

    workspaceSubscriptionIntro: "Details de facturation et plan d'equipe.",
    teamFreeName: "Equipe Gratuit",
    teamFreeDesc: "Jusqu'a 5 membres, projets partages et collaboration de base.",
    currentPlan: "Plan actuel",
    teamProName: "Equipe Pro",

    dayMon: "Lun",
    dayTue: "Mar",
    dayWed: "Mer",
    dayThu: "Jeu",
    dayFri: "Ven",
    daySat: "Sam",
    daySun: "Dim",
  },
  de: {
    settingsTitle: "Einstellungen",
    close: "Schliessen",
    cancel: "Abbrechen",
    update: "Aktualisieren",
    saving: "Speichern…",
    searchPlaceholder: "Suchen",
    searchSettingsAria: "Einstellungen durchsuchen",
    workspaceFallback: "Arbeitsbereich",
    loadingSettings: "Einstellungen werden geladen…",
    saveSuccess: "Einstellungen erfolgreich aktualisiert.",
    saveFailed: "Speichern der Einstellungen fehlgeschlagen",

    tabAccount: "Konto",
    tabGeneral: "Allgemein",
    tabSubscription: "Abo",
    tabTheme: "Design",
    tabSidebar: "Seitenleiste",
    tabQuickAdd: "Schnellhinzufugen",
    tabProductivity: "Produktivitat",
    tabReminders: "Erinnerungen",
    tabNotifications: "Benachrichtigungen",
    tabBackups: "Backups",
    tabIntegrations: "Integrationen",
    tabCalendars: "Kalender",
    tabWsGeneral: "Allgemein",
    tabWsPeople: "Personen",
    tabWsSubscription: "Abo",

    accountIntro: "Verwalten Sie Ihr Profil und Ihre Anmeldedaten. Anderungen werden nach dem Aktualisieren ubernommen.",
    fullName: "Vollstandiger Name",
    gmail: "Gmail",
    changePassword: "Passwort andern",
    currentPassword: "Aktuelles Passwort",
    newPassword: "Neues Passwort",
    currentPasswordPlaceholder: "Erforderlich fur ein neues Passwort",
    newPasswordPlaceholder: "Mindestens 6 Zeichen",

    generalIntro: "Passen Sie Sprache, Zeitformat und Standardansicht an.",
    language: "Sprache",
    langEnglish: "Englisch",
    langVietnamese: "Vietnamesisch",
    langFrench: "Franzosisch",
    langGerman: "Deutsch",
    timeFormat: "Zeitformat",
    time12h: "12 Stunden",
    time24h: "24 Stunden",
    weekStart: "Wochenbeginn",
    monday: "Montag",
    sunday: "Sonntag",
    homeView: "Startansicht",
    viewInbox: "Posteingang",
    viewToday: "Heute",
    viewUpcoming: "Demnachst",

    subscriptionIntro: "Ihr aktueller Plan und Rechnungsdetails.",
    planPrefix: "Plan",
    planFree: "Kostenlos",
    planPro: "Pro",
    planProDesc: "Unbegrenzte Projekte, Erinnerungen und Teamfunktionen.",
    planFreeDesc: "Basis-Aufgabenverwaltung mit bis zu 5 aktiven Projekten.",
    upgradeToPro: "Auf Pro upgraden",
    upgradeSoon: "Upgrade bald verfugbar",

    themeIntro: "Wahlen Sie, wie TaskFlow auf Ihrem Gerat aussieht.",
    theme: "Design",
    themeSystem: "Systemeinstellung",
    themeLight: "Hell",
    themeDark: "Dunkel",
    reduceMotion: "Bewegung reduzieren",
    reduceMotionDesc: "Bewegungseffekte in der App minimieren.",

    sidebarIntro: "Steuern Sie, was in der linken Seitenleiste angezeigt wird.",
    showTaskCounts: "Aufgabenanzahl anzeigen",
    showTaskCountsDesc: "Anzahl neben Posteingang und Heute anzeigen.",
    showCompletedCount: "Erledigte Anzahl anzeigen",
    showCompletedCountDesc: "Erledigte Aufgaben in Projektzahlen einbeziehen.",
    compactSidebar: "Kompakte Seitenleiste",
    compactSidebarDesc: "Kleinere Abstande fur Navigation verwenden.",

    quickAddIntro: "Konfigurieren Sie, wie neue Aufgaben mit Schnellhinzufugen erstellt werden.",
    smartDateParsing: "Intelligente Datumsanalyse",
    smartDateParsingDesc: 'Versteht Formulierungen wie "morgen um 9 Uhr".',
    defaultToInbox: "Standard in Posteingang",
    defaultToInboxDesc: "Neue Aufgaben gehen in den Posteingang, wenn kein Projekt gewahlt ist.",
    addToBottom: "Am Listenende hinzufugen",
    addToBottomDesc: "Neue Aufgaben unten statt oben platzieren.",

    productivityIntro: "Feiern Sie Fortschritte und setzen Sie Ziele fur mehr Momentum.",
    karma: "Todoist Karma",
    karmaDesc: "Motiviert bleiben mit Karma-Punkten.",
    goals: "Ziele",
    dailyTasks: "Tagliche Aufgaben",
    weeklyTasks: "Wochentliche Aufgaben",
    goalCelebrations: "Ziel-Feiern",
    goalCelebrationsDesc: "Feiern bei Erreichen von Tages- und Wochenzielen.",
    daysOff: "Freie Tage",
    vacationMode: "Urlaubsmodus",
    vacationModeDesc: "Serien und Karma bleiben erhalten, wahrend Sie pausieren.",

    remindersIntro: "Standard-Erinnerungen fur Aufgaben mit Falligkeit festlegen.",
    defaultReminder: "Standard-Erinnerung",
    reminderNone: "Keine Standard-Erinnerung",
    reminderAtDue: "Zum Falligkeitszeitpunkt",
    reminder5m: "5 Minuten vorher",
    reminder30m: "30 Minuten vorher",
    reminder1h: "1 Stunde vorher",
    reminder1d: "1 Tag vorher",
    autoRemind: "Automatische Erinnerung bei Falligkeit",
    autoRemindDesc: "Automatisch Erinnerung hinzufugen, wenn ein Datum gesetzt wird.",

    notificationsIntro: "Wahlen Sie, wie und wann TaskFlow Sie benachrichtigt.",
    emailNotifications: "E-Mail-Benachrichtigungen",
    emailNotificationsDesc: "Updates und Erinnerungen per E-Mail erhalten.",
    desktopNotifications: "Desktop-Benachrichtigungen",
    desktopNotificationsDesc: "Browser-Benachrichtigungen fur fallige Aufgaben anzeigen.",
    reminderAlerts: "Erinnerungsalarme",
    reminderAlertsDesc: "Benachrichtigt werden, wenn Erinnerungen auslosen.",
    productUpdates: "Produkt-Updates",
    productUpdatesDesc: "Gelegentliche E-Mails zu neuen Funktionen.",

    backupsIntro: "Schutzen Sie Ihre Daten mit automatischen Backups und manuellem Export.",
    autoBackups: "Automatische Backups",
    autoBackupsDesc: "Schnappschuss Ihrer Aufgaben in der Cloud speichern.",
    backupFrequency: "Backup-Haufigkeit",
    daily: "Taglich",
    weekly: "Wochentlich",
    monthly: "Monatlich",
    exportNow: "Daten jetzt exportieren",
    exporting: "Exportiere…",
    exportSuccess: "Backup erfolgreich heruntergeladen.",
    exportFailed: "Export fehlgeschlagen",

    integrationsIntro: "Verbinden Sie TaskFlow mit Ihren Lieblings-Tools.",
    googleCalendarDesc: "Aufgaben mit Falligkeit mit Google Calendar synchronisieren.",
    slackDesc: "Aufgabenbenachrichtigungen in Slack erhalten.",
    githubDesc: "Commits und Pull Requests mit Aufgaben verknupfen.",

    calendarsIntro: "Kalender- und Demnachst-Ansicht anpassen.",
    weekStartsOn: "Wochenbeginn",
    timezone: "Zeitzone",
    timezoneAuto: "Automatisch erkennen",
    showWeekends: "Wochenenden anzeigen",
    showWeekendsDesc: "Samstag und Sonntag in Kalenderansichten anzeigen.",

    workspaceGeneralIntro: "Einstellungen fur Team-Arbeitsbereich verwalten.",
    workspaceName: "Name des Arbeitsbereichs",
    allowInvites: "Einladungen erlauben",
    allowInvitesDesc: "Mitgliedern erlauben, neue Personen einzuladen.",

    workspacePeopleIntro: "Laden Sie Teammitglieder zur Zusammenarbeit ein.",
    invitePlaceholder: "kollege@firma.com",
    invite: "Einladen",
    remove: "Entfernen",
    noPendingInvites: "Keine ausstehenden Einladungen.",

    workspaceSubscriptionIntro: "Team-Abrechnung und Plan-Details.",
    teamFreeName: "Team Kostenlos",
    teamFreeDesc: "Bis zu 5 Mitglieder, gemeinsame Projekte und Basis-Kollaboration.",
    currentPlan: "Aktueller Plan",
    teamProName: "Team Pro",

    dayMon: "Mo",
    dayTue: "Di",
    dayWed: "Mi",
    dayThu: "Do",
    dayFri: "Fr",
    daySat: "Sa",
    daySun: "So",
  },
};

function getLocaleCode(language) {
  return LANGUAGE_TO_CODE[language] || "en";
}

function getDictionary(language) {
  const code = getLocaleCode(language);
  return I18N[code] || I18N.en;
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`settings-toggle ${checked ? "settings-toggle-on" : "settings-toggle-off"}`}
      onClick={() => onChange(!checked)}
    />
  );
}

function SettingsRow({ label, desc, children }) {
  return (
    <div className="settings-row">
      <div>
        <p className="settings-field-label">{label}</p>
        {desc && <p className="settings-field-desc">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function FieldSelect({ label, value, onChange, options }) {
  return (
    <label className="settings-field-block">
      <span className="settings-field-block-label">{label}</span>
      <select className="settings-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

function PanelAccount({ account, onAccountChange, t }) {
  return (
    <>
      <p className="settings-intro">{t("accountIntro")}</p>
      <div className="settings-form-grid">
        <label className="settings-field-block">
          <span className="settings-field-block-label">{t("fullName")}</span>
          <input
            className="settings-text-input"
            type="text"
            value={account.name}
            onChange={(e) => onAccountChange({ ...account, name: e.target.value })}
          />
        </label>
        <label className="settings-field-block">
          <span className="settings-field-block-label">{t("gmail")}</span>
          <input
            className="settings-text-input"
            type="email"
            value={account.email}
            onChange={(e) => onAccountChange({ ...account, email: e.target.value })}
          />
        </label>
      </div>
      <h4 className="settings-section-title">{t("changePassword")}</h4>
      <div className="settings-form-grid">
        <label className="settings-field-block">
          <span className="settings-field-block-label">{t("currentPassword")}</span>
          <input
            className="settings-text-input"
            type="password"
            value={account.currentPassword || ""}
            onChange={(e) => onAccountChange({ ...account, currentPassword: e.target.value })}
            placeholder={t("currentPasswordPlaceholder")}
          />
        </label>
        <label className="settings-field-block">
          <span className="settings-field-block-label">{t("newPassword")}</span>
          <input
            className="settings-text-input"
            type="password"
            value={account.newPassword || ""}
            onChange={(e) => onAccountChange({ ...account, newPassword: e.target.value })}
            placeholder={t("newPasswordPlaceholder")}
          />
        </label>
      </div>
    </>
  );
}

function PanelGeneral({ s, patch, t }) {
  return (
    <>
      <p className="settings-intro">{t("generalIntro")}</p>
      <div className="settings-form-grid">
        <FieldSelect
          label={t("language")}
          value={s.language}
          onChange={(v) => patch({ language: v })}
          options={[
            { value: "English", label: t("langEnglish") },
            { value: "Vietnamese", label: t("langVietnamese") },
          ]}
        />
        <FieldSelect
          label={t("timeFormat")}
          value={s.timeFormat}
          onChange={(v) => patch({ timeFormat: v })}
          options={[
            { value: "12h", label: t("time12h") },
            { value: "24h", label: t("time24h") },
          ]}
        />
        <FieldSelect
          label={t("weekStart")}
          value={s.startOfWeek}
          onChange={(v) => patch({ startOfWeek: v })}
          options={[
            { value: "monday", label: t("monday") },
            { value: "sunday", label: t("sunday") },
          ]}
        />
        <FieldSelect
          label={t("homeView")}
          value={s.homeView}
          onChange={(v) => patch({ homeView: v })}
          options={[
            { value: "inbox", label: t("viewInbox") },
            { value: "today", label: t("viewToday") },
            { value: "upcoming", label: t("viewUpcoming") },
          ]}
        />
      </div>
    </>
  );
}

function PanelSubscription({ s, t }) {
  const planLabel = s.plan === "pro" ? t("planPro") : t("planFree");
  return (
    <>
      <p className="settings-intro">{t("subscriptionIntro")}</p>
      <div className="settings-plan-card">
        <div>
          <p className="settings-plan-name">{t("planPrefix")} {planLabel}</p>
          <p className="settings-field-desc">
            {s.plan === "pro" ? t("planProDesc") : t("planFreeDesc")}
          </p>
        </div>
        <span className="settings-plan-badge">{planLabel}</span>
      </div>
      {s.plan !== "pro" && (
        <button className="settings-inline-cta" type="button" disabled title={t("upgradeSoon")}>
          {t("upgradeToPro")}
        </button>
      )}
    </>
  );
}

function PanelTheme({ s, patch, t }) {
  return (
    <>
      <p className="settings-intro">{t("themeIntro")}</p>
      <FieldSelect
        label={t("theme")}
        value={s.mode}
        onChange={(v) => patch({ mode: v })}
        options={[
          { value: "system", label: t("themeSystem") },
          { value: "light", label: t("themeLight") },
          { value: "dark", label: t("themeDark") },
        ]}
      />
      <SettingsRow label={t("reduceMotion")} desc={t("reduceMotionDesc")}>
        <Toggle checked={s.reduceMotion} onChange={(v) => patch({ reduceMotion: v })} label={t("reduceMotion")} />
      </SettingsRow>
    </>
  );
}

function PanelSidebar({ s, patch, t }) {
  return (
    <>
      <p className="settings-intro">{t("sidebarIntro")}</p>
      <SettingsRow label={t("showTaskCounts")} desc={t("showTaskCountsDesc")}>
        <Toggle checked={s.showTaskCounts} onChange={(v) => patch({ showTaskCounts: v })} label={t("showTaskCounts")} />
      </SettingsRow>
      <SettingsRow label={t("showCompletedCount")} desc={t("showCompletedCountDesc")}>
        <Toggle checked={s.showCompletedCount} onChange={(v) => patch({ showCompletedCount: v })} label={t("showCompletedCount")} />
      </SettingsRow>
      <SettingsRow label={t("compactSidebar")} desc={t("compactSidebarDesc")}>
        <Toggle checked={s.compactMode} onChange={(v) => patch({ compactMode: v })} label={t("compactSidebar")} />
      </SettingsRow>
    </>
  );
}

function PanelQuickAdd({ s, patch, t }) {
  return (
    <>
      <p className="settings-intro">{t("quickAddIntro")}</p>
      <SettingsRow label={t("smartDateParsing")} desc={t("smartDateParsingDesc")}>
        <Toggle checked={s.smartDateParsing} onChange={(v) => patch({ smartDateParsing: v })} label={t("smartDateParsing")} />
      </SettingsRow>
      <SettingsRow label={t("defaultToInbox")} desc={t("defaultToInboxDesc")}>
        <Toggle checked={s.defaultToInbox} onChange={(v) => patch({ defaultToInbox: v })} label={t("defaultToInbox")} />
      </SettingsRow>
      <SettingsRow label={t("addToBottom")} desc={t("addToBottomDesc")}>
        <Toggle checked={s.addToBottom} onChange={(v) => patch({ addToBottom: v })} label={t("addToBottom")} />
      </SettingsRow>
    </>
  );
}

function PanelProductivity({ s, patch, t }) {
  const toggleDay = (day) => {
    const daysOff = s.daysOff.includes(day)
      ? s.daysOff.filter((d) => d !== day)
      : [...s.daysOff, day];
    patch({ daysOff });
  };

  return (
    <>
      <p className="settings-intro">{t("productivityIntro")}</p>
      <SettingsRow label={t("karma")} desc={t("karmaDesc")}>
        <Toggle checked={s.karmaEnabled} onChange={(v) => patch({ karmaEnabled: v })} label={t("karma")} />
      </SettingsRow>
      <h4 className="settings-section-title">{t("goals")}</h4>
      <div className="goal-fields">
        <label className="goal-label">
          {t("dailyTasks")}
          <input
            className="goal-input"
            type="number"
            min={1}
            max={100}
            value={s.dailyGoal}
            onChange={(e) => patch({ dailyGoal: Number(e.target.value) || 1 })}
          />
        </label>
        <label className="goal-label">
          {t("weeklyTasks")}
          <input
            className="goal-input"
            type="number"
            min={1}
            max={500}
            value={s.weeklyGoal}
            onChange={(e) => patch({ weeklyGoal: Number(e.target.value) || 1 })}
          />
        </label>
      </div>
      <SettingsRow label={t("goalCelebrations")} desc={t("goalCelebrationsDesc")}>
        <Toggle checked={s.goalCelebrations} onChange={(v) => patch({ goalCelebrations: v })} label={t("goalCelebrations")} />
      </SettingsRow>
      <h4 className="settings-section-title">{t("daysOff")}</h4>
      <div className="days-off-row">
        {DAY_OPTIONS.map((day) => (
          <label key={day} className="day-check">
            <input type="checkbox" checked={s.daysOff.includes(day)} onChange={() => toggleDay(day)} />
            {t(DAY_KEY_MAP[day] || day)}
          </label>
        ))}
      </div>
      <SettingsRow label={t("vacationMode")} desc={t("vacationModeDesc")}>
        <Toggle checked={s.vacationMode} onChange={(v) => patch({ vacationMode: v })} label={t("vacationMode")} />
      </SettingsRow>
    </>
  );
}

function PanelReminders({ s, patch, t }) {
  return (
    <>
      <p className="settings-intro">{t("remindersIntro")}</p>
      <FieldSelect
        label={t("defaultReminder")}
        value={s.defaultReminder}
        onChange={(v) => patch({ defaultReminder: v })}
        options={[
          { value: "none", label: t("reminderNone") },
          { value: "0", label: t("reminderAtDue") },
          { value: "5", label: t("reminder5m") },
          { value: "30", label: t("reminder30m") },
          { value: "60", label: t("reminder1h") },
          { value: "1440", label: t("reminder1d") },
        ]}
      />
      <SettingsRow label={t("autoRemind")} desc={t("autoRemindDesc")}>
        <Toggle checked={s.autoRemindOnDue} onChange={(v) => patch({ autoRemindOnDue: v })} label={t("autoRemind")} />
      </SettingsRow>
    </>
  );
}

function PanelNotifications({ s, patch, t }) {
  return (
    <>
      <p className="settings-intro">{t("notificationsIntro")}</p>
      <SettingsRow label={t("emailNotifications")} desc={t("emailNotificationsDesc")}>
        <Toggle checked={s.email} onChange={(v) => patch({ email: v })} label={t("emailNotifications")} />
      </SettingsRow>
      <SettingsRow label={t("desktopNotifications")} desc={t("desktopNotificationsDesc")}>
        <Toggle checked={s.desktop} onChange={(v) => patch({ desktop: v })} label={t("desktopNotifications")} />
      </SettingsRow>
      <SettingsRow label={t("reminderAlerts")} desc={t("reminderAlertsDesc")}>
        <Toggle checked={s.reminders} onChange={(v) => patch({ reminders: v })} label={t("reminderAlerts")} />
      </SettingsRow>
      <SettingsRow label={t("productUpdates")} desc={t("productUpdatesDesc")}>
        <Toggle checked={s.productUpdates} onChange={(v) => patch({ productUpdates: v })} label={t("productUpdates")} />
      </SettingsRow>
    </>
  );
}

function PanelBackups({ s, patch, onExport, t }) {
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState("");

  async function handleExport() {
    setExporting(true);
    setExportMsg("");
    try {
      await onExport();
      setExportMsg(t("exportSuccess"));
    } catch (err) {
      setExportMsg(err.message || t("exportFailed"));
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <p className="settings-intro">{t("backupsIntro")}</p>
      <SettingsRow label={t("autoBackups")} desc={t("autoBackupsDesc")}>
        <Toggle checked={s.autoBackup} onChange={(v) => patch({ autoBackup: v })} label={t("autoBackups")} />
      </SettingsRow>
      <FieldSelect
        label={t("backupFrequency")}
        value={s.backupFrequency}
        onChange={(v) => patch({ backupFrequency: v })}
        options={[
          { value: "daily", label: t("daily") },
          { value: "weekly", label: t("weekly") },
          { value: "monthly", label: t("monthly") },
        ]}
      />
      <div className="settings-export-row">
        <button className="settings-inline-cta" type="button" onClick={handleExport} disabled={exporting}>
          {exporting ? t("exporting") : t("exportNow")}
        </button>
        {exportMsg && <p className="settings-status-msg">{exportMsg}</p>}
      </div>
    </>
  );
}

function PanelIntegrations({ s, patch, t }) {
  return (
    <>
      <p className="settings-intro">{t("integrationsIntro")}</p>
      <SettingsRow label="Google Calendar" desc={t("googleCalendarDesc")}>
        <Toggle checked={s.googleCalendar} onChange={(v) => patch({ googleCalendar: v })} label="Google Calendar" />
      </SettingsRow>
      <SettingsRow label="Slack" desc={t("slackDesc")}>
        <Toggle checked={s.slack} onChange={(v) => patch({ slack: v })} label="Slack" />
      </SettingsRow>
      <SettingsRow label="GitHub" desc={t("githubDesc")}>
        <Toggle checked={s.github} onChange={(v) => patch({ github: v })} label="GitHub" />
      </SettingsRow>
    </>
  );
}

function PanelCalendars({ s, patch, t }) {
  return (
    <>
      <p className="settings-intro">{t("calendarsIntro")}</p>
      <div className="settings-form-grid">
        <FieldSelect
          label={t("weekStartsOn")}
          value={s.weekStartsOn}
          onChange={(v) => patch({ weekStartsOn: v })}
          options={[
            { value: "monday", label: t("monday") },
            { value: "sunday", label: t("sunday") },
          ]}
        />
        <FieldSelect
          label={t("timezone")}
          value={s.timezone}
          onChange={(v) => patch({ timezone: v })}
          options={[
            { value: "auto", label: t("timezoneAuto") },
            { value: "Asia/Ho_Chi_Minh", label: "Asia/Ho Chi Minh" },
            { value: "America/New_York", label: "America/New York" },
            { value: "Europe/London", label: "Europe/London" },
          ]}
        />
      </div>
      <SettingsRow label={t("showWeekends")} desc={t("showWeekendsDesc")}>
        <Toggle checked={s.showWeekends} onChange={(v) => patch({ showWeekends: v })} label={t("showWeekends")} />
      </SettingsRow>
    </>
  );
}

function PanelWorkspaceGeneral({ s, patch, t }) {
  return (
    <>
      <p className="settings-intro">{t("workspaceGeneralIntro")}</p>
      <label className="settings-field-block">
        <span className="settings-field-block-label">{t("workspaceName")}</span>
        <input
          className="settings-text-input"
          type="text"
          value={s.name}
          onChange={(e) => patch({ name: e.target.value })}
        />
      </label>
      <SettingsRow label={t("allowInvites")} desc={t("allowInvitesDesc")}>
        <Toggle checked={s.allowInvites} onChange={(v) => patch({ allowInvites: v })} label={t("allowInvites")} />
      </SettingsRow>
    </>
  );
}

function PanelWorkspacePeople({ s, patch, inviteEmail, setInviteEmail, t }) {
  function addInvite() {
    const email = inviteEmail.trim().toLowerCase();
    if (!email || s.invitedEmails.includes(email)) return;
    patch({ invitedEmails: [...s.invitedEmails, email] });
    setInviteEmail("");
  }

  function removeInvite(email) {
    patch({ invitedEmails: s.invitedEmails.filter((e) => e !== email) });
  }

  return (
    <>
      <p className="settings-intro">{t("workspacePeopleIntro")}</p>
      <div className="settings-invite-row">
        <input
          className="settings-text-input"
          type="email"
          placeholder={t("invitePlaceholder")}
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInvite(); } }}
        />
        <button className="btn-primary" type="button" onClick={addInvite}>{t("invite")}</button>
      </div>
      {s.invitedEmails.length > 0 ? (
        <ul className="settings-invite-list">
          {s.invitedEmails.map((email) => (
            <li key={email}>
              <span>{email}</span>
              <button type="button" className="settings-remove-btn" onClick={() => removeInvite(email)}>{t("remove")}</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="settings-field-desc">{t("noPendingInvites")}</p>
      )}
    </>
  );
}

function PanelWorkspaceSubscription({ s, t }) {
  return (
    <>
      <p className="settings-intro">{t("workspaceSubscriptionIntro")}</p>
      <div className="settings-plan-card">
        <div>
          <p className="settings-plan-name">{t("teamFreeName")}</p>
          <p className="settings-field-desc">{t("teamFreeDesc")}</p>
        </div>
        <span className="settings-plan-badge">{t("planFree")}</span>
      </div>
      <p className="settings-field-desc">
        {t("currentPlan")}: <strong>{s.plan === "team_pro" ? t("teamProName") : t("teamFreeName")}</strong>
      </p>
    </>
  );
}

export default function SettingsModal({
  isOpen,
  activeTab,
  onSelectTab,
  onClose,
  settings,
  account,
  loading,
  saving,
  error,
  onSave,
  onExport,
}) {
  const [draft, setDraft] = useState(() => mergeClientSettings(null));
  const [accountDraft, setAccountDraft] = useState({ name: "", email: "", currentPassword: "", newPassword: "" });
  const [search, setSearch] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [uiLanguage, setUiLanguage] = useState(() => normalizeLanguage(settings?.general?.language));

  useEffect(() => {
    if (isOpen) {
      const merged = mergeClientSettings(settings);
      setDraft({
        ...merged,
        general: {
          ...merged.general,
          language: normalizeLanguage(merged.general?.language),
        },
      });
      setAccountDraft({
        name: account.name || "",
        email: account.email || "",
        currentPassword: "",
        newPassword: "",
      });
      setUiLanguage(normalizeLanguage(settings?.general?.language));
      setLocalError("");
      setSavedMsg("");
      setSearch("");
    }
  }, [isOpen, settings, account]);

  const dictionary = useMemo(() => getDictionary(uiLanguage), [uiLanguage]);
  const t = useCallback((key) => dictionary[key] || I18N.en[key] || key, [dictionary]);

  const localizedTabs = useMemo(
    () => SETTING_TABS.map((tab) => ({ ...tab, label: t(TAB_LABEL_KEYS[tab.id] || tab.id) })),
    [t]
  );

  const localizedWorkspaceTabs = useMemo(
    () => WORKSPACE_TABS.map((tab) => ({ ...tab, label: t(TAB_LABEL_KEYS[tab.id] || tab.id) })),
    [t]
  );

  const filteredTabs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return localizedTabs;
    return localizedTabs.filter((tab) => tab.label.toLowerCase().includes(q));
  }, [search, localizedTabs]);

  const filteredWorkspaceTabs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return localizedWorkspaceTabs;
    return localizedWorkspaceTabs.filter((tab) => tab.label.toLowerCase().includes(q));
  }, [search, localizedWorkspaceTabs]);

  if (!isOpen) return null;

  function patchSection(section, patch) {
    setDraft((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...patch },
    }));
  }

  async function handleUpdate() {
    setLocalError("");
    setSavedMsg("");
    try {
      await onSave({
        settings: draft,
        account: accountDraft,
        activeTab,
      });
      setSavedMsg(t("saveSuccess"));
      setUiLanguage(normalizeLanguage(draft.general?.language));
      setAccountDraft((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch (err) {
      setLocalError(err.message || t("saveFailed"));
    }
  }

  function handleCancel() {
    const merged = mergeClientSettings(settings);
    setDraft({
      ...merged,
      general: {
        ...merged.general,
        language: normalizeLanguage(merged.general?.language),
      },
    });
    setAccountDraft({
      name: account.name || "",
      email: account.email || "",
      currentPassword: "",
      newPassword: "",
    });
    setUiLanguage(normalizeLanguage(settings?.general?.language));
    onClose();
  }

  function renderPanel() {
    switch (activeTab) {
      case "account":
        return <PanelAccount account={accountDraft} onAccountChange={setAccountDraft} t={t} />;
      case "general":
        return <PanelGeneral s={draft.general} patch={(p) => patchSection("general", p)} t={t} />;
      case "subscription":
        return <PanelSubscription s={draft.subscription} t={t} />;
      case "theme":
        return <PanelTheme s={draft.theme} patch={(p) => patchSection("theme", p)} t={t} />;
      case "sidebar":
        return <PanelSidebar s={draft.sidebar} patch={(p) => patchSection("sidebar", p)} t={t} />;
      case "quickAdd":
        return <PanelQuickAdd s={draft.quickAdd} patch={(p) => patchSection("quickAdd", p)} t={t} />;
      case "productivity":
        return <PanelProductivity s={draft.productivity} patch={(p) => patchSection("productivity", p)} t={t} />;
      case "reminders":
        return <PanelReminders s={draft.reminders} patch={(p) => patchSection("reminders", p)} t={t} />;
      case "notifications":
        return <PanelNotifications s={draft.notifications} patch={(p) => patchSection("notifications", p)} t={t} />;
      case "backups":
        return <PanelBackups s={draft.backups} patch={(p) => patchSection("backups", p)} onExport={onExport} t={t} />;
      case "integrations":
        return <PanelIntegrations s={draft.integrations} patch={(p) => patchSection("integrations", p)} t={t} />;
      case "calendars":
        return <PanelCalendars s={draft.calendars} patch={(p) => patchSection("calendars", p)} t={t} />;
      case "wsGeneral":
        return <PanelWorkspaceGeneral s={draft.workspace} patch={(p) => patchSection("workspace", p)} t={t} />;
      case "wsPeople":
        return (
          <PanelWorkspacePeople
            s={draft.workspace}
            patch={(p) => patchSection("workspace", p)}
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            t={t}
          />
        );
      case "wsSubscription":
        return <PanelWorkspaceSubscription s={draft.workspace} t={t} />;
      default:
        return <PanelProductivity s={draft.productivity} patch={(p) => patchSection("productivity", p)} t={t} />;
    }
  }

  return (
    <div className="overlay" role="presentation" onClick={handleCancel}>
      <section
        className="modal settings-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("settingsTitle")}
        onClick={(e) => e.stopPropagation()}
      >
        <aside className="settings-nav">
          <h3>{t("settingsTitle")}</h3>
          <div className="settings-search">
            <Search size={14} />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchSettingsAria")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredTabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              type="button"
              onClick={() => onSelectTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}

          {filteredWorkspaceTabs.length > 0 && (
            <>
              <div className="settings-nav-divider" />
              <p className="settings-workspace-label">{draft.workspace.name || t("workspaceFallback")}</p>
              {filteredWorkspaceTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={activeTab === tab.id ? "active" : ""}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </>
          )}
        </aside>

        <div className="settings-content">
          <div className="settings-top">
            <h3>{t(TAB_LABEL_KEYS[activeTab] || "settingsTitle")}</h3>
            <button className="icon-btn" type="button" onClick={handleCancel} aria-label={t("close")}>
              <X size={18} />
            </button>
          </div>

          {loading && <p className="settings-status-msg">{t("loadingSettings")}</p>}
          {(error || localError) && <p className="settings-error-msg">{localError || error}</p>}
          {savedMsg && <p className="settings-success-msg">{savedMsg}</p>}

          {!loading && renderPanel()}

          <div className="settings-footer">
            <button type="button" onClick={handleCancel} disabled={saving}>{t("cancel")}</button>
            <button className="btn-primary" type="button" onClick={handleUpdate} disabled={saving || loading}>
              {saving ? t("saving") : t("update")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
