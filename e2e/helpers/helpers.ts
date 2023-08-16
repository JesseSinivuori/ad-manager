import { Page } from "@playwright/test";

export const scrollGridToRight = async (page: Page) => {
  await page.getByRole("cell").first().hover();
  await page.mouse.wheel(2000, 0);
};
export const scrollGridToLeft = async (page: Page) => {
  await page.getByRole("cell").first().hover();
  await page.mouse.wheel(-2000, 0);
};
