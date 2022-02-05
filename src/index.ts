/**
 * This is the one we normally use.
 *
 * It is useful for when we have environment variables in `process.env` and
 * we may need to replace them at some point with static replacements like
 * in `@rollup/replace-plugin` or the webpack equivalent.
 *
 * USAGE:
 *
 * ```
 * const env = getStaticEnv({
 *   a: process.env.a, // explicitly use `process.env` for replace to work
 *   b: process.env.b
 * })
 * ```
 */
export function getStaticEnv<T extends { [key: string]: string | undefined }>(
  map: T
): MapToEnv<T> {
  const env = {} as MapToEnv<T>
  for (const key in map) {
    const value = map[key]
    if (typeof value !== "string") {
      throw new Error(
        `The key on passed in object ${key} must be a string but is ${value}`
      )
    }
    env[key] = value.trim()
  }
  return env
}

/**
 * Like `getStaticEnv` but throws an error if we try to use a property that
 * does not begin with `NEXT_PUBLIC_` to prevent accidentally compilation
 * into the source code in some cases.
 */
export function getNextPublicEnv<
  T extends { [key: string]: string | undefined }
>(map: T): MapToEnv<T> {
  const env = {} as MapToEnv<T>
  for (const key in map) {
    if (!key.startsWith("NEXT_PUBLIC_")) {
      throw new Error(
        `The key ${JSON.stringify(
          key
        )} does not begin with "NEXT_PUBLIC_" but should for a public env`
      )
    }
    const value = map[key]
    if (typeof value !== "string") {
      throw new Error(
        `The key on passed in object ${key} must be a string but is ${value}`
      )
    }
    env[key] = value.trim()
  }
  return env
}

/**
 * Useful when you know you won't be doing any replacements. Usually when you
 * are running code in Node.js without any deploy.
 *
 * USAGE:
 *
 * ```
 * const env = getDynamicEnv(process.env, ['a', 'b'])
 * ```
 */
export function getDynamicEnv<T extends string>(
  processEnv: Record<string, string | undefined>,
  envNames: T[]
): Record<T, string> {
  const env: Record<T, string> = {} as Record<T, string>
  for (const key of envNames) {
    const value = processEnv[key]
    if (typeof value !== "string") {
      throw new Error(
        `Expected env (passed in) to have ${JSON.stringify(
          key
        )} to be defined and be a string but it is not`
      )
    }
    env[key] = value
  }
  return env
}
type MapToEnv<T> = {
  [K in keyof T]: string
}
