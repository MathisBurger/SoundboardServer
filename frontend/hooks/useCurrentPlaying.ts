import {createContext, useContext} from "react";

interface CurrentPlayingContextInterface {
    /**
     * All current playing sounds
     */
    currentPlaying: string[];
    /**
     * Sets the new current playing sounds
     *
     * @param value The new array of sounds
     */
    setCurrentPlaying: (value: string[]) => void;
}

/**
 * The context used for current playing sounds
 */
export const CurrentPlayingContext = createContext<CurrentPlayingContextInterface>({
    currentPlaying: [],
    setCurrentPlaying: value => {}
});

/**
 * Hook that provides all current playing sounds
 */
const useCurrentPlaying = () => useContext(CurrentPlayingContext);

export default useCurrentPlaying;