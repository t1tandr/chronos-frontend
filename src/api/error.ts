export const errorCatch = (error: any) => {
  const message =
    error?.response?.data?.message || error?.message || 'Unknown error'

  return message
    ? typeof message === 'string'
      ? message[0]
      : message
    : error.message
}
