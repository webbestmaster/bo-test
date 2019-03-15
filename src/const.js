// @flow

import {Page} from 'puppeteer';

const rootUrl = 'http://localhost:8181';

export const appConst = {
    window: {
        size: {
            width: 900,
            height: 620,
        },
    },
    url: {
        root: rootUrl,
        login: `${rootUrl}/login`,
    },
};
