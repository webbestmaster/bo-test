// @flow

type UserLoginDataType = {|
    +login: string,
    +password: string,
|};

export const userLoginData: { +[key: string]: UserLoginDataType } = {
    usual: {
        login: '',
        password: '',
    },
    specSymbol: {
        login: '',
        password: '',
    },
};
