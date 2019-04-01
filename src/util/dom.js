// @flow

import type {
    Browser,
    ElementHandleType,
    InterceptedRequest,
    Page,
} from 'puppeteer';

export function domFunctionTextIncludes(
    cssSelector: string,
    text: string
): string {
    const jsSelector = `document.querySelector('${cssSelector}')`;

    return `${jsSelector} && ${jsSelector}.innerText.includes('${text}')`;
}

/*
export async function domGetHtml(
    page: Page,
    selector: string
): Promise<string> {
    return await page.evaluate<string>(
        `document.querySelector('${selector}').innerHTML;`
    );
}

export async function domGetText(
    page: Page,
    selector: string
): Promise<string> {
    return await page.evaluate<string>(
        `document.querySelector('${selector}').innerText;`
    );
}

export async function domGetAttribute(
    page: Page,
    selector: string,
    attribute: string
): Promise<string> {
    return await page.evaluate<string>(
        `document.querySelector('${selector}').getAttribute('${attribute}');`
    );
}
*/
