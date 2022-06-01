import {createContext, useContext} from "react";

interface CurrentPlayingContextInterface {
    currentPlaying: string[];
    setCurrentPlaying: (value: string[]) => void;
}

export const CurrentPlayingContext = createContext<CurrentPlayingContextInterface>({
    currentPlaying: [],
    setCurrentPlaying: value => {}
});

const useCurrentPlaying = () => useContext(CurrentPlayingContext);

export default useCurrentPlaying;