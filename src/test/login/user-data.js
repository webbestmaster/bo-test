// @flow

type UserLoginDataType = {|
    +login: string,
    +password: string,
|};

export const userLoginData: { +[key: string]: UserLoginDataType } = {
    usual: {
        login: 'admin',
        password: 'admin',
    },
    specSymbol: {
        login: 'qwe!@#$%^&*()',
        password: 'qwe!@#$%^&*()',
    },
};
