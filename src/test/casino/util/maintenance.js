// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {rootUrl} from '../../../const';
import {casinoConst} from '../casino-const';
import {setCalendar} from '../../../util/calendar';
import {setSelect} from '../../../util/select';
import {buttonCreate} from '../../../util/selector';
import {providerStaticInfo} from '../../../data/provider';
import {mainTimeout} from '../../../data/timeout';

const tableSelector = '[data-at-table-name="casino-maintenance"]';
const tableFirstRowSelector = `${tableSelector} tbody tr`;
const tableFirstRowJSQuery = `document.querySelector('${tableFirstRowSelector}')`;

export async function createCasinoMaintenance(page: Page, provider: string) {
    const dateObj = new Date();

    const date = dateObj.getDate() - 3;
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    await page.goto(rootUrl + casinoConst.url.create);

    await setCalendar(page, {
        selector: 'dateFrom',
        date,
        hours,
        minutes,
    });

    await setCalendar(page, {
        selector: 'dateTo',
        date,
        hours,
        minutes: minutes + 5,
    });

    await setSelect(page, {
        selector: 'provider',
        value: provider,
    });

    await page.click(buttonCreate);

    await page.waitForNavigation({timeout: mainTimeout});

    await page.goto(rootUrl + casinoConst.url.root);

    await page.waitForFunction(
        `${tableFirstRowJSQuery} && ${tableFirstRowJSQuery}.innerText.includes('${provider}')`,
        {timeout: mainTimeout}
    );
}

export async function createCasinoMaintenanceIForium(
    page: Page,
    subProvider: string
) {
    const iForiumName = providerStaticInfo.iForium.name;
    const iForiumSubProviderKey = providerStaticInfo.iForium.subProviderKey;

    const dateObj = new Date();

    const date = dateObj.getDate() - 14;
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    await page.goto(rootUrl + casinoConst.url.create);

    await setCalendar(page, {
        selector: 'dateFrom',
        date,
        hours,
        minutes,
    });

    await setCalendar(page, {
        selector: 'dateTo',
        date,
        hours,
        minutes: minutes + 5,
    });

    await setSelect(page, {
        selector: 'provider',
        value: iForiumName,
    });

    await setSelect(page, {
        selector: iForiumSubProviderKey,
        value: subProvider,
    });

    await page.click(buttonCreate);

    await page.waitForNavigation({timeout: mainTimeout});

    await page.goto(rootUrl + casinoConst.url.root);

    await page.waitForFunction(
        `${tableFirstRowJSQuery} && ${tableFirstRowJSQuery}.innerText.includes('${iForiumName} (')`,
        {timeout: mainTimeout}
    );
}
