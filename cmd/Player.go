package main

import (
	"github.com/faiface/beep"
	"github.com/faiface/beep/mp3"
	"github.com/faiface/beep/speaker"
	"github.com/faiface/beep/wav"
	"log"
	"os"
	"strings"
	"time"
)

func getStream(fileName string) (beep.StreamSeekCloser, beep.Format, error) {
	f, err := os.Open(fileName)
	if err != nil {
		log.Fatal(err)
	}
	if strings.HasSuffix(fileName, ".mp3") {
		return mp3.Decode(f)
	} else if strings.HasSuffix(fileName, ".wav") {
		return wav.Decode(f)
	}
	return nil, beep.Format{}, nil
}

func main() {
	streamer, format, err := getStream(os.Args[1])
	if err != nil {
		panic(err.Error())
	}
	defer streamer.Close()
	speaker.Init(format.SampleRate, format.SampleRate.N(time.Second/10))
	done := make(chan bool)
	speaker.Play(beep.Seq(streamer, beep.Callback(func() {
		done <- true
	})))

	<-done
}
