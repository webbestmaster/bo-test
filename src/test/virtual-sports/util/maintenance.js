// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {rootUrl} from '../../../const';
import {virtualSportsConst} from '../virtual-sports-const';
import {setCalendar} from '../../../util/calendar';
import type {SelectOptionType} from '../../../util/select';
import {setSelect} from '../../../util/select';
import {buttonCreate} from '../../../util/selector';
import {mainTimeout} from '../../../data/timeout';

const tableSelector = '[data-at-table-name="virtual-sports-maintenance"]';
const tableFirstRowSelector = `${tableSelector} tbody tr`;
const tableFirstRowJSQuery = `document.querySelector('${tableFirstRowSelector}')`;

const dateShift = -5;

export async function createVirtualSportsMaintenance(
    page: Page,
    providerData: SelectOptionType
) {
    const dateObject = new Date();

    const date = dateObject.getDate() + dateShift;
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    await page.goto(rootUrl + virtualSportsConst.url.create);

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

    await page.goto(rootUrl + virtualSportsConst.url.root);

    await page.waitForFunction(
        `${tableFirstRowJSQuery} && ${tableFirstRowJSQuery}.innerText.includes('${
            providerData.value
        }')`,
        {timeout: mainTimeout}
    );
}
