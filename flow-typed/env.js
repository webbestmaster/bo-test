// @flow

import type {Browser, Page} from 'puppeteer';

declare var process: {
    mockBrowser: Browser,
    mockPage: Page,
};
