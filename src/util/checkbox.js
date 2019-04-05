// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

type CheckboxOptionsType = {|
    +selector: string,
    +value: boolean,
|};

async function getCurrentState(
    page: Page,
    options: CheckboxOptionsType
): Promise<boolean> {
    return await page.evaluate<boolean>(
        `document.querySelector('input[name="${options.selector}"]').checked`
    );
}

export async function setCheckbox(page: Page, options: CheckboxOptionsType) {
    const currentState = await getCurrentState(page, options);

    if (currentState === options.value) {
        return;
    }

    await page.click(`input[name="${options.selector}"]`);
}
