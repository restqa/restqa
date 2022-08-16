import { CST } from "../CST";
import { SceneGame } from "./SceneGame";
import Phaser from 'phaser';

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
        this.load.image("kubecity_atlas", "http://localhost:5000/assets/maps/kubecity_atlas.png");
        this.load.tilemapTiledJSON("Map1", "https://raw.githubusercontent.com/olivierodo/restqa-progress/master/assets/maps/kubecity/outside/Map1.json");

        // For olivierodo - This is where the json example is loaded
        //this.load.json("jsonMap", "jsonMap.json");
        this.load.json("jsonMap", "https://raw.githubusercontent.com/olivierodo/restqa-progress/master/assets/maps/jsonMap.json");

        //this.load.setPath("./assets/Buildings");
        this.load.image("Building1", "http://localhost:5000/assets/Buildings/Building1.png");
        this.load.image("Building2", "http://localhost:5000/assets/Buildings/Building2.png");
        this.load.image("Building3", "http://localhost:5000/assets/Buildings/Building3.png");
        //this.load.image("Building2", "Building2.png");
        //this.load.image("Building3", "Building3.png");
    }

    loadBuildingMaps()
    {
        //this.load.setPath("./assets/maps");

        for (let i = 1; i <= CST.BUILDINGS.INSIDE_MAP_COUNT; ++i)
        {
            this.load.tilemapTiledJSON("BuildingMap" + i.toString(), "https://raw.githubusercontent.com/olivierodo/restqa-progress/master/assets/maps/kubecity/inside/BuildingMap" + i.toString() + ".json");
        }
    }

    loadFurnitures()
    {
        //this.load.setPath("./assets/Furnitures");
        this.load.image("bed", "http://localhost:5000/assets/Furnitures/bed.png");
        this.load.image("cupboard", "http://localhost:5000/assets/Furnitures/cupboard.png");
        this.load.image("table", "http://localhost:5000/assets/Furnitures/table.png");
    }

    loadCharacters()
    {
        //this.load.setPath("./assets/Characters");
        this.load.spritesheet("player", "http://localhost:5000/assets/Characters/Player.png", { frameWidth: 68, frameHeight: 72 });
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
