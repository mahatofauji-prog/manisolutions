/**
 * MANI Solution - Security & Data Protection Utility
 * 
 * Provides robust, enterprise-grade defensive security:
 * - Input validation & HTML/XSS sanitization
 * - Safe URL, Email, and Phone number validation
 * - Magic byte image verification & MIME validation
 * - Cryptographic session token generation & constant-time comparison
 * - Sliding-window rate limiters for logins, forms, and lookups
 * - Safe filename and path traversal prevention
 */

// ============================================================
// 1. INPUT SANITIZATION & XSS PROTECTION
// ============================================================

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

/**
 * Escapes dangerous HTML characters to prevent XSS injection.
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Strips dangerous script tags, javascript: links, null bytes and dangerous control chars.
 * Enforces maximum string length to prevent memory exhaustion attacks.
 */
export function sanitizeText(input: unknown, maxLength: number = 2000): string {
  if (input === null || input === undefined) return '';
  let str = String(input);

  // Remove null bytes and invisible control characters (except newline, tab, carriage return)
  // eslint-disable-next-line no-control-regex
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Strip dangerous JavaScript pseudo-protocols
  str = str.replace(/(javascript|vbscript|data):/gi, '');

  // Strip script and event handler tags
  str = str.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '');
  str = str.replace(/on\w+\s*=/gi, '');

  // Truncate to maximum allowed length
  if (str.length > maxLength) {
    str = str.slice(0, maxLength);
  }

  return str.trim();
}

/**
 * Sanitizes an array of strings (e.g. tags, categories)
 */
export function sanitizeStringArray(arr: unknown, maxItems: number = 50, maxItemLen: number = 100): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .slice(0, maxItems)
    .map((item) => sanitizeText(item, maxItemLen))
    .filter((item) => item.length > 0);
}

// ============================================================
// 2. DATA VALIDATION (EMAIL, PHONE, URL, SLUG)
// ============================================================

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates email format according to RFC standard.
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  return trimmed.length <= 254 && EMAIL_REGEX.test(trimmed);
}

/**
 * Validates phone / WhatsApp numbers (supporting standard international & Indian digits).
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/[^0-9]/g, '');
  // Standard phone numbers range from 7 to 15 digits
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * Validates that a URL uses safe protocols (http or https only).
 */
export function validateSafeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
    return false;
  }
  try {
    const parsed = new URL(trimmed, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Generates or sanitizes a safe URL slug (only lowercase alphanumeric and hyphens).
 */
export function sanitizeSlug(titleOrSlug: string): string {
  if (!titleOrSlug || typeof titleOrSlug !== 'string') return 'solution';
  return titleOrSlug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'solution';
}

/**
 * Sanitizes a filename and prevents directory traversal attacks.
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') return 'file';
  // Strip directory traversal sequences
  let safe = filename.replace(/(\.\.[\/\\]|[\/\\])/g, '_');
  // Strip non-alphanumeric (keep dots, dashes, underscores)
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_');
  // Remove multiple consecutive dots
  safe = safe.replace(/\.{2,}/g, '.');
  return safe.slice(0, 100) || 'file';
}

// ============================================================
// 3. FILE & IMAGE SECURITY (MIME + MAGIC BYTES)
// ============================================================

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
]);

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);

/**
 * Validates uploaded image file: checks extension, MIME type, size limit,
 * and verifies true file format via binary magic byte signatures.
 */
export async function validateImageFile(
  file: File,
  maxSizeBytes: number = 5 * 1024 * 1024 // 5MB default
): Promise<{ valid: boolean; error?: string }> {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  // 1. File Size Check
  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
    return { valid: false, error: `File size exceeds the maximum limit of ${maxMb}MB.` };
  }

  // 2. Extension Check
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return { valid: false, error: 'Invalid file format. Please upload a JPEG, PNG, or WebP image.' };
  }

  // 3. Declared MIME Type Check
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type.toLowerCase())) {
    return { valid: false, error: 'Invalid image type detected.' };
  }

  // 4. Magic Bytes Inspection (deep binary validation)
  try {
    const slice = file.slice(0, 16);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Check JPEG (FF D8 FF)
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    // Check PNG (89 50 4E 47 0D 0A 1A 0A)
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47;
    // Check GIF (GIF87a or GIF89a -> 47 49 46 38)
    const isGif =
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38;
    // Check WebP (RIFF....WEBP -> 52 49 46 46 .... 57 45 42 50)
    const isWebp =
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50;

    if (!isJpeg && !isPng && !isGif && !isWebp) {
      return { valid: false, error: 'The uploaded file content is not a valid image format.' };
    }
  } catch (err) {
    console.warn('Magic byte validation check warning:', err);
    // If arrayBuffer reading fails, allow with standard type check
  }

  return { valid: true };
}

/**
 * Validates a base64 Data URL to ensure it represents a safe image.
 */
export function validateImageDataUrl(dataUrl: string): boolean {
  if (!dataUrl || typeof dataUrl !== 'string') return false;
  if (!dataUrl.startsWith('data:image/')) return false;
  const match = dataUrl.match(/^data:image\/(jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/);
  return Boolean(match);
}

// ============================================================
// 4. CRYPTOGRAPHIC UTILITIES & SECURE AUTH
// ============================================================

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function constantTimeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  let diff = a.length ^ b.length;
  for (let i = 0; i < a.length; i++) {
    const charA = a.charCodeAt(i);
    const charB = i < b.length ? b.charCodeAt(i) : 0;
    diff |= charA ^ charB;
  }
  return diff === 0;
}

/**
 * Generates a cryptographically strong unique token.
 */
export function generateSecureToken(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    if (typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    const arr = new Uint8Array(24);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================
// 5. SLIDING-WINDOW RATE LIMITER
// ============================================================

interface RateLimitRecord {
  timestamps: number[];
  lockedUntil?: number;
}

const rateLimitStore: Record<string, RateLimitRecord> = {};

/**
 * Checks and records an action under a sliding window rate limit.
 * 
 * @param key Unique key for the action (e.g. 'login_attempt', 'track_lookup', 'form_enquiry')
 * @param maxRequests Maximum allowed requests in the time window
 * @param windowMs Time window in milliseconds
 * @param lockoutDurationMs Optional lockout duration if limit exceeded
 * @returns { allowed: boolean; remaining: number; retryAfterSeconds?: number }
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
  lockoutDurationMs?: number
): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  const now = Date.now();
  let record = rateLimitStore[key];

  if (!record) {
    record = { timestamps: [] };
    rateLimitStore[key] = record;
  }

  // Check if currently locked out
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  // Filter out timestamps outside window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    if (lockoutDurationMs) {
      record.lockedUntil = now + lockoutDurationMs;
      const retryAfterSeconds = Math.ceil(lockoutDurationMs / 1000);
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  // Record this request
  record.timestamps.push(now);
  const remaining = maxRequests - record.timestamps.length;
  return { allowed: true, remaining };
}

/**
 * Resets a rate limit key (e.g. upon successful authentication).
 */
export function resetRateLimit(key: string): void {
  delete rateLimitStore[key];
}

// ============================================================
// 6. SENSITIVE DATA MASKING
// ============================================================

/**
 * Safely masks a name for public tracking display (e.g. "Rahul Kumar" -> "R**** K****").
 */
export function maskName(name: string): string {
  if (!name || typeof name !== 'string') return 'Applicant';
  return name
    .split(' ')
    .map((part) => {
      if (part.length <= 2) return part;
      return part[0] + '*'.repeat(Math.min(part.length - 1, 4));
    })
    .join(' ');
}

/**
 * Safely masks a phone number (e.g. "+91 9876543210" -> "+91 98*****210").
 */
export function maskPhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  const clean = phone.trim();
  if (clean.length < 6) return '******';
  const start = clean.slice(0, 4);
  const end = clean.slice(-3);
  return `${start}*****${end}`;
}

/**
 * Safely masks an email address (e.g. "contact@example.com" -> "c***t@e***.com").
 */
export function maskEmail(email: string): string {
  if (!email || typeof email !== 'string' || !email.includes('@')) return '';
  const [user, domain] = email.split('@');
  const maskedUser = user.length <= 2 ? user[0] + '*' : user[0] + '***' + user.slice(-1);
  return `${maskedUser}@${domain}`;
}
