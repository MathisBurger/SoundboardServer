import type {NextPage} from "next";
import AuthorizationWrapper from "../components/AuthorizationWrapper";
import {IMessageEvent, w3cwebsocket} from "websocket";
import {useEffect, useState} from "react";
import useAccessToken from "../hooks/useAccessToken";
import {ORIGIN} from "../constants";
import {Card, CardContent, Grid, Typography} from "@mui/material";

const Dashboard: NextPage = () => {

    const accessToken = useAccessToken();
    const [sounds, setSounds] = useState<string[]>([]);

    useEffect(() => {
        const asyncLoader = async () => {
            let sock = new w3cwebsocket("ws://localhost:8080/ws");
            setTimeout(() => {
                sock.send(accessToken.accessToken);
            }, 1000);
            sock.onmessage = messageHandler;
        };
        asyncLoader();
        fetch(`${ORIGIN}/api/sounds`, {
            headers: {
                Authorization: `accessToken ${accessToken.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => setSounds(data.sounds));
    }, [accessToken]);

    const messageHandler = (message: IMessageEvent) => console.log(message.data);

    return (
        <AuthorizationWrapper>
            <Grid container direction="row" spacing={2}>
                {sounds.map((sound, key) => (
                    <Grid item xs={2} key={key}>
                        <Card>
                            <CardContent style={{background: '#999999', textAlign: 'center'}}>
                                <Typography variant="h3" color="#fff">{sound}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </AuthorizationWrapper>
    )
}

export default Dashboard;