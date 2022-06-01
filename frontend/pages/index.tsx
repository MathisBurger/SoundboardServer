import type {NextPage} from "next";
import AuthorizationWrapper from "../components/AuthorizationWrapper";
import {IMessageEvent, w3cwebsocket} from "websocket";
import {useEffect, useMemo, useState} from "react";
import useAccessToken from "../hooks/useAccessToken";
import {ORIGIN} from "../constants";
import {Button, Card, CardContent, Grid, Typography} from "@mui/material";
import useCurrentPlaying from "../hooks/useCurrentPlaying";
import AddSoundDialog from "../components/AddSoundDialog";

interface WebsocketUpdateMessage {
    action: string;
    updatedName: string;
    started: boolean;
}

interface PreparedSound {
    name: string;
    currentPlaying: boolean;
}

const Dashboard: NextPage = () => {

    const accessToken = useAccessToken();
    const [sounds, setSounds] = useState<string[]>([]);
    const {currentPlaying, setCurrentPlaying} = useCurrentPlaying();
    const [soundDialogOpen, setSoundDialogOpen] = useState<boolean>(false);

    const fetchSounds = () => {
        fetch(`${ORIGIN}/api/sounds`, {
            headers: {
                Authorization: `accessToken ${accessToken.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => setSounds(data.sounds));
    };

    useEffect(() => {
        const asyncLoader = async () => {
            let sock = new w3cwebsocket("ws://localhost:8080/ws");
            sock.onmessage = messageHandler;
            setTimeout(() => {
                sock.send(accessToken.accessToken);
            }, 250);
        };
        asyncLoader();
        fetchSounds();
    }, [accessToken]);

    const playSound = async (name: string) => {
        if (currentPlaying.indexOf(name) > -1) {
            return;
        }
        await fetch(`${ORIGIN}/api/player/playSound?soundName=${name}`, {
            headers: {
                Authorization: `accessToken ${accessToken.accessToken}`
            }
        });
    }

    const stopSound = async (name: string) => {
        if (currentPlaying.indexOf(name) > -1) {
            await fetch(`${ORIGIN}/api/player/stopSound?soundName=${name}`, {
                headers: {
                    Authorization: `accessToken ${accessToken.accessToken}`
                }
            });
        }
    }

    const stopAll = async () => {
        await fetch(`${ORIGIN}/api/player/stopSound`, {
            headers: {
                Authorization: `accessToken ${accessToken.accessToken}`
            }
        });
    }

    const messageHandler = (message: IMessageEvent) => {
        const data = JSON.parse(message.data as string) as WebsocketUpdateMessage;
        //console.log(data);
        if (data.action === 'UpdatePlaying') {
            if (data.started) {
                setCurrentPlaying([...currentPlaying, data.updatedName]);
            } else {
                setCurrentPlaying(currentPlaying.filter(name => name !== data.updatedName));
            }
        }
    }

    const preparedSounds = useMemo<PreparedSound[]>(
        () => sounds.map((sound) => ({
            name: sound,
            currentPlaying: currentPlaying.indexOf(sound) > -1
        })),
        [sounds, currentPlaying]
    );

    return (
        <AuthorizationWrapper>
            <Grid container direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={() => setSoundDialogOpen(true)} variant="contained" color="primary" style={{margin: '10px', padding: '10px'}}>
                    Add Sound
                </Button>
                <Button onClick={stopAll} variant="contained" color="primary" style={{margin: '10px', padding: '10px'}}>
                    Stop All
                </Button>
            </Grid>
            <Grid container direction="row" spacing={2}>
                {preparedSounds.map((sound, key) => (
                    <Grid item xs={2} key={key}>
                        <Card onClick={() => {
                            if (sound.currentPlaying) {
                                stopSound(sound.name);
                            } else {
                                playSound(sound.name);
                            }
                        }}>
                            <CardContent style={{background: sound.currentPlaying ? 'red' : '#999999', textAlign: 'center'}}>
                                <Typography variant="h3" color="#fff">{sound.name}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <AddSoundDialog
                open={soundDialogOpen}
                onClose={() => setSoundDialogOpen(false)}
                refreshSoundList={fetchSounds}
            />
        </AuthorizationWrapper>
    )
}

export default Dashboard;