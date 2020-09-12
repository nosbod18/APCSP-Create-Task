import * as Utils from "./utilities.js"
import * as Main from "../main.js"


// determines which key is being pressed
var playerController = {
    left: false,
    up: false,
    right: false,
    down: false,
    keyListener: function(e) {
        var keyState = (e.type == "keydown") ? true:false;

        switch(e.keyCode) {
            case 65: // A
                playerController.left = keyState;
                break;

            case 87: // W 
                playerController.up = keyState;
                break;

            case 68: // D
                playerController.right = keyState;
                break;
            
            case 83: // S
                playerController.down = keyState;
                break;
        }
    }
}


export class Player extends Utils.Rectangle {
    constructor(x, y, w, h) {
        super(x, y, w, h)

        this.dx = 0;
        this.dy = 0;
        this.isDead = false;
        this.acceleration = 1.25;

        this.facing = 1;
        this.canFireLightning = true;
    }

    // makes the player stay on the canvas
    offScreen() {
        if (this.r + this.dx >= Main.canvas.width) {
            this.setRight(Main.canvas.width - 0.1);
        } else if (this.x + this.dx <= 0) {
            this.setLeft(0.1);
        }
    }

    update(f) { 
        this.dx *= f; // friction
        this.dy *= f;
    
        this.oldB = this.b; // sets old position to the current position
        this.oldX = this.x;
        this.oldR = this.r;
        this.oldY = this.y;
        this.oldDy = this.dy;
        this.oldDx = this.dx
    
        this.x += this.dx; // adds velocity to the current position
        this.y += this.dy;
        this.r = this.x + this.w;
        this.b = this.y + this.h;
    
    }
    
    // controls player movement
    movement() {
        if(playerController.left) {
            this.dx -= this.acceleration;
        }

        if(playerController.up) {
            this.dy -= this.acceleration;
        }
        
        if(playerController.right) {
            this.dx += this.acceleration;
        }

        if (playerController.down) {
            this.dy += this.acceleration;
        }
    }
}

window.addEventListener("keydown", playerController.keyListener)
window.addEventListener("keyup", playerController.keyListener)