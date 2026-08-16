import { getSupabase, isSupabaseConfigured } from "./supabase";

export interface EditorLockRecord {
  userId: string;
  deviceId: string;
  deviceName: string;
  lastHeartbeat: string;
}

const DEVICE_ID_KEY = "finance_tracker_device_id";

/**
 * Gets or creates a unique persistent Device ID for this browser/device.
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "server-device";
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `dev-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

/**
 * Detects human-readable device name (e.g., "Safari on iPad", "Chrome on Windows").
 */
export function getDeviceName(): string {
  if (typeof window === "undefined") return "Perangkat Web";
  const ua = navigator.userAgent;
  let os = "Desktop";
  if (/iPad/i.test(ua)) os = "iPad";
  else if (/iPhone/i.test(ua)) os = "iPhone";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Macintosh/i.test(ua)) os = "macOS";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Browser";
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
  else if (/Edg/i.test(ua)) browser = "Edge";
  else if (/Firefox/i.test(ua)) browser = "Firefox";

  return `${browser} (${os})`;
}

/**
 * Checks if a lock record is active (heartbeat within last 30 seconds).
 */
export function isLockActive(lock: EditorLockRecord | null): boolean {
  if (!lock || !lock.lastHeartbeat) return false;
  const heartbeatTime = new Date(lock.lastHeartbeat).getTime();
  const now = Date.now();
  // 30 seconds expiration threshold
  return now - heartbeatTime < 30000;
}

/**
 * Fetches the current Editor Lock from Supabase for the user.
 */
export async function fetchActiveEditorLock(userId: string): Promise<EditorLockRecord | null> {
  const client = getSupabase();
  if (!isSupabaseConfigured() || !client) return null;

  try {
    const { data, error } = await client
      .from("user_editor_lock")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      userId: data.user_id,
      deviceId: data.device_id,
      deviceName: data.device_name || "Perangkat Lain",
      lastHeartbeat: data.last_heartbeat,
    };
  } catch (err) {
    console.error("Fetch Editor Lock error:", err);
    return null;
  }
}

/**
 * Attempts to claim Editor lock for this device.
 * Returns success boolean and active lock details.
 */
export async function acquireEditorLock(userId: string): Promise<{ success: boolean; activeLock: EditorLockRecord | null }> {
  const client = getSupabase();
  const deviceId = getDeviceId();
  const deviceName = getDeviceName();
  const nowStr = new Date().toISOString();

  const fallbackLock: EditorLockRecord = { userId, deviceId, deviceName, lastHeartbeat: nowStr };

  // If Supabase is not configured, allow Editor mode locally
  if (!isSupabaseConfigured() || !client) return { success: true, activeLock: fallbackLock };

  try {
    const currentLock = await fetchActiveEditorLock(userId);

    // If another device holds an ACTIVE lock (and it's not this device), reject lock acquisition
    if (currentLock && currentLock.deviceId !== deviceId && isLockActive(currentLock)) {
      return { success: false, activeLock: currentLock };
    }

    // Claim or renew lock for this device
    const { error } = await client.from("user_editor_lock").upsert({
      user_id: userId,
      device_id: deviceId,
      device_name: deviceName,
      last_heartbeat: nowStr,
    });

    if (error) {
      console.warn("Acquire Editor Lock error (table may not exist):", error.message);
      // Still allow Editor mode - the lock table might not exist yet
      return { success: true, activeLock: fallbackLock };
    }

    return { success: true, activeLock: { userId, deviceId, deviceName, lastHeartbeat: nowStr } };
  } catch (err) {
    console.warn("Acquire Editor Lock exception:", err);
    // Graceful fallback: allow Editor mode even if Supabase lock table fails
    return { success: true, activeLock: fallbackLock };
  }
}

/**
 * Sends a heartbeat ping from active Editor device.
 */
export async function sendEditorHeartbeat(userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!isSupabaseConfigured() || !client) return true;

  try {
    const deviceId = getDeviceId();
    const deviceName = getDeviceName();
    const nowStr = new Date().toISOString();

    const { error } = await client.from("user_editor_lock").upsert({
      user_id: userId,
      device_id: deviceId,
      device_name: deviceName,
      last_heartbeat: nowStr,
    });

    return !error;
  } catch {
    return true; // Silently succeed if table doesn't exist
  }
}

/**
 * Releases the Editor lock if this device owns it.
 */
export async function releaseEditorLock(userId: string): Promise<void> {
  const client = getSupabase();
  if (!isSupabaseConfigured() || !client) return;

  try {
    const deviceId = getDeviceId();
    await client
      .from("user_editor_lock")
      .delete()
      .eq("user_id", userId)
      .eq("device_id", deviceId);
  } catch {
    // Silently ignore if table doesn't exist
  }
}

/**
 * Forcefully takes over Editor lock (deliberate handover).
 */
export async function forceHandoverEditor(userId: string): Promise<EditorLockRecord | null> {
  const client = getSupabase();
  const deviceId = getDeviceId();
  const deviceName = getDeviceName();
  const nowStr = new Date().toISOString();

  const fallbackLock: EditorLockRecord = { userId, deviceId, deviceName, lastHeartbeat: nowStr };

  if (!isSupabaseConfigured() || !client) return fallbackLock;

  try {
    const { error } = await client.from("user_editor_lock").upsert({
      user_id: userId,
      device_id: deviceId,
      device_name: deviceName,
      last_heartbeat: nowStr,
    });

    if (error) {
      console.warn("Force Handover Error:", error.message);
      return fallbackLock;
    }

    return { userId, deviceId, deviceName, lastHeartbeat: nowStr };
  } catch {
    return fallbackLock;
  }
}
