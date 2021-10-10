FROM canyan/janus-gateway:master_40f1ac66e95e1eed4bc91548e7187a1bb3ef3bd8

ENV DEBIAN_FRONTEND=noninteractive 

RUN \
# update packages
apt-get update -y && \
apt-get install -y \
# install general
bash wget curl procps \
# install gstreamer
gstreamer1.0-tools gstreamer1.0-plugins-base gstreamer1.0-plugins-good \
gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly \
gstreamer1.0-pulseaudio gstreamer1.0-vaapi && \
# install nodejs and pm2
curl -o nodejs.sh -L https://deb.nodesource.com/setup_lts.x && \
bash nodejs.sh && \
rm -f nodejs.sh && \
apt-get install -y nodejs && \
npm i -g pm2 && \
# install caddy
curl -o /usr/bin/caddy -L https://caddyserver.com/api/download?os=linux\&arch=amd64 && \
chmod +x /usr/bin/caddy && \
# cleanup
apt-get clean -y && \
rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# copy janus config
COPY \
./config/janus.jcfg \
./config/janus.plugin.streaming.jcfg \
/usr/local/etc/janus/

# copy tivoli shared desktop config
COPY \
./config/ecosystem.config.js \
./config/Caddyfile \
./config/overlay.png \
./config/stream-h264-nvenc.sh \
/opt/squirrel-camera/
COPY ./www/ /opt/squirrel-camera/www/

ENV \
STREAM_RES=1280x720 \
STREAM_BITRATE=4000 \
RTP_PORT_RANGE=10010-10019 \
NVIDIA_VISIBLE_DEVICES=all \
NVIDIA_DRIVER_CAPABILITIES=compute,video,utility

# run config with pm2
CMD pm2-runtime start /opt/squirrel-camera/ecosystem.config.js
