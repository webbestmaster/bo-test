// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {rootUrl} from '../../../const';
import {casinoConst} from '../casino-const';
import type {TimeType} from '../../../util/calendar';
import {setCalendar, timeToString} from '../../../util/calendar';
import type {SelectOptionType} from '../../../util/select';
import {setSelect} from '../../../util/select';
import {buttonCreate, buttonUpdate} from '../../../util/selector';
import {providerStaticInfo} from '../../../data/provider';
import {mainTimeout} from '../../../data/timeout';
import {domFunctionTextIncludes} from '../../../util/dom';

const tableSelector = '[data-at-table-name="casino-maintenance"]';
const tableFirstRowSelector = `${tableSelector} tbody tr`;

const dateShift = -0;

export async function checkCasinoMaintenanceIForium(
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

    await createCasinoMaintenanceIForium(
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

    await editCasinoMaintenanceIForium(
        page,
        providerData,
        timeEditStart,
        timeEditEnd
    );
}

export async function createCasinoMaintenanceIForium(
    page: Page,
    subProviderData: SelectOptionType,
    timeStart: TimeType,
    timeEnd: TimeType
) {
    const iForiumName = providerStaticInfo.iForium.name;
    const iForiumSubProviderKey = providerStaticInfo.iForium.subProviderKey;

    await page.goto(rootUrl + casinoConst.url.create, {
        waitUntil: ['networkidle0'],
    });

    await setCalendar(page, {selector: 'dateFrom', ...timeStart});

    await setCalendar(page, {selector: 'dateTo', ...timeEnd});

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

    await page.goto(rootUrl + casinoConst.url.root, {
        waitUntil: ['networkidle0'],
    });

    await page.waitForFunction(
        domFunctionTextIncludes(tableFirstRowSelector, iForiumName),
        {timeout: mainTimeout}
    );

    await page.waitForFunction(
        domFunctionTextIncludes(
            tableFirstRowSelector,
            `(${subProviderData.text})`
        ),
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

export async function editCasinoMaintenanceIForium(
    page: Page,
    subProviderData: SelectOptionType,
    timeStart: TimeType,
    timeEnd: TimeType
) {
    const iForiumName = providerStaticInfo.iForium.name;
    const iForiumSubProviderKey = providerStaticInfo.iForium.subProviderKey;

    await page.goto(rootUrl + casinoConst.url.root, {
        waitUntil: ['networkidle0'],
    });

    await page.click(`${tableFirstRowSelector} a`);

    await page.waitForSelector('[name="dateFrom"]', {timeout: mainTimeout});

    await setCalendar(page, {selector: 'dateFrom', ...timeStart});

    await setCalendar(page, {selector: 'dateTo', ...timeEnd});

    await page.click(buttonUpdate);

    await page.waitForNavigation({timeout: mainTimeout});

    await page.waitForFunction(
        domFunctionTextIncludes(tableFirstRowSelector, iForiumName),
        {timeout: mainTimeout}
    );

    await page.waitForFunction(
        domFunctionTextIncludes(
            tableFirstRowSelector,
            `(${subProviderData.text})`
        ),
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
