export const extractCookie = (headers: Record<string, string[]>) => {
  const cookies = headers['set-cookie']

  if (!cookies) {
    return {}
  }

  return cookies.reduce((result: Record<string, ParsedCookie>, cookie: string) => {
    const [rawCookie, ...flags] = cookie.split('; ')
    const [cookieName, value] = rawCookie.split('=')
    return {...result, [cookieName]: {value, options: cookieOptions(flags)}}
  }, {})
}

interface ParsedCookie {
  value: string
  options: Record<string, string>
}

const cookieOptions = (options: string[]) =>
  options.reduce((shapedFlags, flag) => {
    const [flagName, rawValue] = flag.split('=')
    const value = rawValue ? rawValue.replace(';', '') : true
    return {...shapedFlags, [flagName]: value}
  }, {})
