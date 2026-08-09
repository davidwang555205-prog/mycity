import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import {
  captureErrors,
  completeTest,
  readResultSnapshot,
  readSession,
  start,
} from "./helpers";

test("Flow A, C, D: full result, report cache, analytics and PNG", async ({ page }) => {
  const errors = captureErrors(page);
  await start(page);
  await completeTest(page);

  const before = await readResultSnapshot(page);
  expect(before.destinyCity).toBeTruthy();
  expect(await page.getByTestId("report-section").count()).toBe(10);
  await expect(page.getByText("¥9.9")).toHaveCount(0);
  await expect(page.getByText("解锁")).toHaveCount(0);

  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("share-card-download").click();
  const download = await downloadPromise;
  expect(await download.suggestedFilename()).toContain(".png");
  const downloadPath = await download.path();
  expect(downloadPath).toBeTruthy();
  const png = await readFile(downloadPath!);
  expect(png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))).toBe(true);
  expect(png.readUInt32BE(16)).toBe(1080);
  expect(png.readUInt32BE(20)).toBe(1440);

  const session = await readSession(page);
  expect(session.acquisitionSource).toBe("xhs_post_01");
  const events = await page.evaluate(() => JSON.parse(localStorage.getItem("destiny-city-events") || "[]"));
  for (const name of ["landing_view", "test_started", "test_completed", "result_viewed", "report_viewed", "share_card_generated"]) {
    expect(events.some((event: { name: string }) => event.name === name)).toBe(true);
  }
  expect(events.filter((event: { name: string }) => event.name === "question_answered")).toHaveLength(28);
  expect(events.some((event: { name: string }) => event.name.includes("payment") || event.name.includes("paywall"))).toBe(false);

  for (let reload = 0; reload < 3; reload += 1) {
    await page.reload();
    await expect(page.getByTestId("result-page")).toBeVisible();
    expect(await readResultSnapshot(page)).toEqual(before);
  }
  expect((await readSession(page)).report?.cacheKey).toBe(before.report?.cacheKey);
  expect((await readSession(page)).report?.createdAt).toBe(before.report?.createdAt);
  expect(errors).toEqual([]);
});

test("Flow B: question set, options and answers survive reload at question 14", async ({ page }) => {
  await start(page);
  for (let index = 0; index < 14; index += 1) {
    await page.locator(`[data-testid="question-option"][data-option-index="${index % 4}"]`).click();
  }
  const before = await readSession(page);
  await expect(page.getByTestId("question-progress")).toContainText("15 / 28");
  await page.reload();
  await expect(page.getByTestId("question-progress")).toContainText("15 / 28");
  const after = await readSession(page);
  expect(after.sessionId).toBe(before.sessionId);
  expect(after.acquisitionSource).toBe(before.acquisitionSource);
  expect(after.questions).toEqual(before.questions);
  expect(after.answers).toEqual(before.answers);
  await completeTest(page, 14);
});
