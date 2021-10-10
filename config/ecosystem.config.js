const fs = require("fs");
const child_process = require("child_process");

// const usingNvidia = fs.existsSync("/dev/nvidia0");
// if (usingNvidia == false) {
// 	throw new Error("Nvidia device not found!");
// }

// const STREAM_RES = process.env.STREAM_RES;

// for passing on to stream scripts

// process.env.STREAM_WIDTH = STREAM_RES.split("x")[0];
// process.env.STREAM_HEIGHT = STREAM_RES.split("x")[1];

// update janus config

const janusPrefix = "/usr/local";
const janusConfigPath = janusPrefix + "/etc/janus";

{
	// update janus config to disable everything but what we need

	const configPath = janusConfigPath + "/janus.jcfg";
	const config = fs.readFileSync(configPath, "utf8");

	const plugins = fs.readdirSync(janusPrefix + "/lib/janus/plugins");
	const transports = fs.readdirSync(janusPrefix + "/lib/janus/transports");

	const enabledPlugins = ["libjanus_streaming.so"];
	const enabledTransports = ["libjanus_websockets.so"];

	// filter out .so.0.0.0 and such, keep only .so's

	const disabledPlugins = plugins.filter(
		name => name.endsWith(".so") && !enabledPlugins.includes(name),
	);
	const disabledTransports = transports.filter(
		name => name.endsWith(".so") && !enabledTransports.includes(name),
	);

	fs.writeFileSync(
		configPath,
		config
			.replace(
				/# \[plugins\]/i,
				`disable = "${disabledPlugins.join(",")}"`,
			)
			.replace(
				/# \[transports\]/i,
				`disable = "${disabledTransports.join(",")}"`,
			),
	);
}

// get public ip if necessary

if (process.env.PUBLIC_IP == "getmypublicip") {
	process.env.PUBLIC_IP = child_process
		.execSync("curl http://api.ipify.org")
		.toString();
	console.log("My public IP is: " + process.env.PUBLIC_IP);
}

module.exports = {
	apps: [
		// {
		// 	name: "Stream",
		// 	kill_timeout: 1,
		// 	script: "/opt/squirrel-camera/stream-h264-nvenc.sh",
		// },
		{
			name: "Janus",
			script: "/usr/local/bin/janus",
			args: [
				...(process.env.PUBLIC_IP
					? ["--nat-1-1", process.env.PUBLIC_IP]
					: []),
				"-S",
				"stun.l.google.com:19302",
				"-r",
				process.env.RTP_PORT_RANGE,
			],
		},
		{
			name: "Caddy",
			script: "/usr/bin/caddy",
			args: ["run", "-config", "/opt/squirrel-camera/Caddyfile"],
		},
	],
};
