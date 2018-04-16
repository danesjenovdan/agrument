#!/bin/sh
tmux new-session -d -s agrumentdev

tmux send-keys "npm start" C-m

tmux split-window -h
tmux send-keys "npm run api" C-m

tmux split-window -v
tmux send-keys "code ." C-m

tmux attach-session -d -t agrumentdev
