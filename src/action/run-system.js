// @flow

import type {Browser, Page, InterceptedRequest} from 'puppeteer';
import puppeteer from 'puppeteer';

import {appConst} from '../const';

type SystemDataType = {|
    page: Page,
    browser: Browser,
|};

export async function runSystem(): Promise<SystemDataType> {
    const {width, height} = appConst.window.size;

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        args: [
            `--window-size=${width},${height}`,
            '--window-position=40,40',
            '--disable-infobars',
            '--allow-insecure-localhost',
            '--disable-gpu',
        ],
    });

    const page = await browser.newPage();

    await page.setViewport({width, height});

    return {page, browser};
}
