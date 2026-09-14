import { 
  DeviceSecurityInfo, 
  BannedDeviceRecord, 
  BannedIpRecord, 
  FirebaseUserData 
} from '../types';
import { RTDB_BASE_URL } from './firebaseNoticeService';
import { sanitizeUserId } from './firebaseUserService';

export const RTDB_BANNED_DEVICES_ENDPOINT = `${RTDB_BASE_URL}/banned_devices.json`;
export const RTDB_BANNED_IPS_ENDPOINT = `${RTDB_BASE_URL}/banned_ips.json`;

const DEVICE_ID_KEY = 'ssc_device_unique_id_v1';
const CACHED_IP_KEY = 'ssc_device_cached_ip_v1';

let memoryCachedIp: string | null = null;

/**
 * 1. Capture or Generate Unique Device ID (Hardware/Browser Fingerprint)
 */
export function getOrCreateDeviceId(): string {
  try {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      // Generate hardware/browser fingerprint traits
      const screenRes = typeof window !== 'undefined' && window.screen 
        ? `${window.screen.width}x${window.screen.height}` 
        : '1080x2400';
      const randSeed = Math.random().toString(36).substring(2, 7).toUpperCase();
      const timeStamp = Date.now().toString(36).toUpperCase();
      deviceId = `DEV-${screenRes}-${randSeed}-${timeStamp}`;
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  } catch {
    return 'DEV-SSC2028-CLIENT-PRIMARY';
  }
}

/**
 * 2. Capture Current Network IP Address with Fast Parallel Fallbacks
 */
export async function fetchCurrentIpAddress(): Promise<string> {
  if (memoryCachedIp) return memoryCachedIp;
  try {
    const cached = localStorage.getItem(CACHED_IP_KEY);
    if (cached) memoryCachedIp = cached;
  } catch {
    // ignore
  }

  // Attempt public IP resolvers
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.ip) {
        memoryCachedIp = data.ip;
        try { localStorage.setItem(CACHED_IP_KEY, data.ip); } catch {}
        return data.ip;
      }
    }
  } catch {
    // Secondary fallback
    try {
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 3000);
      const res2 = await fetch('https://icanhazip.com', { signal: controller2.signal });
      clearTimeout(timeoutId2);
      if (res2.ok) {
        const text = (await res2.text()).trim();
        if (text && text.length > 5) {
          memoryCachedIp = text;
          try { localStorage.setItem(CACHED_IP_KEY, text); } catch {}
          return text;
        }
      }
    } catch {
      // ignore
    }
  }

  return memoryCachedIp || '103.145.118.42';
}

/**
 * 3. Retrieve Combined Device & IP Security Info
 */
export async function getDeviceSecurityInfo(): Promise<DeviceSecurityInfo> {
  const deviceID = getOrCreateDeviceId();
  const ipAddress = await fetchCurrentIpAddress();
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'SSC-Master-Android/1.0';

  return {
    deviceID,
    ipAddress,
    userAgent,
    last_seen: new Date().toISOString(),
  };
}

/**
 * Sanitize IP or Device ID for Firebase RTDB node keys
 * Firebase keys cannot contain . # $ / [ ]
 */
export function sanitizeBanKey(key: string): string {
  if (!key) return 'unknown_key';
  return key
    .trim()
    .replace(/[.#$[\]/:]/g, '_');
}

export interface BanCheckResult {
  isBanned: boolean;
  bannedTarget?: 'device' | 'ip' | 'both';
  deviceID?: string;
  ipAddress?: string;
  reason?: string;
  bannedAt?: string;
  bannedBy?: string;
  user_name?: string;
  user_email?: string;
}

/**
 * 4. Real-time Device & IP Ban Verification
 * Checks Firebase RTDB /banned_devices and /banned_ips nodes
 */
export async function checkIfDeviceOrIpBanned(
  targetDeviceId?: string,
  targetIpAddress?: string
): Promise<BanCheckResult> {
  const devId = targetDeviceId || getOrCreateDeviceId();
  const ip = targetIpAddress || (await fetchCurrentIpAddress());

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const [devRes, ipRes] = await Promise.all([
      fetch(RTDB_BANNED_DEVICES_ENDPOINT, { signal: controller.signal }),
      fetch(RTDB_BANNED_IPS_ENDPOINT, { signal: controller.signal }),
    ]);
    clearTimeout(timeoutId);

    const bannedDevs = devRes.ok ? await devRes.json() : null;
    const bannedIps = ipRes.ok ? await ipRes.json() : null;

    let isDevBanned = false;
    let isIpBanned = false;
    let banDetails: any = null;

    // Check device match
    if (bannedDevs && typeof bannedDevs === 'object') {
      const sanitizedDev = sanitizeBanKey(devId);
      if (bannedDevs[sanitizedDev]) {
        isDevBanned = true;
        banDetails = bannedDevs[sanitizedDev];
      } else {
        const found = Object.values(bannedDevs).find(
          (d: any) => d && (d.deviceID === devId || d.id === devId)
        );
        if (found) {
          isDevBanned = true;
          banDetails = found;
        }
      }
    }

    // Check IP match
    if (bannedIps && typeof bannedIps === 'object') {
      const sanitizedIp = sanitizeBanKey(ip);
      if (bannedIps[sanitizedIp]) {
        isIpBanned = true;
        banDetails = banDetails || bannedIps[sanitizedIp];
      } else {
        const found = Object.values(bannedIps).find(
          (i: any) => i && (i.ipAddress === ip || i.ip === ip)
        );
        if (found) {
          isIpBanned = true;
          banDetails = banDetails || found;
        }
      }
    }

    if (isDevBanned && isIpBanned) {
      return {
        isBanned: true,
        bannedTarget: 'both',
        deviceID: devId,
        ipAddress: ip,
        reason: banDetails?.reason || 'অ্যাকাউন্টের নিয়ম লঙ্ঘন বা সন্দেহজনক কার্যকলাপের জন্য অ্যাডমিন কর্তৃক ডিভাইস ও আইপি ব্লক করা হয়েছে।',
        bannedAt: banDetails?.banned_at || new Date().toISOString(),
        bannedBy: banDetails?.banned_by || 'Master Admin',
        user_name: banDetails?.user_name,
        user_email: banDetails?.user_email,
      };
    }

    if (isDevBanned) {
      return {
        isBanned: true,
        bannedTarget: 'device',
        deviceID: devId,
        ipAddress: ip,
        reason: banDetails?.reason || 'অ্যাডমিন কর্তৃক আপনার ডিভাইস ব্লক করা হয়েছে।',
        bannedAt: banDetails?.banned_at || new Date().toISOString(),
        bannedBy: banDetails?.banned_by || 'Master Admin',
        user_name: banDetails?.user_name,
        user_email: banDetails?.user_email,
      };
    }

    if (isIpBanned) {
      return {
        isBanned: true,
        bannedTarget: 'ip',
        deviceID: devId,
        ipAddress: ip,
        reason: banDetails?.reason || 'অ্যাডমিন কর্তৃক আপনার আইপি অ্যাড্রেস ব্লক করা হয়েছে।',
        bannedAt: banDetails?.banned_at || new Date().toISOString(),
        bannedBy: banDetails?.banned_by || 'Master Admin',
        user_name: banDetails?.user_name,
        user_email: banDetails?.user_email,
      };
    }

    return { isBanned: false, deviceID: devId, ipAddress: ip };
  } catch (err) {
    console.warn('Ban verification offline/timeout bypass:', err);
    return { isBanned: false, deviceID: devId, ipAddress: ip };
  }
}

/**
 * 5. One-Click Ban Action for Admin Panel
 * Pushes deviceID to /banned_devices and ipAddress to /banned_ips
 * Also stores security parameters under /users/{userId}/security_info
 */
export async function banDeviceAndIp(
  user: FirebaseUserData,
  reason: string = 'অ্যাকাউন্টের নিয়ম লঙ্ঘন বা সন্দেহজনক কার্যকলাপের জন্য অ্যাডমিন কর্তৃক ব্লক করা হয়েছে।'
): Promise<{ success: boolean; error?: string }> {
  try {
    const deviceID = user.security_info?.deviceID || (user as any).deviceID || getOrCreateDeviceId();
    const ipAddress = user.security_info?.ipAddress || (user as any).ipAddress || (await fetchCurrentIpAddress());
    const bannedAt = new Date().toISOString();

    const devPayload: BannedDeviceRecord = {
      deviceID,
      reason,
      banned_at: bannedAt,
      banned_by: 'Master Admin (1919131514)',
      user_name: user.name,
      user_email: user.email,
    };

    const ipPayload: BannedIpRecord = {
      ipAddress,
      reason,
      banned_at: bannedAt,
      banned_by: 'Master Admin (1919131514)',
      user_name: user.name,
      user_email: user.email,
    };

    const sanitizedDevKey = sanitizeBanKey(deviceID);
    const sanitizedIpKey = sanitizeBanKey(ipAddress);

    const promises: Promise<any>[] = [
      fetch(`${RTDB_BASE_URL}/banned_devices/${sanitizedDevKey}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(devPayload),
      }),
      fetch(`${RTDB_BASE_URL}/banned_ips/${sanitizedIpKey}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ipPayload),
      }),
    ];

    if (user.userId || user.email) {
      const uId = user.userId || sanitizeUserId(user.email);
      // Update is_banned flag on user node
      promises.push(
        fetch(`${RTDB_BASE_URL}/users/${uId}/is_banned.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(true),
        })
      );
      // Ensure security_info is saved under /users/{userId}/security_info
      promises.push(
        fetch(`${RTDB_BASE_URL}/users/${uId}/security_info.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceID,
            ipAddress,
            userAgent: user.security_info?.userAgent || navigator.userAgent,
            last_seen: bannedAt,
          }),
        })
      );
    }

    await Promise.all(promises);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'ব্লক কার্যকর করতে সমস্যা হয়েছে।' };
  }
}

/**
 * 6. Unban Specific Device from /banned_devices
 */
export async function unbanDevice(deviceID: string): Promise<{ success: boolean; error?: string }> {
  try {
    const key = sanitizeBanKey(deviceID);
    await fetch(`${RTDB_BASE_URL}/banned_devices/${key}.json`, {
      method: 'DELETE',
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * 7. Unban Specific IP from /banned_ips
 */
export async function unbanIp(ipAddress: string): Promise<{ success: boolean; error?: string }> {
  try {
    const key = sanitizeBanKey(ipAddress);
    await fetch(`${RTDB_BASE_URL}/banned_ips/${key}.json`, {
      method: 'DELETE',
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * 8. Unban Both Device & IP for a User
 */
export async function unbanUserAll(
  user: FirebaseUserData,
  deviceID?: string,
  ipAddress?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const dId = deviceID || user.security_info?.deviceID || (user as any).deviceID;
    const ip = ipAddress || user.security_info?.ipAddress || (user as any).ipAddress;

    const promises: Promise<any>[] = [];
    if (dId) {
      promises.push(unbanDevice(dId));
    }
    if (ip) {
      promises.push(unbanIp(ip));
    }
    if (user.userId || user.email) {
      const uId = user.userId || sanitizeUserId(user.email);
      promises.push(
        fetch(`${RTDB_BASE_URL}/users/${uId}/is_banned.json`, {
          method: 'DELETE',
        })
      );
    }

    await Promise.all(promises);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * 9. Fetch All Banned Devices & IPs for Admin Panel Banned List Tab
 */
export async function fetchBannedLists(): Promise<{
  devices: BannedDeviceRecord[];
  ips: BannedIpRecord[];
  error?: string;
}> {
  try {
    const [devRes, ipRes] = await Promise.all([
      fetch(RTDB_BANNED_DEVICES_ENDPOINT),
      fetch(RTDB_BANNED_IPS_ENDPOINT),
    ]);

    const devData = devRes.ok ? await devRes.json() : null;
    const ipData = ipRes.ok ? await ipRes.json() : null;

    const devices: BannedDeviceRecord[] = [];
    if (devData && typeof devData === 'object') {
      Object.entries(devData).forEach(([key, val]: [string, any]) => {
        if (val) {
          devices.push({
            deviceID: val.deviceID || key,
            reason: val.reason || 'অ্যাডমিন কর্তৃক ব্লককৃত',
            banned_at: val.banned_at || new Date().toISOString(),
            banned_by: val.banned_by || 'Master Admin',
            user_name: val.user_name || 'অজানা ইউজার',
            user_email: val.user_email || '',
          });
        }
      });
    }

    const ips: BannedIpRecord[] = [];
    if (ipData && typeof ipData === 'object') {
      Object.entries(ipData).forEach(([key, val]: [string, any]) => {
        if (val) {
          ips.push({
            ipAddress: val.ipAddress || key.replace(/_/g, '.'),
            reason: val.reason || 'অ্যাডমিন কর্তৃক ব্লককৃত',
            banned_at: val.banned_at || new Date().toISOString(),
            banned_by: val.banned_by || 'Master Admin',
            user_name: val.user_name || 'অজানা ইউজার',
            user_email: val.user_email || '',
          });
        }
      });
    }

    return { devices, ips };
  } catch (err: any) {
    return { devices: [], ips: [], error: err?.message };
  }
}
