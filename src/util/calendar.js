// @flow

import type {
    Browser,
    ElementHandleType,
    InterceptedRequest,
    Page,
} from 'puppeteer';

import {pressEnter} from './keyboard';

const calendarSelect = {
    prevButton:
        'path[d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"]',
    nextButton:
        'path[d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"]',
};

type CalendarSelectorDateType = "dateFrom" | "dateTo";

const calendarAnimationTime = 500;

async function openCalendar(page: Page, dateType: CalendarSelectorDateType) {
    const dateInputSelector = `input[name='${dateType}'] + div`;

    await page.waitForSelector(dateInputSelector, {timeout: 3e3});

    await page.click(dateInputSelector);

    await page.waitForSelector(calendarSelect.prevButton);

    await page.waitFor(calendarAnimationTime);
}

async function setCalendarDate(page: Page, date: number) {
    const dateElementHandleList = await page.$$(
        'div[role="presentation"] button[tabindex="0"] span:not(:empty)'
    );

    const dateElemToClick = dateElementHandleList[date - 1];

    if (dateElemToClick) {
        await dateElemToClick.click();
        await page.waitFor(calendarAnimationTime);
        return;
    }

    throw new Error('Date is not exists');
}

async function setCalendarTime(page: Page, hours: number, minutes: number) {
    const hoursElementHandleList = await page.$$(
        'span[style^="transform: translate("'
    );

    const hourElemToClick = hoursElementHandleList[hours];

    if (hourElemToClick) {
        await hourElemToClick.click();
        await page.waitFor(calendarAnimationTime);
    } else {
        throw new Error('Hour elem to click is not exists');
    }

    const minutesElementHandleList = await page.$$(
        'span[style^="transform: translate("'
    );
    const minuteElemToClick = minutesElementHandleList[Math.floor(minutes / 5)];

    if (minuteElemToClick) {
        await minuteElemToClick.click();
        await page.waitFor(calendarAnimationTime);
    } else {
        throw new Error('Minute elem to click is not exists');
    }
}

type CalendarDateOptionsType = {|
    +selector: CalendarSelectorDateType,
    +monthShift?: number,
    +date: number,
    +hours: number,
    +minutes: number,
|};

export async function setCalendar(
    page: Page,
    options: CalendarDateOptionsType
) {
    await openCalendar(page, options.selector);

    await setCalendarDate(page, options.date);
    await setCalendarTime(page, options.hours, options.minutes);

    await pressEnter(page);

    await page.waitFor(calendarAnimationTime);
}
