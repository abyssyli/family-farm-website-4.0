
// task project adjust
import { test, expect } from "@playwright/test"

test("homepage renders and navigation works", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: /marketplace/i })).toBeVisible()

  await page.getByRole("navigation").getByRole("link", { name: "Products" }).click()
  await expect(page.getByRole("heading", { name: "Products" })).toBeVisible()

  await page.getByRole("link", { name: /Chicken and Eggs/i }).click()
  await expect(page.getByRole("heading", { name: /Chicken and Eggs/i })).toBeVisible()

  await page.getByRole("link", { name: /View details/i }).first().click()
  await expect(page.getByRole("button", { name: /Buy \/ Contact/i })).toBeVisible()

  await page.getByRole("button", { name: /Buy \/ Contact/i }).click()
  await expect(page.getByText(/Call or text Paula/i)).toBeVisible()
  await expect(page.getByText(/\+1 \(806\) 290-4949/)).toBeVisible()
})

test("skincare category points to BeakerGold", async ({ page }) => {
  await page.goto("/products")
  const href = await page
    .getByRole("link", { name: /Browse Lisa’s Skincare/i })
    .getAttribute("href")
  expect(href).toBe(
    "https://beakergold.com/?srsltid=AfmBOoryko08_1LDeogRpEWca9eUNONUfYgzEcHan-g1G7SlziXYTyvR"
  )
})
