import Phaser from 'phaser';
import { CST } from "../CST";
import { Character } from "../Characters/Character";
import { Furniture } from "../Building/Furniture";
//import { InsideData } from "../Building/Building";

export class SceneInBuilding extends Phaser.Scene
{
    // Map
    currentMaps;
     grounds;

    // Floors
    floorMaps;

    // Characters
    player;

    // Furnitures
    furnitures;

    constructor()
    {
        super({key: CST.SCENES.IN_BUILDING});
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    init(data)
    {
        this.floorMaps = data.floorMaps;
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
        this.events.on("postupdate", this.postUpdate, this);

        this.createMap();
        this.createFurnitures();
        this.createPlayer();
        this.createInteractions();
        this.createCameras();
    }

    createMap()
    {
        this.currentMaps = [];
        this.grounds = [];

        let maxWidth = 0;
        let sumHeight = 0;

        for (let i = 0; i < this.floorMaps.length; ++i)
        {
            const currentMap = this.add.tilemap(this.floorMaps[i]);
            const terrain = currentMap.addTilesetImage("kubecity_atlas", "kubecity_atlas");
            const ground = currentMap.createLayer("Ground", [terrain], 0, 0);

            maxWidth = Math.max(maxWidth, ground.getBounds().width)
            sumHeight += ground.getBounds().height;

            ground.setY(-sumHeight); // Reset Y position because we need to know the ground height beforehand

            this.grounds.push(ground);
            this.currentMaps.push(currentMap);
        }

        this.physics.world.setBounds(0, -sumHeight, maxWidth, sumHeight);
    }

    createFurnitures()
    {
        this.furnitures = this.physics.add.staticGroup();

        const furnitureNames = ["bed", "cupboard", "table"]
        let furnitureObjectList = [];
        // Get all the furnitures provided by the tilemap
        for (let furnitureName of furnitureNames)
        {
            for (let i = 0; i < this.currentMaps.length; ++i)
            {
                // @ts-ignore - Problem with Phaser’s types. classType supports classes 
                const furnitureObjects = this.currentMaps[i].createFromObjects("Furnitures", {name: furnitureName, classType: Furniture});
                furnitureObjects.map((furniture) => {
                    furniture.init(furnitureName);
                    furnitureObjectList.push(furniture);
                    furniture.setY(furniture.y + this.grounds[i].y);
                    this.furnitures.add(furniture);
                });
            }
        }
    }

    /** Create the player getting the player tiled object from the first map */
    createPlayer()
    {
        // @ts-ignore - Problem with Phaser’s types. classType supports classes 
        const characters = this.currentMaps[0].createFromObjects("Character", {name: "Character", classType: Character});
        this.player = characters[0];
        this.player.setScale(0.8);
        this.player.lookUp();
    }

    createInteractions()
    {
        for (let ground of this.grounds)
        {
            ground.setCollisionByProperty({collides: true});
            this.physics.add.collider(this.player, ground, null, null, this);
        }

        this.physics.add.collider(this.player, this.furnitures, null, null, this);

        this.physics.world.setBoundsCollision(true, true, true, true);
        (this.player.body).setCollideWorldBounds(true, 0, 0, true);
        this.physics.world.on("worldbounds", this.onWorldBounds, this);
    }

    createCameras()
    {
        this.cameras.main.startFollow(this.player);
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

    onWorldBounds(body, blockedUp, blockedDown)
    {
        if (body === this.player.body) // player collided with world
        {
            if (this.player.isLookingDown() && blockedDown)
            {
                this.scene.remove(CST.SCENES.IN_BUILDING);
                this.scene.setVisible(true, CST.SCENES.GAME);
                this.scene.resume(CST.SCENES.GAME);
            }
        }
    }
}
