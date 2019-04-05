// @flow

import assert from 'assert';

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {rootUrl} from '../../../const';
import {casinoConst} from '../casino-const';
import type {TimeType} from '../../../util/calendar';
import {setCalendar, timeToString} from '../../../util/calendar';
import type {SelectOptionType} from '../../../util/select';
import {setSelect} from '../../../util/select';
import {
    buttonCreate,
    buttonUpdate,
    confirmButtonApply,
    tableRemoveButton,
} from '../../../util/selector';
import {mainSelectorTimeout, mainTimeout} from '../../../data/timeout';
import {domFunctionTextIncludes} from '../../../util/dom';

const tableSelector = '[data-at-table-name="casino-maintenance"]';
const tableFirstRowSelector = `${tableSelector} tbody tr`;

const dateShift = -0;

export async function checkCasinoMaintenance(
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

    await createCasinoMaintenance(
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

    await editCasinoMaintenance(page, providerData, timeEditStart, timeEditEnd);

    await removeCasinoMaintenance(
        page,
        providerData,
        timeEditStart,
        timeEditEnd
    );
}

async function createCasinoMaintenance(
    page: Page,
    providerData: SelectOptionType,
    timeStart: TimeType,
    timeEnd: TimeType
) {
    await page.goto(rootUrl + casinoConst.url.maintenance.create, {
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

    await page.goto(rootUrl + casinoConst.url.root, {
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

async function editCasinoMaintenance(
    page: Page,
    providerData: SelectOptionType,
    timeStart: TimeType,
    timeEnd: TimeType
) {
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

async function removeCasinoMaintenance(
    page: Page,
    providerData: SelectOptionType,
    timeStart: TimeType,
    timeEnd: TimeType
) {
    await page.goto(rootUrl + casinoConst.url.root, {
        waitUntil: ['networkidle0'],
    });

    await page.waitForSelector(
        `${tableFirstRowSelector} ${tableRemoveButton}`,
        {timeout: mainTimeout}
    );
    await page.click(`${tableFirstRowSelector} ${tableRemoveButton}`);

    await page.waitForSelector(confirmButtonApply, {timeout: mainTimeout});
    await page.click(confirmButtonApply);

    await page.waitFor(1e3);

    await page.waitForSelector(`${tableSelector} tbody`, {
        timeout: mainTimeout,
    });

    await assert.rejects(async () => {
        await page.waitForFunction(
            domFunctionTextIncludes(tableFirstRowSelector, providerData.value),
            {timeout: mainSelectorTimeout}
        );

        await page.waitForFunction(
            domFunctionTextIncludes(
                tableFirstRowSelector,
                timeToString(timeStart)
            ),
            {timeout: mainSelectorTimeout}
        );

        await page.waitForFunction(
            domFunctionTextIncludes(
                tableFirstRowSelector,
                timeToString(timeEnd)
            ),
            {timeout: mainSelectorTimeout}
        );
    });
}
