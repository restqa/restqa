import { CST } from "../CST";
import { SceneGame } from "./SceneGame";
import Phaser from 'phaser';

//const HOST_ASSETS = 'http://localhost:5000'
const HOST_ASSETS = 'https://raw.githubusercontent.com/olivierodo/restqa-progress/master'

export class ScenePreloadAssets extends Phaser.Scene
{
    constructor()
    {
        super({key: CST.SCENES.PRELOAD_ASSETS});
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
        this.loadKubecityMaps();
        this.loadBuildingMaps();
        this.loadFurnitures();
        this.loadCharacters();
    }

    loadKubecityMaps()
    {
        //this.load.setPath("./assets/maps");
        this.load.image("kubecity_atlas", `${HOST_ASSETS}/assets/maps/kubecity_atlas.png`);
        this.load.tilemapTiledJSON("Map1", `${HOST_ASSETS}/assets/maps/kubecity/outside/Map1.json`);

        // For olivierodo - This is where the json example is loaded
        //this.load.json("jsonMap", "jsonMap.json");
        this.load.json("jsonMap", `${HOST_ASSETS}/assets/maps/jsonMap.json`);

        //this.load.setPath("./assets/Buildings");
        this.load.image("Building1", `${HOST_ASSETS}/assets/Buildings/Building1.png`);
        this.load.image("Building2", `${HOST_ASSETS}/assets/Buildings/Building2.png`);
        this.load.image("Building3", `${HOST_ASSETS}/assets/Buildings/Building3.png`);
        //this.load.image("Building2", "Building2.png");
        //this.load.image("Building3", "Building3.png");
    }

    loadBuildingMaps()
    {
        //this.load.setPath("./assets/maps");

        for (let i = 1; i <= CST.BUILDINGS.INSIDE_MAP_COUNT; ++i)
        {
            this.load.tilemapTiledJSON("BuildingMap" + i.toString(), `${HOST_ASSETS}/assets/maps/kubecity/inside/BuildingMap${i.toString()}.json`);
        }
    }

    loadFurnitures()
    {
        //this.load.setPath("./assets/Furnitures");
        this.load.image("bed", `${HOST_ASSETS}/assets/Furnitures/bed.png`);
        this.load.image("cupboard", `${HOST_ASSETS}/assets/Furnitures/cupboard.png`);
        this.load.image("table", `${HOST_ASSETS}/assets/Furnitures/table.png`);
    }

    loadCharacters()
    {
        //this.load.setPath("./assets/Characters");
        this.load.spritesheet("player", `${HOST_ASSETS}/assets/Characters/Player.png`, { frameWidth: 68, frameHeight: 72 });
    }

    // Create
    ////////////////////////////////////////////////////////////////////////
  
    create() 
    {
        this.createSceneGame();
    }

    createSceneGame()
    {
        this.scene.add(CST.SCENES.GAME, SceneGame, true, null);
        this.scene.remove(CST.SCENES.PRELOAD_ASSETS);
    }
}
