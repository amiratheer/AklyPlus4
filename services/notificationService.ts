
/**
 * خدمة التنبيهات لـ أكلي بلس
 * تدعم إشعارات المتصفح والأصوات التنبيهية
 */

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("هذا المتصفح لا يدعم إشعارات سطح المكتب");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendNotification = (title: string, body: string, icon = "https://cdn-icons-png.flaticon.com/512/1046/1046747.png") => {
  if (Notification.permission === "granted") {
    // Fix: Removed 'vibrate' from NotificationOptions as it is not supported in the standard constructor and caused an error
    const notification = new Notification(title, {
      body,
      icon,
      badge: icon,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

// تشغيل صوت تنبيه عند وصول طلب جديد
export const playNotificationSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
  audio.play().catch(e => console.log("Audio play failed, needs user interaction first."));
};
