// @flow

type MochaItType = {
    timeout(ms: number): void,
};

type MochaItCallbackType = () => (Promise<void> | void);

declare function describe(describe: string, callback: () => mixed): mixed;

declare function it(describe: string, callback: MochaItCallbackType): MochaItType;

declare function xit(describe: string, callback: MochaItCallbackType): MochaItType;

declare function before(callback: MochaItCallbackType): void;

declare function beforeEach(callback: MochaItCallbackType): void;

declare function afterEach(callback: MochaItCallbackType): void;

declare function after(callback: MochaItCallbackType): void;
