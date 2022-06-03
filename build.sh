go build -o Player cmd/Player.go
go build -o SoundboardServer cmd/SoundboardServer.go
cd frontend && yarn build && yarn export
cd ..
mv frontend/out ./webassets
