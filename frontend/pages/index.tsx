import type {NextPage} from "next";
import AuthorizationWrapper from "../components/AuthorizationWrapper";
import {IMessageEvent, w3cwebsocket} from "websocket";
import {useEffect, useMemo, useState} from "react";
import useAccessToken from "../hooks/useAccessToken";
import {ORIGIN} from "../constants";
import {Button, Grid, Typography} from "@mui/material";
import useCurrentPlaying from "../hooks/useCurrentPlaying";
import AddSoundDialog from "../components/AddSoundDialog";
import SoundBox from "../components/SoundBox";

interface WebsocketUpdateMessage {
    /**
     * The action that is provided by the websocket
     */
    action: string;
    /**
     * The name of the sound that has been changed
     */
    updatedName: string;
    /**
     * If the sound has started or not
     */
    started: boolean;
}

export interface PreparedSound {
    /**
     * The name of the sound
     */
    name: string;
    /**
     * If the sound is currently playing
     */
    currentPlaying: boolean;
}

const Dashboard: NextPage = () => {

    const accessToken = useAccessToken();
    const [sounds, setSounds] = useState<string[]>([]);
    const {currentPlaying, setCurrentPlaying} = useCurrentPlaying();
    const [soundDialogOpen, setSoundDialogOpen] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

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
                <Button
                    onClick={() => setDeleteMode(!deleteMode)}
                    variant="contained"
                    color="primary"
                    style={{margin: '10px', padding: '10px'}}
                >
                    toggle delete mode
                </Button>
                <Button onClick={() => setSoundDialogOpen(true)} variant="contained" color="primary" style={{margin: '10px', padding: '10px'}}>
                    Add Sound
                </Button>
                <Button onClick={stopAll} variant="contained" color="primary" style={{margin: '10px', padding: '10px'}}>
                    Stop All
                </Button>
            </Grid>
            <Grid container direction="row" spacing={2}>
                {preparedSounds.map((sound, key) => (
                    <SoundBox
                        sound={sound}
                        deleteMode={deleteMode}
                        currentPlaying={currentPlaying}
                        refreshSoundList={fetchSounds}
                        key={key}
                    />
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