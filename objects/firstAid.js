import * as Utils from "./utilities.js"
import * as Main from "../main.js"


var firstAidKitSpawnDelay = 0;

export class FirstAidKit extends Utils.Rectangle{
    constructor(x, y, w, h) {
        super(x, y, w, h)
    }

    // spawns a first aid kit at a random coordinate every 7 seconds
    spawn() {
        if (firstAidKitSpawnDelay === 420) {
            Main.firstAidKitArray.splice(0, 1);
            Main.firstAidKitArray.push(new FirstAidKit(Utils.getRandomCoord().x, Utils.getRandomCoord().y, 24, 16));
            firstAidKitSpawnDelay = 0;
        } else {
            firstAidKitSpawnDelay++;
        }
    }

    // if touching the player, increase the player's health and set the x coordinate to off screen
    collision(player) {
        if (player.b + player.dy < this.y || 
            player.y + player.dy > this.b || 
            player.x + player.dx > this.r || 
            player.r + player.dx < this.x) {
            return false;
        }

        Main.firstAidKitArray[0].x = -16;
        Main.playerHealth.value += 0.75;
    }
}