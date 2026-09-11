export function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  try {
    const parts = token.split('.')

    if (parts.length !== 3) {
      return null
    }

    const base64Url = parts[1]

    const base64 = base64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    )

    const jsonPayload = decodeURIComponent(
      Array.from(atob(padded))
        .map(
          (character) =>
            `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`,
        )
        .join(''),
    )

    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function isJwtExpired(token, clockSkewSeconds = 30) {
  const payload = decodeJwtPayload(token)

  if (!payload?.exp) {
    return true
  }

  const currentTime = Math.floor(Date.now() / 1000)

  return payload.exp <= currentTime + clockSkewSeconds
}

export function getUserFromAccessToken(token) {
  const payload = decodeJwtPayload(token)

  if (!payload) {
    return null
  }

  const permissions = payload.Permission

  return {
    id: payload.Name ?? null,
    tenantId: payload.TenantId ?? null,
    email: payload.Email ?? '',
    role: payload.Role ?? '',
    permissions: Array.isArray(permissions)
      ? permissions
      : permissions
        ? [permissions]
        : [],
  }
}