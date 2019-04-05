// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {mainTimeout} from '../data/timeout';

import type {InputDataType} from './form';

async function checkTextCell(page: Page, optionData: InputDataType) {
    const {name, value} = optionData;
    const selector = [
        'tbody tr:first-child td',
        `[data-at-table-cell-name="${name}"]`,
        `[data-at-table-cell-value="${String(value)}"]`,
    ].join('');

    await page.waitForSelector(selector, {timeout: mainTimeout});
}

async function checkCheckboxCell(page: Page, optionData: InputDataType) {
    const {name, value} = optionData;
    const selector = [
        'tbody tr:first-child td',
        `[data-at-table-cell-name="${name}"]`,
        ' ',
        `[data-at-checkbox-value="${String(value)}"]`,
    ].join('');

    await page.waitForSelector(selector, {timeout: mainTimeout});
}

async function checkTableCell(page: Page, optionData: InputDataType) {
    if (optionData.type === 'checkbox') {
        await checkCheckboxCell(page, optionData);
        return;
    }

    await checkTextCell(page, optionData);
}

export async function checkRowListInMainTable(
    page: Page,
    optionDataList: Array<InputDataType>
) {
    // eslint-disable-next-line no-loops/no-loops
    for (const inputData of optionDataList) {
        await checkTableCell(page, inputData);
    }
}
