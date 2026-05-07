/**
 * Feature flag utilities.
 * Feature flags are controlled via NEXT_PUBLIC_FEATURE_* environment variables.
 * Set the variable to "true" to enable the feature.
 */

export function isFeatureEnabled(flagName: string): boolean {
  const envKey = `NEXT_PUBLIC_FEATURE_${flagName.toUpperCase()}`;
  return process.env[envKey] === "true";
}

export const FeatureFlags = {
  WHATS_NEW_LANDING_PAGE: "WHATS_NEW_LANDING_PAGE",
} as const;
