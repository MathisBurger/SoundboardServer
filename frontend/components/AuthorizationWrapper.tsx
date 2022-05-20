import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {ORIGIN} from "../constants";
import useAccessToken from "../hooks/useAccessToken";

type Props = React.PropsWithChildren<any>;

const AuthorizationWrapper: React.FC<Props> = ({children}) => {
    const {accessToken} = useAccessToken();
    const router = useRouter();
    useEffect(() => {
        fetch(`${ORIGIN}/api/check_login`, {
            method: "GET",
            headers: {
                Authorization: `accessToken ${accessToken}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    router.push("/login");
                }
            })
    }, []);

    return (
        <>
            {children}
        </>
    );
}

export default AuthorizationWrapper;