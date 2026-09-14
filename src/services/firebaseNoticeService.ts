import { GlobalNoticeData } from '../types';

export const RTDB_BASE_URL = 'https://toppers-progresss-default-rtdb.firebaseio.com';
export const NOTICE_ENDPOINT = `${RTDB_BASE_URL}/global_notice.json`;
export const MASTER_ADMIN_PASSCODE = '1919131514';
export const STORAGE_KEY_NOTICE = 'ssc_last_known_global_notice_v1';
export const STORAGE_KEY_ADMIN_AUTH = 'ssc_admin_session_auth_v1';

export const DEFAULT_NOTICE_DATA: GlobalNoticeData = {
  isNoticeActive: false,
  title: 'জরুরি রক্ষণাবেক্ষণ ও সিস্টেম নোটিশ',
  message: 'সম্মানিত শিক্ষার্থীদের জানানো যাচ্ছে যে প্ল্যাটফর্মের জরুরি কারিগরি আপগ্রেড চলছে। শীঘ্রই সেবা স্বাভাবিক হবে।',
  severity: 'urgent',
  updatedAt: new Date().toISOString(),
  updatedBy: 'Master Admin',
  allowStudentDismiss: false,
};

/**
 * Fetch global notice data from Firebase Realtime Database
 */
export async function fetchGlobalNotice(): Promise<GlobalNoticeData | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(NOTICE_ENDPOINT, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Firebase RTDB HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data || typeof data !== 'object') {
      // Empty node or null returned by Firebase RTDB
      return null;
    }

    const notice: GlobalNoticeData = {
      isNoticeActive: Boolean(data.isNoticeActive),
      title: String(data.title || DEFAULT_NOTICE_DATA.title),
      message: String(data.message || DEFAULT_NOTICE_DATA.message),
      severity: (data.severity === 'warning' || data.severity === 'info') ? data.severity : 'urgent',
      updatedAt: data.updatedAt || new Date().toISOString(),
      updatedBy: data.updatedBy || 'Master Admin',
      allowStudentDismiss: Boolean(data.allowStudentDismiss),
    };

    // Cache locally for offline enforcement
    try {
      localStorage.setItem(STORAGE_KEY_NOTICE, JSON.stringify(notice));
    } catch {
      // ignore
    }

    return notice;
  } catch (error) {
    console.warn('Could not fetch notice from Firebase RTDB (offline or network error):', error);
    // Fall back to cached local notice if available
    try {
      const cached = localStorage.getItem(STORAGE_KEY_NOTICE);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore
    }
    return null;
  }
}

/**
 * Update global notice data in Firebase Realtime Database (via PUT/PATCH)
 */
export async function updateGlobalNotice(
  payload: Partial<GlobalNoticeData>,
  passcode: string
): Promise<{ success: boolean; data?: GlobalNoticeData; error?: string }> {
  if (passcode.trim() !== MASTER_ADMIN_PASSCODE) {
    return { success: false, error: 'ভুল অ্যাডমিন পাসকোড! সঠিক মাস্টার পাসকোড প্রবেশ করান।' };
  }

  const updatedData: GlobalNoticeData = {
    isNoticeActive: payload.isNoticeActive ?? false,
    title: payload.title?.trim() || DEFAULT_NOTICE_DATA.title,
    message: payload.message?.trim() || DEFAULT_NOTICE_DATA.message,
    severity: payload.severity || 'urgent',
    updatedAt: new Date().toISOString(),
    updatedBy: `Admin [${new Date().toLocaleTimeString('bn-BD')}]`,
    allowStudentDismiss: Boolean(payload.allowStudentDismiss),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(NOTICE_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Firebase RTDB update error: ${response.status} ${response.statusText}`);
    }

    const savedData = await response.json();

    // Cache locally
    try {
      localStorage.setItem(STORAGE_KEY_NOTICE, JSON.stringify(updatedData));
    } catch {
      // ignore
    }

    return { success: true, data: savedData || updatedData };
  } catch (error: any) {
    console.error('Firebase RTDB update failed:', error);
    // Even if remote network fails, save to local cache for emergency offline behavior
    try {
      localStorage.setItem(STORAGE_KEY_NOTICE, JSON.stringify(updatedData));
    } catch {
      // ignore
    }
    return {
      success: false,
      error: error.message || 'Firebase Realtime Database-এ সংযোগ স্থাপন করা সম্ভব হয়নি। ইন্টারনেট সংযোগ চেক করুন।',
    };
  }
}
