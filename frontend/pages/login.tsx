import type {NextPage} from "next";
import {Button, Card, CardContent, TextField} from "@mui/material";
import {CSSProperties, useState} from "react";
import {log} from "util";
import {ORIGIN} from "../constants";
import useAccessToken from "../hooks/useAccessToken";
import {useRouter} from "next/router";


const Login: NextPage = () => {

    const [password, setPassword] = useState<string>('');
    const router = useRouter();
    const {setAccessToken} = useAccessToken();

    const CardStyle = {
        width: '30vw',
        height: 'fit-content',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    } as CSSProperties;

    const login = async () => {
        const result = await fetch(`${ORIGIN}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                password: password
            })
        });
        if (result.ok) {
            const json = await result.json();
            setAccessToken(json.auth_token);
            await router.push("/")
        }
    }

    return (
        <Card style={CardStyle}>
            <CardContent>
                <TextField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    fullWidth
                    label="Password"
                />
                <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    onClick={login}
                    style={{marginTop: '1em'}}
                >
                    Login
                </Button>
            </CardContent>
        </Card>
    );
}

export default Login;