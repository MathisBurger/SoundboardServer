import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import {PreparedSound} from "../pages";
import React from "react";
import useAccessToken from "../hooks/useAccessToken";
import {ORIGIN} from "../constants";

interface SoundBoxProps {
    /**
     * The sound that should be displayed
     */
    sound: PreparedSound;
    /**
     * If the delete mode is enabled
     */
    deleteMode: boolean;
    /**
     * All currently playing sounds
     */
    currentPlaying: string[];
    /**
     * Is called if the sound list should be refreshed
     */
    refreshSoundList: () => void;
}

/**
 * Displays a sound and handles play and stop actions.
 * Furthermore, it handles if a sound can be deleted or not
 */
const SoundBox: React.FC<SoundBoxProps> = ({sound, deleteMode, currentPlaying, refreshSoundList}) => {

    const accessToken = useAccessToken();

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

    const deleteSound = async () => {
        await fetch(`${ORIGIN}/api/removeSound?soundName=${sound.name}`, {
            method: 'DELETE',
            headers: {
                Authorization: `accessToken ${accessToken.accessToken}`
            }
        });
        refreshSoundList();
    }

    return (
        <Grid item xs={2}>
            <Card>
                <CardContent
                    style={{background: sound.currentPlaying ? 'red' : '#999999', textAlign: 'center'}}
                    onClick={() => {
                        if (sound.currentPlaying) {
                            stopSound(sound.name);
                        } else {
                            playSound(sound.name);
                        }
                    }}
                >
                    <Typography variant="h3" color="#fff">{sound.name}</Typography>
                </CardContent>
                {deleteMode ? (
                    <CardActions>
                        <Button variant="contained" color="error" onClick={deleteSound}>
                            Remove
                        </Button>
                    </CardActions>
                ) : null}
            </Card>
        </Grid>
    );
}

export default SoundBox;