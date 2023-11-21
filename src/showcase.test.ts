import Showcase from "~/showcase"

test("should test", async () => {
  const showcase = new Showcase("jest")
  expect(showcase.name).toBe("jest-failed")
})
