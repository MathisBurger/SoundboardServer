import {AppProps} from "next/app";
import Head from "next/head";
import React, {useEffect, useState} from "react";
import {AccessTokenContext} from "../hooks/useAccessToken";
import {CurrentPlayingContext} from "../hooks/useCurrentPlaying";
import {ORIGIN} from "../constants";

function MyApp({ Component, pageProps }: AppProps) {

    const [accessToken, setAccessToken] = useState<string>('');
    const [currentPlaying, setCurrentPlaying] = useState<string[]>([]);

    useEffect(() => {
        fetch(`${ORIGIN}/api/currentPlaying`, {
            headers: {
                Authorization: `accessToken ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => setCurrentPlaying(data.sounds));
    }, []);
    return (
        <React.Fragment>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap" rel="stylesheet" />
                <title>Watchify</title>
            </Head>
            <AccessTokenContext.Provider value={{accessToken: accessToken, setAccessToken: (token: string) => setAccessToken(token)}}>
                <CurrentPlayingContext.Provider value={{currentPlaying, setCurrentPlaying}}>
                    <Component {...pageProps} />
                </CurrentPlayingContext.Provider>
            </AccessTokenContext.Provider>
        </React.Fragment>
    );
}

export default MyApp;