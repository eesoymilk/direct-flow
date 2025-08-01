// auth.d.ts
declare module "#auth-utils" {
  interface User {
    // Core User Profile Attributes (Root Attributes)
    user_id: string; // Unique user identifier
    email?: string; // User's email address (unique)
    email_verified?: boolean; // Whether email is verified
    username?: string; // User's username (unique)
    phone_number?: string; // User's phone number
    phone_verified?: boolean; // Whether phone is verified
    name?: string; // Full name (1-150 characters)
    nickname?: string; // Nickname (1-350 characters)
    given_name?: string; // Given/first name (1-150 characters)
    family_name?: string; // Family/last name (1-150 characters)
    picture?: string; // URL to profile picture
    created_at?: string; // Timestamp when profile was created
    updated_at?: string; // Timestamp when profile was last updated
    last_login?: string; // Timestamp of last login
    last_ip?: string; // IP address of last login
    logins_count?: number; // Number of logins
    blocked?: boolean; // Whether user is blocked
    blocked_for?: Array<{ ip: string; reason: string }>; // IP addresses blocked for bruteforce

    // Metadata Objects
    user_metadata?: Record<string, any>; // Custom user info that doesn't affect access
    app_metadata?: Record<string, any>; // Custom user info that affects access

    // Identity Provider Information
    identities?: Array<{
      connection: string; // Name of Auth0 connection used
      isSocial: boolean; // Whether connection is social
      provider: string; // Name of identity provider (Facebook, Google, etc.)
      user_id: string; // User's unique identifier for this provider
      profileData?: Record<string, any>; // User info from the provider
      access_token?: string; // API access token for the provider
    }>;

    // Multi-factor Authentication
    multifactor?: string[]; // MFA methods enabled
    guardian_authenticators?: Array<{
      name: string;
      type: string;
      verified: boolean;
    }>;

    // Additional Auth0-specific fields
    tenant?: string; // Name of the tenant
    locale?: string; // User's locale preference
    zoneinfo?: string; // User's timezone

    // OpenID Connect standard claims (when using openid scope)
    sub?: string; // Subject identifier (same as user_id)
    iss?: string; // Issuer
    aud?: string; // Audience
    exp?: number; // Expiration time
    iat?: number; // Issued at time

    // Profile scope claims (when using profile scope)
    profile?: {
      name?: string;
      family_name?: string;
      given_name?: string;
      middle_name?: string;
      nickname?: string;
      preferred_username?: string;
      profile?: string; // Profile page URL
      picture?: string; // Profile picture URL
      website?: string; // Website URL
      gender?: string;
      birthdate?: string;
      zoneinfo?: string; // Timezone
      locale?: string; // Locale
      updated_at?: string; // Last update timestamp
    };

    // Email scope claims (when using email scope)
    email_scope?: {
      email?: string;
      email_verified?: boolean;
    };
  }
}

export {};
