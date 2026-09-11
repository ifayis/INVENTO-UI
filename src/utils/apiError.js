export function getApiErrorMessage(error, fallback = 'Something went wrong.') {
  const data = error?.data

  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (data?.errors && Array.isArray(data.errors)) {
    const messages = data.errors.filter(
      (item) => typeof item === 'string' && item.trim(),
    )

    if (messages.length > 0) {
      return messages.join(' ')
    }
  }

  if (data?.errors && typeof data.errors === 'object') {
    const validationMessages = Object.values(data.errors)
      .flat()
      .filter(
        (item) => typeof item === 'string' && item.trim(),
      )

    if (validationMessages.length > 0) {
      return validationMessages.join(' ')
    }
  }

  if (data?.message) {
    return data.message
  }

  if (error?.message) {
    return error.message
  }

  return fallback
}

export function getApiErrorMessages(error) {
  const data = error?.data

  if (Array.isArray(data?.errors)) {
    return data.errors.filter(
      (item) => typeof item === 'string' && item.trim(),
    )
  }

  if (data?.errors && typeof data.errors === 'object') {
    return Object.values(data.errors)
      .flat()
      .filter(
        (item) => typeof item === 'string' && item.trim(),
      )
  }

  const message = getApiErrorMessage(error, '')

  return message ? [message] : []
}