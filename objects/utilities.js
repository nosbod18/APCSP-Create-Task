import * as Main from "../main.js"


// the class that everything is based off of
export class Rectangle {
    constructor(x, y, w, h) {
        this.x = this.oldX = x; // x and old x
        this.r = this.oldR = x + w; // right and old right
        this.y = this.oldY = y; // y and old y
        this.b = this.oldB = y + h; // bottom and old bottom
        this.w = w; // width
        this.h = h; // height
        this.dx = this.oldDx = 0; // velocity x and y
        this.dy = this.oldDy = 0; 
    }

    // functions used to resolve collisions
    setTop(y) {
        this.y = y;
        this.b = y + this.h;
    }
    setBottom(b) {
        this.b = b;
        this.y = b - this.h;
    }
    setLeft(x) {
        this.x = x;
        this.r = x + this.w;
    }
    setRight(r) {
        this.r = r;
        this.x = r - this.w;
    }
}

// collision detection
export function collision(collider, collidee) { 

    if (collider.b + collider.dy < collidee.y || 
        collider.y + collider.dy > collidee.b || 
        collider.x + collider.dx > collidee.r || 
        collider.r + collider.dx < collidee.x) {
        return false;
    }

    // skeletons do half of the damage of other enemies
    if (Main.enemyArray[2].includes(collidee)) {
        Main.playerHealth.value -= 0.25;

    } else {
        Main.playerHealth.value -= 0.5;
    }

}

// keeps everything on the canvas
export function outOfArena(collider) {
    if (collider.x + collider.dx >= 0     &&
        collider.y + collider.dy >= 0     &&
        collider.r + collider.dx <= 1000  &&
        collider.b + collider.dy <= 600)   {

        return false;
    }

    if (collider.b + collider.dy >= 600) {
        collider.setBottom(600 - 0.1);
        collider.dy = 0;

    } else if (collider.y + collider.dy <= 0) {
        collider.setTop(0.1);
        collider.dy = 0;

    } else if (collider.r + collider.dx >= 1000) {
        collider.setRight(1000 - 0.1);
        collider.dx = 0;

    } else if (collider.x + collider.dx <= 0) {
        collider.setLeft(0.1);
        collider.dx = 0;

    }
}

// finds the center coordinates of the object
export function center(object) {
    return {
        x: object.x + (object.w/2),
        y: object.y + (object.h/2)
    }
}

// uses pythagoreans theorem to find the distance between 2 objects
export function distance(x, y, x1, y1) {
    return Math.sqrt(Math.pow((x1 - x), 2) + Math.pow((y1 - y), 2));
}

// gets the index of an object in a multi dimensional array
export function getIndexOf(array, item) {
    for (var outerArrayIndex = 0; outerArrayIndex < array.length; outerArrayIndex++) {
        var innerArrayIndex = array[outerArrayIndex].indexOf(item);
        if (innerArrayIndex > -1) {
            return {
                i: outerArrayIndex,
                j: innerArrayIndex
            }
        }
    }
}

export function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandomCoord() {
    var x = (Math.random() * 900) + 50;
    var y = (Math.random() * 500) + 50;

    if (Math.abs(Main.player.x - x) <= 256 || Math.abs(Main.player.y - y <= 256)) {
        x = (Math.random() * 900) + 50;
        y = (Math.random() * 500) + 50;
    }

    return {
        x: x,
        y:y
    }
}