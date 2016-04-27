#!/bin/sh
cd ../src/homeServices
GOOS=linux GOARCH=386 CGO_ENABLED=0 go build -o ../../out/homeServices
cd ../../bin

