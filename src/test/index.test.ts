/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getDynamicEnv, getNextPublicEnv, getStaticEnv } from ".."
import { AssertType } from "@thesunny/assert-type"

describe("get-env", () => {
  describe("getStaticEnv", () => {
    it("should getStaticEnv", async () => {
      const env = getStaticEnv({ a: "alpha", b: "bravo" })
      expect(env).toEqual({ a: "alpha", b: "bravo" })
      AssertType.Equal<typeof env, { a: string; b: string }>(true)
    })

    it("should fail if a value is undefined", async () => {
      expect(() => getStaticEnv({ a: "alpha", b: undefined })).toThrow(
        "must be a string"
      )
    })
  })

  describe("getNextPublicEnv", () => {
    it("should get env", async () => {
      const env = getNextPublicEnv({
        NEXT_PUBLIC_A: "alpha",
        NEXT_PUBLIC_B: "bravo",
      })
      expect(env).toEqual({ NEXT_PUBLIC_A: "alpha", NEXT_PUBLIC_B: "bravo" })
      AssertType.Equal<
        typeof env,
        { NEXT_PUBLIC_A: string; NEXT_PUBLIC_B: string }
      >(true)
    })

    it("should throw if it doesn't start with NEXT_PUBLIC_", async () => {
      expect(() =>
        getNextPublicEnv({
          A: "alpha",
          NEXT_PUBLIC_B: "bravo",
        })
      ).toThrow('does not begin with "NEXT_PUBLIC_"')
    })
  })

  describe("getDynamicEnv", () => {
    it("should get env and narrow it", async () => {
      const env = getDynamicEnv({ a: "alpha", b: "bravo" }, ["a"])
      expect(env).toEqual({ a: "alpha" })
      AssertType.Equal<typeof env, { a: string }>(true)
    })

    it("should fail if key does not exist", async () => {
      expect(() => getDynamicEnv({ a: "alpha", b: "bravo" }, ["c"])).toThrow(
        'to have "c"'
      )
    })

    it("should fail if value is not a string", async () => {
      // @ts-ignore
      expect(() => getDynamicEnv({ a: 123 }, ["a"])).toThrow('to have "a"')
    })
  })
})
