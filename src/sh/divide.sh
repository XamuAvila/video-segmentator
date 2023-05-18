#!/bin/bash

input_file="$1"
output_path="$2"
segment_time="$3"

ffmpeg -i ${input_file} -c:v libx264 -c:a aac -c copy -map 0 -segment_time ${segment_time} -f segment  ${output_path}
