// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';
import puppeteer from 'puppeteer';

import {appConst} from '../const';

type SystemDataType = {|
    +page: Page,
    +browser: Browser,
|};

const pathToChromeMacOS
    = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export async function runSystem(): Promise<SystemDataType> {
    const {width, height} = appConst.window.size;

    const browser = await puppeteer.launch({
        // executablePath: pathToChromeMacOS,
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

    const [page] = await browser.pages();

    await page.setViewport({width: width - 20, height: height - 100});

    return {page, browser};
}
