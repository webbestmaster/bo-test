// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {setSelect} from './select';

type FormDataInputType = "text" | "number" | "select";

type InputDataType = {
    type: FormDataInputType,
    name: string,
    value: string,
};

async function fillInput(page: Page, inputData: InputDataType) {
    const {type, name, value} = inputData;

    switch (type) {
        case 'text':
        case 'number':
            await page.type(`input[name="${name}"]`, value);
            break;
        case 'select':
            await setSelect(page, {selector: name, value});
            break;

        default:
            throw new Error(`unsupported input type: ${type}`);
    }
}

export async function fillForm(page: Page, formData: Array<InputDataType>) {
    // eslint-disable-next-line no-loops/no-loops
    for (const inputData of formData) {
        await fillInput(page, inputData);
    }
}
