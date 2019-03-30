// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {rootUrl} from '../../../const';
import {casinoConst} from '../casino-const';
import {setCalendar} from '../../../util/calendar';
import {setSelect} from '../../../util/select';
import {buttonCreate} from '../../../util/selector';
import {providerStaticInfo} from '../../../data/provider';
import {mainTimeout} from '../../../data/timeout';
import type {SelectOptionType} from '../../../util/select';

const tableSelector = '[data-at-table-name="casino-maintenance"]';
const tableFirstRowSelector = `${tableSelector} tbody tr`;
const tableFirstRowJSQuery = `document.querySelector('${tableFirstRowSelector}')`;

const dateShift = -18;

export async function createCasinoMaintenance(
    page: Page,
    providerData: SelectOptionType
) {
    const dateObject = new Date();

    const date = dateObject.getDate() + dateShift;
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

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
        value: providerData.value,
    });

    await page.click(buttonCreate);

    await page.waitForNavigation({timeout: mainTimeout});

    await page.goto(rootUrl + casinoConst.url.root);

    await page.waitForFunction(
        `${tableFirstRowJSQuery} && ${tableFirstRowJSQuery}.innerText.includes('${
            providerData.value
        }')`,
        {timeout: mainTimeout}
    );
}

export async function editCasinoMaintenance(
    page: Page,
    providerData: SelectOptionType
) {
    console.warn('edit and remove CasinoMaintenance is not implemented!');
}

export async function createCasinoMaintenanceIForium(
    page: Page,
    subProviderData: SelectOptionType
) {
    const iForiumName = providerStaticInfo.iForium.name;
    const iForiumSubProviderKey = providerStaticInfo.iForium.subProviderKey;

    const dateObject = new Date();

    const date = dateObject.getDate() + dateShift;
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

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
        value: subProviderData.value,
    });

    await page.click(buttonCreate);

    await page.waitForNavigation({timeout: mainTimeout});

    await page.goto(rootUrl + casinoConst.url.root);

    await page.waitForFunction(
        `
        ${tableFirstRowJSQuery} && 
        ${tableFirstRowJSQuery}.innerText.includes('${iForiumName}') &&
        ${tableFirstRowJSQuery}.innerText.includes('(${subProviderData.text})')
        `,
        {timeout: mainTimeout}
    );
}

export async function editCasinoMaintenanceIForium(
    page: Page,
    providerData: SelectOptionType
) {
    console.warn(
        'edit and remove CasinoMaintenanceIForium is not implemented!'
    );
}
