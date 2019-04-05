// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import type {InputDataType} from '../../../util/form';
import {fillForm} from '../../../util/form';
import {
    buttonCreate,
    buttonUpdate,
    confirmButtonApply,
} from '../../../util/selector';
import {mainTimeout} from '../../../data/timeout';
import {rootUrl} from '../../../const';
import {casinoConst} from '../casino-const';
import {checkRowListInMainTable} from '../../../util/table';

type PlatformType = "DESKTOP" | "MOBILE";

export function generateGameOptionList(
    id: number
): Array<Array<InputDataType>> {
    const key = String(Date.now()).substr(-4);

    const typeList = ['DESKTOP', 'MOBILE'];
    const enabledList = [false, true];

    const resultList: Array<Array<InputDataType>> = [];

    typeList.forEach((type: PlatformType, typeIndex: number) => {
        enabledList.forEach((isEnabled: boolean, enabledIndex: number) => {
            resultList.push([
                {
                    type: 'text',
                    name: 'name',
                    value: `at-name-${key}-${typeIndex}-${enabledIndex}-${id}`,
                },
                {
                    type: 'text',
                    name: 'gameId',
                    value: Number(`${key}0${typeIndex}${enabledIndex}${id}`),
                },
                {
                    type: 'text',
                    name: 'gid',
                    value: `at-gid-${key}-${typeIndex}-${enabledIndex}-${id}`,
                },
                {
                    type: 'select',
                    name: 'type',
                    value: type,
                },
                {
                    type: 'checkbox',
                    name: 'enabled',
                    value: isEnabled,
                },
            ]);
        });
    });

    return resultList;
}

async function checkDataInTable(page: Page, optionList: Array<InputDataType>) {
    await page.goto(rootUrl + casinoConst.url.playNGo.root, {
        waitUntil: ['networkidle0'],
    });

    await checkRowListInMainTable(page, optionList);
}

export async function createCasinoPlayNGoGame(
    page: Page,
    option: Array<InputDataType>
) {
    await page.goto(rootUrl + casinoConst.url.playNGo.create, {
        waitUntil: ['networkidle0'],
    });

    await fillForm(page, option);

    await page.click(buttonCreate);

    await page.waitForNavigation({timeout: mainTimeout});

    await checkDataInTable(page, option);
}

export async function updateCasinoPlayNGoGame(
    page: Page,
    option: Array<InputDataType>
) {
    await page.goto(rootUrl + casinoConst.url.playNGo.root, {
        waitUntil: ['networkidle0'],
    });

    await page.waitForSelector('td[data-at-table-cell-name="edit"]', {
        timeout: mainTimeout,
    });

    await page.click('td[data-at-table-cell-name="edit"] a');

    await page.waitForSelector('input[name="name"]', {timeout: mainTimeout});

    await fillForm(page, option);

    await page.click(buttonUpdate);

    await page.waitForSelector(confirmButtonApply, {timeout: mainTimeout});
    await page.click(confirmButtonApply);

    await page.waitForNavigation({timeout: mainTimeout});

    await checkDataInTable(page, option);
}
