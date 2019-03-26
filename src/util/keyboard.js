// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

export async function pressEnter(page: Page) {
    const enterKeyCharCode = 13;

    await page.keyboard.type(String.fromCharCode(enterKeyCharCode));
}

/*
export async function pressEsc(page: Page) {
    const escKeyCharCode = 27;

    await page.keyboard.type(String.fromCharCode(escKeyCharCode));
}

export async function pressTab(page: Page) {
    const tabKeyCharCode = 9;

    await page.keyboard.type(String.fromCharCode(tabKeyCharCode));
}
*/
