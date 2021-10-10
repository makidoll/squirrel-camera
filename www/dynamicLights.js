(function () {
	var entityId;
	var lightsIds = [];

	var intensity = 16;

	this.initDynamicLights = function () {
		var entity = Entities.getEntityProperties(entityId, ["dimensions"]);

		lightsIds = [
			[-1, 1], [ 0, 1], [ 1, 1],
			[-1, 0],          [ 1, 0],
			[-1,-1], [ 0,-1], [ 1,-1],
		].map(function(light) {
			return Entities.addEntity({
				type: "Light",
				name: "space.cutelab.squirrel-camera",
				parentID: entityId,

				intensity: intensity,
				falloffRadius: entity.dimensions.x / 3,
				color: { r: 0, g: 0, b: 0 },
				dimensions: {
					x: entity.dimensions.x * 8,
					y: entity.dimensions.x * 8,
					z: entity.dimensions.x * 8,
				},
				localPosition: {
					x: light[0] * entity.dimensions.x / 2,
					y: light[1] * entity.dimensions.y / 2,
					z: 0
				},
			}, "local");
		});
	}

	this.webEventReceived = function (_entityId, msg) {
		if (_entityId != entityId) return;
		msg = msg.split(",");

		Entities.editEntity(lightsIds[0], {color:{r:msg[ 0],g:msg[ 1],b:msg[ 2]}});
		Entities.editEntity(lightsIds[1], {color:{r:msg[ 3],g:msg[ 4],b:msg[ 5]}});
		Entities.editEntity(lightsIds[2], {color:{r:msg[ 6],g:msg[ 7],b:msg[ 8]}});

		Entities.editEntity(lightsIds[3], {color:{r:msg[ 9],g:msg[10],b:msg[11]}});
		Entities.editEntity(lightsIds[4], {color:{r:msg[12],g:msg[13],b:msg[14]}});

		Entities.editEntity(lightsIds[5], {color:{r:msg[15],g:msg[16],b:msg[17]}});
		Entities.editEntity(lightsIds[6], {color:{r:msg[18],g:msg[19],b:msg[20]}});
		Entities.editEntity(lightsIds[7], {color:{r:msg[21],g:msg[22],b:msg[23]}});
	}

	this.preload = function (_entityId) {
		entityId = _entityId;

		try {
			var userData = JSON.parse(
				Entities.getEntityProperties(entityId, ["userData"]).userData
			);
			if (typeof userData.intensity == "number") {
				intensity = userData.intensity;
			}
		} catch(err) {}

		this.initDynamicLights();
		Entities.webEventReceived.connect(this.webEventReceived);
	}

	this.unload = function () {
		Entities.webEventReceived.disconnect(this.webEventReceived);
		lightsIds.forEach(function(lightId) {
			Entities.deleteEntity(lightId);
		});
	}
})