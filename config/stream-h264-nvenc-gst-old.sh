# export GST_DEBUG="*:4"
gst-launch-1.0 \
  rtspsrc location=$RTSP_URL protocols=tcp is-live=true ! queue ! \
  rtph264depay ! decodebin ! queue ! \
    videoscale ! videorate ! videoconvert ! \
    video/x-raw,width=$STREAM_WIDTH,height=$STREAM_HEIGHT,format=NV12 ! queue ! \
    gdkpixbufoverlay location="/opt/squirrel-camera/overlay.png" ! \
      nvh264enc bitrate=$STREAM_BITRATE rc-mode=cbr-ld-hq preset=low-latency-hq zerolatency=true ! \
      video/x-h264,profile=baseline ! queue ! \
        rtph264pay pt=96 config-interval=1 ! \
        udpsink host=127.0.0.1 port=5004
