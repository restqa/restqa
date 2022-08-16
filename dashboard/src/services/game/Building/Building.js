import Phaser from 'phaser';
export class Building extends Phaser.Physics.Arcade.Sprite
{
    doorStartX = 0;
    doorEndX  = 0;

    insideData;

    constructor(scene, x, y, texture, frame)
    {
        super(scene, x, y, texture, frame);
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    init(key)
    {
        this.setTexture(key);

        // For some reason, the physical body and the visual body don't match with tile so I have to make sure the visual has the right size.
        // 32 is the size of a tile from Tiled.
        this.displayWidth = 32 * this.scaleX;
        this.displayHeight = 32 * this.scaleY;

        //this.drawDebugDoor();
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    update(...args)
    {
        super.update(args);
    }

    /** Whether the x position match the door (ie is between doorStartX and doorEndX) */
    isOnTheDoor(x)
    {
        return ((x < this.x - this.width + this.doorEndX) && (x > this.x - this.width + this.doorStartX));
    }

    /** Draw the door that can be triggered by the player */
    drawDebugDoor()
    {
        const debugDoor = this.scene.add.graphics();
        debugDoor.fillStyle(0xFF0000);
        debugDoor.fillRect(this.x - this.width + this.doorStartX, this.y + this.height, this.doorEndX - this.doorStartX, 10);
    }
}
