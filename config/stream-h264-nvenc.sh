# ffmpeg -h encoder=h264_nvenc
ffmpeg -nostats \
-rtsp_transport tcp -i $RTSP_URL -i /overlay.png \
-filter_complex "[0:v]scale=$STREAM_WIDTH:$STREAM_HEIGHT[out];[out][1:v]overlay'" \
-c:v h264_nvenc -b:v $(echo $STREAM_BITRATE)K -rc cbr_ld_hq -preset llhq -zerolatency 1 \
-an -f rtp rtp://app:5004?pkt_size=1316 \
