import Phaser from 'phaser';
export class Furniture extends Phaser.Physics.Arcade.Sprite
{
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
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    update(...args)
    {
        super.update(args);
    }
}
