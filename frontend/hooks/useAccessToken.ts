import {createContext, useContext} from "react";

interface AccessTokenContextInterface {
    accessToken: string;
    setAccessToken(token: string): void;
}

export const AccessTokenContext = createContext<AccessTokenContextInterface>({
    accessToken: '',
    setAccessToken(token: string) {
    }
});


const useAccessToken = () => useContext<AccessTokenContextInterface>(AccessTokenContext);

export default useAccessToken;