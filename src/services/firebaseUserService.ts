import { FirebaseUserData, ChapterProgressData } from '../types';
import { RTDB_BASE_URL, firebaseConfig } from './firebaseConfig';
import { toBengaliNumber } from '../utils/progressCalculator';
import { getDeviceSecurityInfo } from './deviceSecurityService';

export { RTDB_BASE_URL, firebaseConfig };

export const RTDB_USERS_ENDPOINT = `${RTDB_BASE_URL}/users.json`;
export const STORAGE_KEY_AUTH_USER = 'ssc_auth_active_user_v1';
export const STORAGE_KEY_AUTH_TOKEN = 'ssc_auth_session_token_v1';
export const STORAGE_KEY_ONBOARDING_DONE = 'ssc_onboarding_completed_v1';
export const STORAGE_KEY_SYLLABUS_CONFIGURED = 'ssc_syllabus_configured_v1';

/**
 * Sanitize email or ID to be a safe Firebase Realtime Database node key
 */
export function sanitizeUserId(emailOrId: string): string {
  if (!emailOrId) return `user_${Date.now()}`;
  return emailOrId
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9_-]/g, '_');
}

/**
 * Check if the user has an active persistent authentication session
 */
export function hasActiveAuthSession(): boolean {
  try {
    const user = getLocalAuthUser();
    const token = localStorage.getItem(STORAGE_KEY_AUTH_TOKEN);
    return !!(user && (token || user.email));
  } catch {
    return false;
  }
}

/**
 * Save authentication session with token
 */
export function saveLocalAuthSession(user: FirebaseUserData, token?: string): void {
  try {
    saveLocalAuthUser(user);
    const sessionToken = token || `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, sessionToken);
  } catch {
    // ignore
  }
}

/**
 * Clear local auth session (logout)
 */
export function clearLocalAuthSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_AUTH_USER);
    localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
  } catch {
    // ignore
  }
}

/**
 * Check if onboarding setup has been completed
 */
export function hasCompletedOnboardingCheck(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_ONBOARDING_DONE) === 'true';
  } catch {
    return false;
  }
}

/**
 * Set onboarding completion state
 */
export function setOnboardingCompleted(completed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_ONBOARDING_DONE, completed ? 'true' : 'false');
  } catch {
    // ignore
  }
}

/**
 * Check if syllabus configuration has been initialized/saved
 */
export function isSyllabusConfiguredCheck(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_SYLLABUS_CONFIGURED) === 'true';
  } catch {
    return false;
  }
}

/**
 * Set syllabus configuration completed state
 */
export function setSyllabusConfigured(configured: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_SYLLABUS_CONFIGURED, configured ? 'true' : 'false');
  } catch {
    // ignore
  }
}

/**
 * Sync syllabus configuration to Firebase Realtime Database at /users/{userId}/syllabus_config.json
 */
export async function syncSyllabusConfigToFirebase(
  userId: string,
  config: {
    isSyllabusConfigured: boolean;
    path?: 'standard' | 'custom' | string;
    stream?: string;
    fourthSubject?: string;
    religion?: string;
    customSelectedChapterIds?: string[];
    updatedAt?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) return { success: false, error: 'No user ID provided' };
    const safeId = sanitizeUserId(userId);
    const endpoint = `${RTDB_BASE_URL}/users/${safeId}/syllabus_config.json`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        ...config,
        updatedAt: config.updatedAt || new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Firebase syllabus config write failed: ${response.status}`);
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Firebase syllabus config sync notice:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Fetch syllabus configuration from Firebase Realtime Database at /users/{userId}/syllabus_config.json
 */
export async function fetchSyllabusConfigFromFirebase(
  userId: string
): Promise<{
  isSyllabusConfigured: boolean;
  path?: string;
  customSelectedChapterIds?: string[];
} | null> {
  try {
    if (!userId) return null;
    const safeId = sanitizeUserId(userId);
    const endpoint = `${RTDB_BASE_URL}/users/${safeId}/syllabus_config.json`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}

/**
 * Calculate total study minutes completed based on chapter progress
 */
export function calculateStudyMinutes(
  chapters: Record<string, ChapterProgressData>,
  baseMinutes: number = 320
): number {
  let minutes = baseMinutes;
  Object.values(chapters).forEach((chap) => {
    if (chap.status === 'completed' || chap.status === 'revised') {
      minutes += 240; // ~4 hours per completed chapter
    } else if (chap.status === 'in_progress') {
      minutes += 90; // ~1.5 hours in progress
    }
  });
  return minutes;
}

/**
 * Format minutes into Bengali string like "১৪ ঘণ্টা ৩০ মিনিট"
 */
export function formatStudyHoursBn(totalMinutes: number): string {
  if (!totalMinutes || totalMinutes <= 0) return '০ মিনিট';
  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = Math.round(totalMinutes % 60);

  if (hours > 0 && remainingMins > 0) {
    return `${toBengaliNumber(hours)} ঘণ্টা ${toBengaliNumber(remainingMins)} মিনিট`;
  } else if (hours > 0) {
    return `${toBengaliNumber(hours)} ঘণ্টা`;
  }
  return `${toBengaliNumber(remainingMins)} মিনিট`;
}

/**
 * 1. Sync / Write User Account Details to Firebase Realtime Database
 * Endpoint: /users/{userId}.json & /users/{userId}/security_info.json
 */
export async function syncUserToFirebase(
  userData: FirebaseUserData
): Promise<{ success: boolean; data?: FirebaseUserData; error?: string }> {
  try {
    const userId = userData.userId || sanitizeUserId(userData.email);
    const targetUrl = `${RTDB_BASE_URL}/users/${userId}.json`;
    const secInfoUrl = `${RTDB_BASE_URL}/users/${userId}/security_info.json`;

    // Ensure security info (deviceID, ipAddress) is populated
    const security_info = userData.security_info || (await getDeviceSecurityInfo());

    const payload: FirebaseUserData = {
      userId,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      provider: userData.provider || 'Google',
      batch: userData.batch || 'SSC 2028',
      group: userData.group || 'বিজ্ঞান (Science)',
      created_at: userData.created_at || new Date().toISOString(),
      total_study_minutes: Number(userData.total_study_minutes) || 0,
      streak_count: Number(userData.streak_count) || 1,
      last_login: new Date().toISOString(),
      fourth_subject: userData.fourth_subject || '',
      syllabus_path: userData.syllabus_path || 'বোর্ড স্ট্যান্ডার্ড SSC 2028',
      onboarding_completed: userData.onboarding_completed !== undefined ? userData.onboarding_completed : true,
      security_info,
      is_banned: userData.is_banned || false,
      completion_percentage: userData.completion_percentage !== undefined ? userData.completion_percentage : 0,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const [response] = await Promise.all([
      fetch(targetUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }),
      // Explicitly store security_info at /users/{userId}/security_info as requested
      fetch(secInfoUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(security_info),
        signal: controller.signal,
      }).catch((e) => console.warn('Sub-node security_info sync notice:', e)),
    ]);

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Firebase RTDB write error: ${response.status} ${response.statusText}`);
    }

    saveLocalAuthUser(payload);

    return {
      success: true,
      data: payload,
    };
  } catch (err: any) {
    console.error('Firebase user sync failed:', err);
    // Still save locally so user has persistence even if offline
    saveLocalAuthUser(userData);
    return {
      success: false,
      error: err?.message || 'Firebase সিঙ্ক করতে সমস্যা হয়েছে (অফলাইন মোড)।',
    };
  }
}

/**
 * 2. Fetch all registered users from Firebase Realtime Database
 * Endpoint: /users.json
 */
export async function fetchAllUsersFromFirebase(): Promise<{
  users: FirebaseUserData[];
  isLive: boolean;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(RTDB_USERS_ENDPOINT, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Firebase RTDB fetch error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || typeof data !== 'object') {
      // Empty node on Firebase
      return { users: getFallbackUsers(), isLive: false };
    }

    const userList: FirebaseUserData[] = Object.entries(data).map(([key, val]: [string, any]) => {
      const security_info = val.security_info || {
        deviceID: val.deviceID || `DEV-1080x2400-${key.substring(0, 5).toUpperCase()}-NODE`,
        ipAddress: val.ipAddress || '103.145.118.42',
        userAgent: val.userAgent || navigator.userAgent,
        last_seen: val.last_login || new Date().toISOString(),
      };

      return {
        userId: key,
        name: val.name || 'শিক্ষার্থী',
        email: val.email || 'user@example.com',
        provider: val.provider === 'Email' ? 'Email' : 'Google',
        batch: val.batch || 'SSC 2028',
        group: val.group || 'বিজ্ঞান (Science)',
        created_at: val.created_at || new Date().toISOString(),
        total_study_minutes: Number(val.total_study_minutes) || 0,
        streak_count: Number(val.streak_count) || 1,
        last_login: val.last_login || val.created_at || new Date().toISOString(),
        fourth_subject: val.fourth_subject || '',
        syllabus_path: val.syllabus_path || 'বোর্ড স্ট্যান্ডার্ড SSC 2028',
        onboarding_completed: val.onboarding_completed !== false,
        security_info,
        is_banned: !!val.is_banned,
        completion_percentage: typeof val.completion_percentage === 'number' ? val.completion_percentage : Number(val.completion_percentage) || 0,
      };
    });

    // Sort by last_login descending (most recently active first)
    userList.sort((a, b) => new Date(b.last_login).getTime() - new Date(a.last_login).getTime());

    return { users: userList, isLive: true };
  } catch (err: any) {
    console.warn('Could not fetch users from Firebase RTDB:', err);
    return {
      users: getFallbackUsers(),
      isLive: false,
      error: err?.message || 'অফলাইন ডেটা ব্যবহার করা হচ্ছে',
    };
  }
}

/**
 * 3. Dedicated sync for overall completion percentage to Firebase
 * Endpoint: /users/{userId}/completion_percentage.json
 */
export async function syncCompletionPercentageToFirebase(
  userId: string,
  percentage: number
): Promise<void> {
  try {
    const targetUrl = `${RTDB_BASE_URL}/users/${userId}/completion_percentage.json`;
    await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(percentage),
    });
  } catch (e) {
    console.warn('Silent completion percentage sync note:', e);
  }
}

/**
 * Save current authenticated user to LocalStorage
 */
export function saveLocalAuthUser(user: FirebaseUserData): void {
  try {
    localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(user));
  } catch {
    // ignore
  }
}

/**
 * Get current authenticated user from LocalStorage
 */
export function getLocalAuthUser(): FirebaseUserData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH_USER);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

/**
 * Seed fallback users if database is empty or device is offline
 */
function getFallbackUsers(): FirebaseUserData[] {
  const localUser = getLocalAuthUser();
  const baseList: FirebaseUserData[] = [
    {
      userId: 'saimon_hassan243_gmail_com',
      name: 'মো: সাইমন হাসান',
      email: 'saimon.hassan243@gmail.com',
      provider: 'Google',
      batch: 'SSC 2028',
      group: 'বিজ্ঞান (Science)',
      created_at: '2026-09-01T08:30:00.000Z',
      total_study_minutes: 1980, // 33 hours
      streak_count: 15,
      completion_percentage: 64.5,
      last_login: new Date().toISOString(),
      security_info: {
        deviceID: 'DEV-1080x2400-SMN99-K3A1',
        ipAddress: '103.145.118.42',
        last_seen: new Date().toISOString(),
      },
    },
    {
      userId: 'ayesha_rahman_gmail_com',
      name: 'আয়েশা রহমান',
      email: 'ayesha.rahman.topper@gmail.com',
      provider: 'Google',
      batch: 'SSC 2028',
      group: 'বিজ্ঞান (Science)',
      created_at: '2026-09-03T11:15:00.000Z',
      total_study_minutes: 2450,
      streak_count: 18,
      completion_percentage: 88.2,
      last_login: new Date(Date.now() - 3600000 * 2).toISOString(),
      security_info: {
        deviceID: 'DEV-1440x3200-AYSH2-P8B2',
        ipAddress: '103.205.71.18',
        last_seen: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    },
    {
      userId: 'farhan_tanvir_yahoo_com',
      name: 'ফারহান তানভীর',
      email: 'farhan.tanvir2028@yahoo.com',
      provider: 'Email',
      batch: 'SSC 2028',
      group: 'ব্যবসায় শিক্ষা',
      created_at: '2026-09-05T14:45:00.000Z',
      total_study_minutes: 1320,
      streak_count: 11,
      completion_percentage: 42.0,
      last_login: new Date(Date.now() - 3600000 * 18).toISOString(),
      security_info: {
        deviceID: 'DEV-1080x1920-FRHN4-M4C3',
        ipAddress: '119.148.33.102',
        last_seen: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
    },
    {
      userId: 'sumaiya_chowdhury_gmail_com',
      name: 'সুমাইয়া চৌধুরী',
      email: 'sumaiya.arts@gmail.com',
      provider: 'Google',
      batch: 'SSC 2028',
      group: 'মানবিক (Humanities)',
      created_at: '2026-09-08T09:20:00.000Z',
      total_study_minutes: 1640,
      streak_count: 9,
      completion_percentage: 51.7,
      last_login: new Date(Date.now() - 3600000 * 5).toISOString(),
      security_info: {
        deviceID: 'DEV-1080x2340-SMYA7-X9D4',
        ipAddress: '103.114.98.55',
        last_seen: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    },
    {
      userId: 'rafid_ahmed_outlook_com',
      name: 'রাফিদ আহমেদ',
      email: 'rafid.ssc28@outlook.com',
      provider: 'Email',
      batch: 'SSC 2028',
      group: 'বিজ্ঞান (Science)',
      created_at: '2026-09-10T16:00:00.000Z',
      total_study_minutes: 890,
      streak_count: 6,
      completion_percentage: 28.4,
      last_login: new Date(Date.now() - 3600000 * 28).toISOString(),
      security_info: {
        deviceID: 'DEV-1080x2400-RFD12-Z2E5',
        ipAddress: '180.234.225.80',
        last_seen: new Date(Date.now() - 3600000 * 28).toISOString(),
      },
    },
  ];

  if (localUser) {
    const exists = baseList.some(
      (u) => u.email.toLowerCase() === localUser.email.toLowerCase()
    );
    if (!exists) {
      baseList.unshift(localUser);
    }
  }

  return baseList;
}
