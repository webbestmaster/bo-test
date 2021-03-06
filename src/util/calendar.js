// @flow

import type {
    Browser,
    ElementHandleType,
    InterceptedRequest,
    Page,
} from 'puppeteer';

import {mainTimeout} from '../data/timeout';

import {pressEnter} from './keyboard';

const calendarSelect = {
    prevButton:
        'path[d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"]',
    nextButton:
        'path[d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"]',
};

type CalendarSelectorDateType = "dateFrom" | "dateTo";

export type TimeType = {|
    +date: number,
    +hour: number,
    +minute: number,
|};

const calendarAnimationTime = 500;

async function openCalendar(page: Page, dateType: CalendarSelectorDateType) {
    const dateInputSelector = `input[name='${dateType}'] + div`;

    await page.waitForSelector(dateInputSelector, {timeout: mainTimeout});

    await page.click(dateInputSelector);

    await page.waitForSelector(calendarSelect.prevButton);

    await page.waitFor(calendarAnimationTime);
}

async function setCalendarDate(page: Page, date: number) {
    const dateElementHandleList = await page.$$(
        'div[role="presentation"] button[tabindex="0"] span:not(:empty)'
    );

    const dateElementToClick = dateElementHandleList[date - 1];

    if (dateElementToClick) {
        await dateElementToClick.click();
        await page.waitFor(calendarAnimationTime);
        return;
    }

    throw new Error('Date is not exists');
}

async function setCalendarTime(page: Page, hour: number, minute: number) {
    const hoursElementHandleList = await page.$$(
        'span[style^="transform: translate("'
    );

    const hourElementToClick = hoursElementHandleList[hour];

    if (hourElementToClick) {
        await hourElementToClick.click();
        await page.waitFor(calendarAnimationTime);
    } else {
        throw new Error('Hour elem to click is not exists');
    }

    const minutesElementHandleList = await page.$$(
        'span[style^="transform: translate("'
    );
    const minuteElementToClick = minutesElementHandleList[minute / 5];

    if (minuteElementToClick) {
        await minuteElementToClick.click();
        await page.waitFor(calendarAnimationTime);
    } else {
        console.error('Minute elem to click is not exists');
        // throw new Error('Minute elem to click is not exists');
    }
}

type CalendarDateOptionsType = {|
    +selector: CalendarSelectorDateType,
    +monthShift?: number,
    +date: number,
    +hour: number,
    +minute: number,
|};

export async function setCalendar(
    page: Page,
    options: CalendarDateOptionsType
) {
    await openCalendar(page, options.selector);

    await setCalendarDate(page, options.date);
    await setCalendarTime(page, options.hour, options.minute);

    await pressEnter(page);

    await page.waitFor(calendarAnimationTime);
}

export function timeToString(time: TimeType): string {
    const dateObject = new Date();

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');

    const date = String(time.date).padStart(2, '0');
    const hour = String(time.hour).padStart(2, '0');
    const minute = String(time.minute).padStart(2, '0');

    return `${year}-${month}-${date} ${hour}:${minute}`;
}
