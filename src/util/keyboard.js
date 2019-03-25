// @flow

import type {Browser, Page, InterceptedRequest} from 'puppeteer';

export async function pressEnter(page: Page) {
    const enterKeyCharCode = 13;

    await page.keyboard.type(String.fromCharCode(enterKeyCharCode));
}
