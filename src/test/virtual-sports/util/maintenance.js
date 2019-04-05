// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {rootUrl} from '../../../const';
import {virtualSportsConst} from '../virtual-sports-const';
import type {TimeType} from '../../../util/calendar';
import {setCalendar, timeToString} from '../../../util/calendar';
import type {SelectOptionType} from '../../../util/select';
import {setSelect} from '../../../util/select';
import {buttonCreate, buttonUpdate} from '../../../util/selector';
import {mainTimeout} from '../../../data/timeout';
import {domFunctionTextIncludes} from '../../../util/dom';

const tableSelector = '[data-at-table-name="virtual-sports-maintenance"]';
const tableFirstRowSelector = `${tableSelector} tbody tr`;

const dateShift = -0;

export async function checkVirtualSportsMaintenance(
    page: Page,
    providerData: SelectOptionType
) {
    const dateObject = new Date();

    const date = dateObject.getDate() + dateShift;
    const hour = dateObject.getHours();
    const minute = dateObject.getMinutes();

    const timeCreateStart: TimeType = {
        date,
        hour,
        minute,
    };

    const timeCreateEnd: TimeType = {
        date,
        hour,
        minute: Math.floor(minute / 5) * 5 + 5,
    };

    await createVirtualSportsMaintenance(
        page,
        providerData,
        timeCreateStart,
        timeCreateEnd
    );

    const timeEditStart: TimeType = {
        date,
        hour,
        minute: Math.floor(minute / 5) * 5 - 5,
    };

    const timeEditEnd: TimeType = {
        date,
        hour,
        minute: Math.floor(minute / 5) * 5 + 10,
    };

    await editVirtualSportsMaintenance(
        page,
        providerData,
        timeEditStart,
        timeEditEnd
    );
}

async function createVirtualSportsMaintenance(
    page: Page,
    providerData: SelectOptionType,
    timeStart: TimeType,
    timeEnd: TimeType
) {
    await page.goto(rootUrl + virtualSportsConst.url.maintenance.create, {
        waitUntil: ['networkidle0'],
    });

    await setCalendar(page, {selector: 'dateFrom', ...timeStart});

    await setCalendar(page, {selector: 'dateTo', ...timeEnd});

    await setSelect(page, {
        selector: 'provider',
        value: providerData.value,
    });

    await page.click(buttonCreate);

    await page.waitForNavigation({timeout: mainTimeout});

    await page.goto(rootUrl + virtualSportsConst.url.root, {
        waitUntil: ['networkidle0'],
    });

    await page.waitForFunction(
        domFunctionTextIncludes(tableFirstRowSelector, providerData.value),
        {timeout: mainTimeout}
    );

    await page.waitForFunction(
        domFunctionTextIncludes(tableFirstRowSelector, timeToString(timeStart)),
        {timeout: mainTimeout}
    );

    await page.waitForFunction(
        domFunctionTextIncludes(tableFirstRowSelector, timeToString(timeEnd)),
        {timeout: mainTimeout}
    );
}

async function editVirtualSportsMaintenance(
    page: Page,
    providerData: SelectOptionType,
    timeStart: TimeType,
    timeEnd: TimeType
) {
    await page.goto(rootUrl + virtualSportsConst.url.root, {
        waitUntil: ['networkidle0'],
    });

    await page.click(`${tableFirstRowSelector} a`);

    await page.waitForSelector('[name="dateFrom"]', {timeout: mainTimeout});

    await setCalendar(page, {selector: 'dateFrom', ...timeStart});

    await setCalendar(page, {selector: 'dateTo', ...timeEnd});

    await page.click(buttonUpdate);

    await page.waitForNavigation({timeout: mainTimeout});

    await page.waitForFunction(
        domFunctionTextIncludes(tableFirstRowSelector, providerData.value),
        {timeout: mainTimeout}
    );

    await page.waitForFunction(
        domFunctionTextIncludes(tableFirstRowSelector, timeToString(timeStart)),
        {timeout: mainTimeout}
    );

    await page.waitForFunction(
        domFunctionTextIncludes(tableFirstRowSelector, timeToString(timeEnd)),
        {timeout: mainTimeout}
    );
}
