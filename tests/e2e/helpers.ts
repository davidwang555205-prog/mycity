import { expect, type Page } from "@playwright/test";
export const SESSION_KEY="destiny-city-v3";
export type Session=Record<string, unknown>&{sessionId:string;acquisitionSource:string;questions:Array<{id:string;options:Array<{id:string}>}>;answers:Record<string,string>;profile?:Record<string,unknown>;report?:{cacheKey:string;createdAt:string;content:string}};
export async function readSession(page:Page){const raw=await page.evaluate(key=>localStorage.getItem(key),SESSION_KEY);if(!raw)throw new Error("missing persisted test session");return JSON.parse(raw) as Session;}
export async function start(page:Page){await page.goto("/?src=xhs_post_01");await page.getByTestId("landing-start").click();await expect(page.getByTestId("question-card")).toBeVisible();}
export async function answerCurrentQuestion(page:Page, optionIndex:number){await page.locator(`[data-testid="question-option"][data-option-index="${optionIndex}"]`).click();}
export async function completeTest(page:Page, startIndex=0){for(let index=startIndex;index<28;index++){await expect(page.getByTestId("question-progress")).toContainText(`${String(index+1).padStart(2,"0")} / 28`);await answerCurrentQuestion(page,index%4);}await expect(page.getByTestId("result-page")).toBeVisible();}
export async function readResultSnapshot(page:Page){const session=await readSession(page);return {lifeProfile:session.profile,destinyCity:await page.getByTestId("destiny-city").textContent(),report:session.report};}
export async function assertNoHorizontalOverflow(page:Page){expect(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)).toBe(false);}
export function captureErrors(page:Page){const errors:string[]=[];page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});page.on("pageerror",e=>errors.push(e.message));page.on("requestfailed",r=>errors.push(`request failed: ${r.url()}`));return errors;}
