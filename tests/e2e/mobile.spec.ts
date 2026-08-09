import { expect, test } from "@playwright/test";
import { assertNoHorizontalOverflow, completeTest, start } from "./helpers";

test("mobile layout supports landing, test, result and share", async ({ page }) => {
  await page.goto("/?src=xhs_post_01");
  await expect(page.getByTestId("landing-start")).toBeVisible();
  await assertNoHorizontalOverflow(page);

  await start(page);
  await expect(page.getByTestId("question-option")).toHaveCount(4);
  await assertNoHorizontalOverflow(page);

  await completeTest(page);
  await expect(page.getByTestId("destiny-city")).toBeVisible();
  await expect(page.getByTestId("share-card-preview")).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("share-card-download").click();
  expect(await (await downloadPromise).suggestedFilename()).toContain(".png");
  await assertNoHorizontalOverflow(page);
});
