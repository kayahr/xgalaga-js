#!/bin/bash
for RAW in *.raw
do 
    MP3=$(basename $RAW .raw).mp3
    WAV=$(basename $RAW .raw).wav
    sox -t raw -b 8 -e unsigned-integer -r 8000 $RAW -r 48000 -s $WAV
    lame $WAV $MP3
    oggenc $WAV
done
