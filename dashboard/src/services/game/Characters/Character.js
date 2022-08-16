import Phaser from 'phaser';
import { CST } from "../CST";

export class DIRECTIONS
{
    static UP = "Up";
    static DOWN = "Down";
    static RIGHT = "Right";
    static LEFT = "Left";
}

export class Character extends Phaser.Physics.Arcade.Sprite
{
    keys;

    // States
    isWalking = false;
    currentDirection = DIRECTIONS.DOWN;

    // Attributes
    walkSpeed = 200;

    constructor(scene, x, y)
    {
        super(scene, x, y, "");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body;
        body.setMaxSpeed(CST.PHYSIC.CHARACTER_MAX_SPEED);
        body.allowGravity = false;

        this.setCollideWorldBounds(true);

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (anim, frame) {
            this.emit("animationcomplete_" + anim.key, anim, frame);
        }, this);

        this.on(Phaser.Animations.Events.ANIMATION_START, function (anim, frame) {
            this.emit("animationstart_" + anim.key, anim, frame);
        }, this);

        this.init();
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    init()
    {
        this.initKeys();
        this.initStates();
        this.initAnimations("player");

        return this;
    }

    initKeys()
    {
        this.keys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: "S",
            left: "A",
            right: "D"
        }, false) ;
    }

    initStates()
    {
        this.isWalking = false;
    }

    initAnimations(textureKey)
    {
        this.setTexture(textureKey);

        const directions = [DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT, DIRECTIONS.UP];

        // IDLE
        for (let i = 0; i < directions.length; ++i)
        {
            const direction = directions[i];
            
            this.anims.create({
                key: "idle" + direction,
                frames: this.anims.generateFrameNumbers(this.texture.key, { start: i * 4, end: i * 4 }),
                frameRate: 1,
                repeat: -1
            });
        }

        // WALK
        const frameRateWalk = 6;

        for (let i = 0; i < directions.length; ++i)
        {
            const direction = directions[i];
            
            this.anims.create({
                key: "walk" + direction,
                frames: this.anims.generateFrameNumbers(this.texture.key, { start: i * 4, end: i * 4 + 3 }),
                frameRate: frameRateWalk,
                repeat: -1
            });
        }

        this.anims.play("idle" + this.currentDirection);
        this.body.setSize(38, 54);
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    update(...args)
    {
        super.update(args);
        this.updateAnimations();
        this.updateControls();
    }

    /** Update the anims of this Character */
    updateAnimations()
    {
        if (this.isWalking)
        {
            this.anims.play("walk" + this.currentDirection, true);
        }
        else
        {
            this.anims.play("idle" + this.currentDirection);
        }
    }

    /** Define the way to control this Character */
    updateControls()
    { 
        let isMovingRL = this.keys.up.isDown || this.keys.down.isDown; // Moving Up Down
        let isMovingUD = this.keys.left.isDown || this.keys.right.isDown; // Moving Right Left

        if (this.keys.up.isDown)
        {
            this.walk(DIRECTIONS.UP);
        }
        else if (this.keys.down.isDown)
        {
            this.walk(DIRECTIONS.DOWN);
        }

        if (this.keys.left.isDown)
        {
            this.walk(DIRECTIONS.LEFT);
        }
        else if (this.keys.right.isDown)
        {
            this.walk(DIRECTIONS.RIGHT);
        }
 
        if (!isMovingRL && !isMovingUD)
        {
            this.stopWalking();
        }
    }

    postUpdate()
    {
    }

    walk(direction)
    {
        this.currentDirection = direction;

        if (!this.isWalking)
        {
            this.startWalking();
        }

        const speed = this.walkSpeed;
        let velocityX = 0;
        let velocityY = 0;

        switch (direction)
        {
            case DIRECTIONS.DOWN:
                velocityY = speed;
                break;

            case DIRECTIONS.UP:
                velocityY = -speed;
                break;

            case DIRECTIONS.LEFT:
                velocityX = -speed;
                break;

            case DIRECTIONS.RIGHT:
                velocityX = speed;
                break;

            default:
                break;
        }

        this.setVelocityX(velocityX);
        this.setVelocityY(velocityY);
    }

    // Walk
    ////////////////////////////////////////////////////////////////////////

    startWalking()
    {
        this.isWalking = true;
    }

    stopWalking()
    {
        if (this.isWalking)
        {
            this.setVelocity(0);
            this.isWalking = false;
        }
    }

    // Look direction
    ////////////////////////////////////////////////////////////////////////

    lookUp()
    {
        this.currentDirection = DIRECTIONS.UP;
    }

    lookDown()
    {
        this.currentDirection = DIRECTIONS.DOWN;
    }

    lookRight()
    {
        this.currentDirection = DIRECTIONS.RIGHT;
    }

    lookLeft()
    {
        this.currentDirection = DIRECTIONS.LEFT;
    }

    isLookingUp()
    {
        return this.currentDirection == DIRECTIONS.UP;
    }

    isLookingDown()
    {
        return this.currentDirection == DIRECTIONS.DOWN;
    }

    isLookingRight()
    {
        return this.currentDirection == DIRECTIONS.RIGHT;
    }

    isLookingLeft()
    {
        return this.currentDirection == DIRECTIONS.LEFT;
    }
}
