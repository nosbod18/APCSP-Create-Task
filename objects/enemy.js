import * as Utils from "./utilities.js"
import * as Main from "../main.js"
import * as Spells from "./spells.js"


export class Enemy extends Utils.Rectangle {
    constructor(x, y, w, h) {
        super(x, y, w, h)

        this.speed = 4;
        this.facing = -1;

        this.hp = 10;
        this.maxHp = 10;
    }
    
    update(f) {
        this.distanceFromPlayer = Utils.distance(this.x, this.y, Main.player.x, Main.player.y)

        this.target = {
            x: Main.player.x,
            y: Main.player.y
        };
        // Normalizes the vectors of the fireball's x and y velocity then sets its speed
        var length = Utils.distance(this.x, this.y, this.target.x, this.target.y);
        this.dx = ((this.target.x - this.x) / length) * this.speed;
        this.dy = ((this.target.y - this.y) / length) * this.speed; 
        
        this.dx *= f; // update friction
        this.dy *= f;
    
        this.oldB = this.b; // sets old position to the current position
        this.oldX = this.x;
        this.oldR = this.r;
        this.oldY = this.y;
        this.oldDy = this.dy;
        this.oldDx = this.dx
    
        this.x += this.dx; // adds velocity to the position
        this.y += this.dy;
        this.r = this.x + this.w;
        this.b = this.y + this.h;

        // if the enemy is dead, remove it from the array
        if (this.hp <= 0) {
            var targetIndex = Utils.getIndexOf(Main.enemyArray, this);

            Main.enemyArray[targetIndex.i].splice(targetIndex.j, 1)
        }
    }
}

export class Necromancer extends Enemy {
    constructor(x, y, w, h) {
        super(x, y, w, h);

        this.speed = 3

        this.hp = 15;
        this.maxHp = 15;
    }

    shoot() {
        Main.fireballArray[1].push(new Spells.Fireball(Utils.center(this).x, Utils.center(this).y, 8, Utils.center(Main.player).x, Utils.center(Main.player).y));
        
    }

    summon() {
        for (var i = 0; i < 2; i++) {
            var x = Utils.getRandomNumber(Utils.center(this).x - 128, Utils.center(this).x + 128);
            var y = Utils.getRandomNumber(Utils.center(this).y - 128, Utils.center(this).y + 128);
    
            Main.enemyArray[2].push(new Skeleton(x, y, 32, 32));
        }
    }

}

export class Skeleton extends Enemy {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        
        this.speed = this.speed * 1.75;

        this.hp = 5;
        this.maxHp = 5;
    }
}