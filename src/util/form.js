// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {setSelect} from './select';
import {setCheckbox} from './checkbox';

type FormDataInputType = "text" | "number" | "select";

type TextDataType = {
    type: FormDataInputType,
    name: string,
    value: string | number,
};

type CheckboxDataType = {
    type: "checkbox",
    name: string,
    value: boolean,
};

export type InputDataType = TextDataType | CheckboxDataType;

async function fillInput(page: Page, inputData: InputDataType) {
    const {type, name, value} = inputData;

    const inputTextSelector = `input[name="${name}"]`;

    switch (type) {
        case 'text':
        case 'number':
            await page.click(inputTextSelector, {clickCount: 3});
            await page.type(inputTextSelector, String(value));
            break;
        case 'select':
            await setSelect(page, {selector: name, value: String(value)});
            break;

        case 'checkbox':
            await setCheckbox(page, {selector: name, value: Boolean(value)});
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
