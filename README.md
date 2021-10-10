# Squirrel Camera

## https://squirrels.cutelab.space

A lot of this code was taken from my shared desktop project

-   https://shared-desktop.tivolicloud.com
-   https://git.tivolicloud.com/tivolicloud/shared-desktop

---

You need docker with nvidia support and an rtsp url

```yaml
docker-compose up --build
```

I'm having problems with loading rtsp through gstreamer, so I'm currently using ffmpeg in seperate container until it can put that into the main image.

---

For dynamic lights in Tivoli, add this to entity script:

https://squirrels.cutelab.space/dynamicLights.js
