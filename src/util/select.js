// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {mainTimeout} from '../data/timeout';

type SelectOptionsType = {|
    +selector: string,
    +value: string,
|};

const selectAnimationTime = 500;

function getWrapperSelector(selector: string): string {
    return `[data-at-name="${selector}"]`;
}

async function openSelect(page: Page, selector: string) {
    const selectSelector = getWrapperSelector(selector);

    await page.waitForSelector(selectSelector, {timeout: mainTimeout});

    await page.click(selectSelector);

    await page.waitFor(selectAnimationTime);
}

async function selectOption(page: Page, value: string) {
    const optionSelector = `ul[role="listbox"] li[data-value="${value}"]`;

    await page.waitForSelector(optionSelector, {timeout: mainTimeout});

    await page.click(optionSelector);

    await page.waitFor(selectAnimationTime);
}

async function closeSelect(page: Page, selector: string) {
    const selectSelector = getWrapperSelector(selector);

    await page.click(selectSelector);

    await page.waitFor(selectAnimationTime);
}

export async function setSelect(page: Page, options: SelectOptionsType) {
    await openSelect(page, options.selector);

    await selectOption(page, options.value);
}

export type SelectOptionType = {|
    +value: string,
    +text: string,
|};

export async function getSelectValueList(
    page: Page,
    selector: string,
    needKeepEmpty?: boolean
): Promise<Array<SelectOptionType>> {
    await openSelect(page, selector);

    const optionSelector = 'ul[role="listbox"] li[data-value]';

    const optionList = await page.evaluate<Array<SelectOptionType>>(
        `Array.from(document.querySelectorAll('${optionSelector}'))
            .map(elem => ({value: elem.dataset.value, text: elem.innerText}));`
    );

    await closeSelect(page, selector);

    if (needKeepEmpty !== true) {
        return optionList.filter(
            (providerData: SelectOptionType): boolean =>
                Boolean(providerData.value)
        );
    }

    return optionList;
}
