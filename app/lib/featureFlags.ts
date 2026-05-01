/**
 * Feature flag utility for controlling feature visibility.
 * Flags are controlled via environment variables prefixed with NEXT_PUBLIC_FEATURE_.
 */

export type FeatureFlag = "whats_new_landing_page";

const FLAG_ENV_MAP: Record<FeatureFlag, string> = {
  whats_new_landing_page: "NEXT_PUBLIC_FEATURE_WHATS_NEW_LANDING_PAGE",
};

/**
 * Returns true if the given feature flag is enabled.
 * In production builds, flags are read from environment variables.
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  const envKey = FLAG_ENV_MAP[flag];
  const value = process.env[envKey];
  return value === "true" || value === "1";
}
