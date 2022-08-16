import Phaser from 'phaser';
import { CST } from "../CST";
//import { SceneInBuilding } from "./SceneInBuilding";
import { Character } from "../Characters/Character"
import { Building } from "../Building/Building";
import { Iota } from "../KUBE_Utils";
import { GO } from "../../../events/restqa.js";

export class SceneGame extends Phaser.Scene
{
    // Map
    currentMap;

    // Characters
    player = null;

    // Buildings
    buildingCount;
    buildings;

    constructor()
    {
        super({key: CST.SCENES.GAME});
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    init()
    {
    }

    // Preload
    ////////////////////////////////////////////////////////////////////////

    preload()
    {
    }

    // Create
    ////////////////////////////////////////////////////////////////////////

    create()
    {
        this.events.on(Phaser.Scenes.Events.POST_UPDATE, this.postUpdate, this);
        this.events.on(Phaser.Scenes.Events.RESUME, this.resume, this);

        this.createMap();
        this.createBuildings();
        this.createPlayer();
        this.createNpcs();
        this.createInteractions();
        this.createCameras();
    }

    createMap()
    {
        this.currentMap = this.add.tilemap("Map1");
        const terrain = this.currentMap.addTilesetImage("kubecity_atlas", "kubecity_atlas");
        const ground = this.currentMap.createLayer("Ground", [terrain], 0, 0);

        const groundBounds = ground.getBounds();
        this.physics.world.setBounds(0, 0, groundBounds.width, groundBounds.height);

        const jsonMap = window.OUTPUT.RESTQA_CITY
        this.buildingCount = jsonMap.buildings.length;
    }

    createBuildings()
    {
        this.buildings = this.physics.add.staticGroup();

        const buildingNames = ["Building1", "Building2", "Building3"]
        let buildingObjectList = [];
        
        // Get all the buildings provided by the tilemap
        for (let buildingName of buildingNames)
        {
            // @ts-ignore - Problem with Phaser’s types. classType supports classes 
            const buildingObjects = this.currentMap.createFromObjects("Buildings", {name: buildingName, classType: Building});
            buildingObjects.map((building) => {
                building.init(buildingName);
                buildingObjectList.push(building);
            });
        }

        // Only keep the number of buildings we want. The buildings are randomly selected then the rest is destroyed
        Phaser.Actions.Shuffle(buildingObjectList);

        for (let i = this.buildingCount; i < buildingObjectList.length; ++i)
        {
            buildingObjectList[i].destroy();
        }

        buildingObjectList = buildingObjectList.splice(0, this.buildingCount);

        // Init the inside of the buildings
        //const jsonMap = this.cache.json.get("jsonMap");
        const jsonMap = window.OUTPUT.RESTQA_CITY
        let buildingIndexes = Iota(CST.BUILDINGS.INSIDE_MAP_COUNT); // All the possible building map indexes

        for (let i = 0; i < buildingObjectList.length; ++i)
        {
            Phaser.Utils.Array.Shuffle(buildingIndexes);
            
            const floorCount = jsonMap.buildings[i].rooms.length;
            let floorMaps = [];

            for (let j = 0; j < floorCount; ++j)
            {
                floorMaps.push("BuildingMap" + buildingIndexes[j].toString());
            }

            this.buildings.add(buildingObjectList[i]);
            buildingObjectList[i].insideData = { floorMaps: floorMaps };
        }
    }

    createPlayer()
    {
        // @ts-ignore - Problem with Phaser’s types. classType supports classes 
        const characters = this.currentMap.createFromObjects("Character", {name: "Character", classType: Character});
        this.player = characters[0];
        this.player.setScale(0.8);
    }

    createNpcs()
    {
        
    }

    createInteractions()
    {
        this.physics.add.collider(this.player, this.buildings, this.onPlayerCollideBuilding, null, this);
    }

    createCameras()
    {
        this.cameras.main.startFollow(this.player);
        this.cameras.main.zoomTo(1.0, 0);
        this.cameras.main.roundPixels = true;
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    update(time, delta)
    {
        super.update(time, delta);

        this.player.update();
    }

    postUpdate()
    {
    }

    resume()
    {
        this.player.lookDown();
    }

    onPlayerCollideBuilding(character, building)
    {
        if (character.body.touching.up && character.isLookingUp() && building.isOnTheDoor(character.x))
        {
            const goEvent = new GO()
            goEvent.feature = 'get-/'
            window.dispatchEvent(goEvent)
            
            //this.scene.add(CST.SCENES.IN_BUILDING, SceneInBuilding, true, building.insideData);
            //this.scene.setVisible(false, CST.SCENES.GAME);
            //this.scene.pause(CST.SCENES.GAME);
        }
    }
}
