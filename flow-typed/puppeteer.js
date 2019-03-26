// @flow

declare module 'puppeteer' {
    declare class KeyBoard {
        type(charCode: string):Promise<mixed>,
    }

    declare type ElementHandleClickOptionsType = {
        button?: 'left' | 'right' | 'middle', // defaults to left
        clickCount?: number, // defaults to 1
        delay?: number, // Time to wait between mousedown and mouseup in milliseconds. Defaults to 0.
    }

    declare type ElementHandleType = {
        click(options?: ElementHandleClickOptionsType): Promise<mixed>,
    }

    declare type PageScreenshotOptionsType = {
        path: string,
    }

    declare class InterceptedRequest {
        url(): string,
        resourceType(): string,
        abort(): mixed,
        continue(): mixed,
    }

    declare type WaitForNavigationOptionType = {
        timeout?: number,
    }

    declare type WaitForSelectorOptionType = {
        timeout?: number,
        visible?: boolean,
        hidden?: boolean,
    }

    declare type WaitForFunctionOptionType = {
        polling?: string | number,
        timeout?: number,
    }

    declare class Page {
        keyboard: KeyBoard,
        goto(url: string): Promise<mixed>,
        screenshot(options: PageScreenshotOptionsType): Promise<mixed>,
        click(cssSelector: string): Promise<mixed>,
        type(cssSelector: string, text: string): Promise<mixed>,
        $(cssSelector: string): Promise<?ElementHandleType>,
        $$(cssSelector: string): Promise<Array<?ElementHandleType>>,
        evaluate<T>(funcOrStringFunc: ((() => T) | string)): Promise<T>,
        url(): string,
        waitFor(timeoutInMs: number): Promise<mixed>,
        waitForFunction(pageFunction: string, options: WaitForFunctionOptionType): Promise<mixed>,
        setViewport(size: { width: number, height: number }): Promise<mixed>,
        setRequestInterception(isEnable: boolean): Promise<mixed>,
        on<T>(eventName: string, callback: (context: T) => mixed): mixed,
        waitForNavigation(options?: WaitForNavigationOptionType): Promise<mixed>,
        waitForSelector(selector: string, options?: WaitForSelectorOptionType): Promise<?ElementHandleType>,
    }

    declare class Browser {
        newPage(): Promise<Page>,
        close(): Promise<mixed>,
        pages(): Promise<Array<Page>>,
    }

    declare type LaunchOptionsType = {
        headless?: boolean,
        slowMo?: number,

        /*
        * `--window-size=${width},${height}`,
        * `--window-position=${leftPosition},${topPosition}`,
        * '--disable-infobars',
        * '--allow-insecure-localhost',
        * '--disable-gpu',
        * */
        args?: Array<string>, // example ['--window-size=384,480', '--disable-infobars']
    }

    declare function launch(launchOptions: LaunchOptionsType): Promise<Browser>;
}
