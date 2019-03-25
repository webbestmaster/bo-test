// @flow

import type {Browser, Page, InterceptedRequest} from 'puppeteer';

// import {pressEsc, pressTab} from './keyboard';

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

    await page.waitForSelector(selectSelector, {timeout: 3e3});

    await page.click(selectSelector);

    await page.waitFor(selectAnimationTime);
}

async function selectOption(page: Page, value: string) {
    const optionSelector = `ul[role="listbox"] li[data-value="${value}"]`;

    await page.waitForSelector(optionSelector, {timeout: 3e3});

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

export async function getSelectValueList(
    page: Page,
    selector: string
): Promise<Array<string>> {
    await openSelect(page, selector);

    const optionSelector = 'ul[role="listbox"] li[data-value]';

    const optionList = await page.evaluate<Array<string>>(
        `Array.from(document.querySelectorAll('${optionSelector}')).map(elem => elem.dataset.value);`
    );

    await closeSelect(page, selector);

    return optionList;
}
