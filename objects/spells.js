import * as Utils from "./utilities.js"
import * as Main from "../main.js"
import * as Animation from "../animation.js"


export var spellController = {
    fireball: true,
    
    // Toggles the spell between fireball and lightning
    keyListener: function(e) {
        if (e.keyCode === 32) {
            spellController.fireball = !spellController.fireball
        }
    }
}

export class Fireball {
    constructor(x, y, radius, x1, y1) {
        this.x = x;
        this.y = y;

        this.radius = radius;
        this.target = {
            x: x1,
            y: y1
        }

        this.speed = 8.5;
        // Normalizes the vectors of the fireball's x and y velocity then sets its speed
        var length = Utils.distance(this.x, this.y, this.target.x, this.target.y);
        this.dx = ((this.target.x - this.x) / length) * this.speed;
        this.dy = ((this.target.y - this.y) / length) * this.speed;

    }

    // Collision detection for the fireballs
    spellCollision(target) {

        var distX = Math.abs(this.x - (target.x + target.w/2));
        var distY = Math.abs(this.y - (target.y + target.h/2));

        if (distX > (target.w/2 + this.radius)*2 || distY > (target.h/2 + this.radius)*2) {
            return;
        }

        var spellIndex = Main.fireballArray[0].indexOf(this)
        Main.fireballArray[0].splice(spellIndex, 1)
           
        // if the fireball is a necromancer fireball, do 10 damage to the player
        if (Main.fireballArray[1].includes(this)) {
            var necroFireballIndex = Main.fireballArray[1].indexOf(this)
            Main.fireballArray[1].splice(necroFireballIndex, 1)
    
            Animation.playerHurt();
            Main.playerHealth.value -= 10;
            return
        }

        target.hp -= 5;
        
    }

    // Removes the fireballs that go off screen
    offScreen() {
        var spellIndex = Utils.getIndexOf(Main.fireballArray, this) 

        if (this.x + this.radius > 1000    || 
            this.x + this.radius < 0       ||
            this.y + this.radius < 0       ||
            this.y + this.radius > 600)     {

            Main.fireballArray[spellIndex.i].splice(spellIndex.j, 1)
        }
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }
}

export class Lightning {
    constructor(source, dest, thickness) {
        this.source = source;
        this.dest = dest;
        this.thickness = thickness;

        // Small segments of lightning that connect the positions array points
        this.results = [];
        // Randomly chosen points that make up the lightning
        this.positions = [];
        // Array that holds the branch that comes off the main lightning
        this.branches = [];

        this.alphaFadeOutValue = 1;
    }

    createBolt(source, dest, thickness) {
        Main.lightningBarValue.value = "0";
        var tangent = dest.subtract(source)
        var normal = new Victor(tangent.y, -tangent.x).normalize();
        var length = tangent.length();

        this.positions.push(0);

        // picks random points and sorts them numerically in the positions array
        for (var i = 0; i < length / 2; i++) {
            this.positions.push(Math.random());
        }
        this.positions.sort(function(a, b) { return a - b });

        var sway = 80;
        var jaggedness = 1 / sway;

        var prevPoint = new Victor(source.x, source.y);
        var prevDisplacement = 0;
        for (var i = 0; i < this.positions.length; i++) {
            // sets the current position to the current index of a point in the positions array
            var currPos = this.positions[i];

            var scale = (length * jaggedness) * (currPos - this.positions[i - 1]);
            if (isNaN(scale)) {
                scale = 0;
            }

            // the points closer to the end have to be closer to the destination coordinates
            var envelope = currPos > 0.95 ? 20 * (1 - currPos) : 1;

            // makes it so points closer to the middle can deviate more from the source 
            var displacement = (Math.random() < 0.5 ? -1 : 1) * Math.random() * sway
            displacement -= (displacement - prevDisplacement) * (1 - scale);
            displacement *= envelope;

            // vector math that picks a point for the next little section in the lightning.
            // This was the most complicated thing when trying to figure out how to port the c# tutorial to javascript
            var posTan = new Victor(currPos * tangent.x, currPos * tangent.y);
            var dispNorm = new Victor(displacement * normal.x, displacement * normal.y);
            var srcPosTang = new Victor(source.x + posTan.x, source.y + posTan.y);

            var point = new Victor(srcPosTang.x + dispNorm.x, srcPosTang.y + dispNorm.y)

            this.results.push(new Lightning(prevPoint, point, thickness));
            prevPoint = Object.assign(point);
            prevDisplacement = displacement;
        }
    }

    createBranches() {
        // I kept the random number between 1 and 2 because weird things start to happen when the number of branches goes above 2
        var numBranches = Math.floor(Utils.getRandomNumber(1, 2));
        var branchPoints = [...Array(numBranches).keys()];
    
        for (var i = 0; i < branchPoints.length; i++) {
            // picks a random line segment from the results array to start the branch
            var point = this.results[Math.floor(Math.random() * (this.results.length / 2))]
            var boltStart = new Victor(point.source.x, point.source.y);

            // loops through the necromancer sub array the number of times generated by the numBranches variable 
            // then finds the x and y values of the enemies to remove from the array
            for (var j = 0; j < Main.enemyArray[1].length; j++) {
                var endX = Main.enemyArray[1][j].x + 16;
                var endY = Main.enemyArray[1][j].y + 32;

                Main.enemyArray[1].splice(j, 1)
            }
            var boltEnd = new Victor(endX, endY);
            this.branches.push(new Lightning(boltStart, boltEnd, 8))
        }

        for (var i = 0; i < this.branches.length; i++) {
            this.branches[i].createBolt(boltStart, boltEnd, 8);
        }
    }

    // Draws the main lightning bolt
    drawMain() {
        Main.ctx.beginPath();
        Main.ctx.strokeStyle = "rgba(255, 255, 0, " + this.alphaFadeOutValue + ")";
        Main.ctx.moveTo(this.source.x, this.source.y)
        
        this.results.forEach(result => {
            Main.ctx.lineTo(result.dest.x, result.dest.y);
        });
        Main.ctx.lineWidth = 5;
        Main.ctx.stroke();
    }
    
    // Draws the lightning branch
    drawBranches(color) {
        Main.ctx.beginPath();
        Main.ctx.strokeStyle = "rgba(255, 255, 0, " + this.alphaFadeOutValue + ")";
        Main.ctx.moveTo(this.branches[0].source.x, this.branches[0].source.y);

        this.branches.forEach(branch => {
            branch.results.forEach(result => {
                Main.ctx.lineTo(result.dest.x, result.dest.y);
            })
        });

        Main.ctx.lineWidth = 5;
        Main.ctx.stroke();
    }

    // gradually fades the lightning out
    update() {
        this.alphaFadeOutValue -= 0.05
    }
}


window.addEventListener("keydown", spellController.keyListener);