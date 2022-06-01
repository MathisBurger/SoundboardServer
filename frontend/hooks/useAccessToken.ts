import {createContext, useContext} from "react";

interface AccessTokenContextInterface {
    /**
     * The accessToken
     */
    accessToken: string;

    /**
     * Used for setting the accessToken
     *
     * @param token The new accessToken
     */
    setAccessToken(token: string): void;
}

/**
 * The context for access token
 */
export const AccessTokenContext = createContext<AccessTokenContextInterface>({
    accessToken: '',
    setAccessToken(token: string) {
    }
});

/**
 * Hook that provides the values of the context
 */
const useAccessToken = () => useContext<AccessTokenContextInterface>(AccessTokenContext);

export default useAccessToken;