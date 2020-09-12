import * as Player from "./objects/player.js";
import * as Enemy from "./objects/enemy.js";
import * as Utils from "./objects/utilities.js";
import * as Spells from "./objects/spells.js";
import * as Animation from "./animation.js";
import * as FirstAid from "./objects/firstAid.js";

/////////////////
/// VARIABLES ///
/////////////////

export var canvas = document.querySelector("#canvas");
export var ctx = canvas.getContext("2d");

var bolt = null;
var friction = 0.8;
var enemyShootDelay = 0;
var enemySummonDelay = 0;
var gameOver = false;   
export var playerHealth = document.getElementById("healthbar");
export var lightningBarValue = document.getElementById("lightningBar");

export var spriteSheets = {
    player: new Image(),
    ghost: new Image(),
    necromancer: new Image(),
    skeleton: new Image(),
    firstAidKit: new Image()
}
spriteSheets.player.src = "art/Wizard.png";
spriteSheets.ghost.src = "art/Dark_ghost.png";
spriteSheets.necromancer.src = "art/Necromancer.png";
spriteSheets.skeleton.src = "art/Skeleton.png";
spriteSheets.firstAidKit.src = "art/First_aid_kit.png"

export var srcImageCoords = {
    player: {
        frameX: 0,
        frameY: 0,
        delay: 0,
        scale: 1.5
    },
    ghost: {
        frameX: 0,
        frameY: 0,
        delay: 0,
        scale: 1.5
    },
    necromancer : {
        frameX: 0,
        frameY: 0,
        delay: 0,
        scale: 1.5
    },
    skeleton: {
        frameX: 0,
        frameY: 0,
        delay: 0,
        scale: 1.5
    },
    firstAidKit: {
        frameX: 0,
        frameY: 0,
        scale: 0.75
    }
}

export  var wave = 0;


export var fireballArray = [ [], [] ]; // fireballArray[0] = player fireballs, fireballArray[1] = necromancer fireballs
export var enemyArray = [ [], [], [] ]; // enemyArray[0] = ghosts, enemyArray[1] = necromancers, enemyArray[2] = skeletons
export var firstAidKitArray = [new FirstAid.FirstAidKit(-16, 0, 24, 16)];


export const player = new Player.Player(300, 450, 32, 32);

/////////////////
/// FUNCTIONS ///
/////////////////

// finds a random index in the necromancer sub array
function getRandomEnemy() {   
    if(enemyArray[1].length === 0){
        return;
    }
    var randomInner = Math.floor(Math.random() * enemyArray[1].length);

    for (var i = 0; i < enemyArray[1].length; i++) {
        if (i === randomInner) {

            return {
                x: enemyArray[1][i].x,
                y: enemyArray[1][i].y
            }
        }
    }
}

// collision detection
function checkCollisions() {
    Utils.outOfArena(player);
    firstAidKitArray[0].collision(player);

    for (var i = 0; i < fireballArray.length; i++) {
        for (var j = 0; j < fireballArray[i].length; j++) {
            fireballArray[i][j].offScreen();
        }
    }

    for (var i = 0; i < fireballArray[1].length; i++) {
        fireballArray[1][i].spellCollision(player)
    }
    
    // only fire if there is at least one enemy in the enemy array
    if (enemyArray[0].length > 0 || enemyArray[1].length > 0 || enemyArray[2].length > 0) {

        for (var i = 0; i < enemyArray.length; i++) {
            for (var j = 0; j < enemyArray[i].length; j++) {
                Utils.collision(player, enemyArray[i][j]);
                Utils.outOfArena(canvas, enemyArray[i][j]);
    
                for (var x = 0; x < fireballArray[0].length; x++) {
                    // if the enemy array is empty dont call spellCollision
                    if (enemyArray[0].length == 0 && enemyArray[1].length == 0 && enemyArray[2].length == 0) {
                        break;
                    }
    
                    fireballArray[0][x].spellCollision(enemyArray[i][j])
                }
            }
        }
    }
}

function render() {
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // draws the player
    ctx.drawImage(spriteSheets.player, srcImageCoords.player.frameX, srcImageCoords.player.frameY, player.w, player.h, player.x, player.y, player.w * srcImageCoords.player.scale, player.h * srcImageCoords.player.scale);
    
    //draws the first aid kit
    ctx.drawImage(spriteSheets.firstAidKit, firstAidKitArray[0].x, firstAidKitArray[0].y, 16, 12)

    // draws each of the enemies currently in the array based on where they are in relation to the player
    for (var i = 0; i < enemyArray.length; i++) {
        for (var j = 0; j < enemyArray[i].length; j++) {
            if (i == 0 && player.x > enemyArray[i][j].x) {

                enemyArray[i][j].facing = 1
                ctx.drawImage(spriteSheets.ghost, srcImageCoords.ghost.frameX, srcImageCoords.ghost.frameY, enemyArray[i][j].w, enemyArray[i][j].h, enemyArray[i][j].x, enemyArray[i][j].y, enemyArray[i][j].w * srcImageCoords.ghost.scale, enemyArray[i][j].h * srcImageCoords.ghost.scale);
            
            } else if (i == 0 && player.x < enemyArray[i][j].x) {

                enemyArray[i][j].facing = -1
                ctx.drawImage(spriteSheets.ghost, srcImageCoords.ghost.frameX, srcImageCoords.ghost.frameY + 32, enemyArray[i][j].w, enemyArray[i][j].h, enemyArray[i][j].x, enemyArray[i][j].y, enemyArray[i][j].w * srcImageCoords.ghost.scale, enemyArray[i][j].h * srcImageCoords.ghost.scale);
            
            } else if (i == 1 && player.x > enemyArray[i][j].x) {

                enemyArray[i][j].facing = 1
                ctx.drawImage(spriteSheets.necromancer, srcImageCoords.necromancer.frameX, srcImageCoords.necromancer.frameY, enemyArray[i][j].w, enemyArray[i][j].h, enemyArray[i][j].x, enemyArray[i][j].y, enemyArray[i][j].w * srcImageCoords.necromancer.scale, enemyArray[i][j].h * srcImageCoords.necromancer.scale);
            
            } else if (i == 1 && player.x < enemyArray[i][j].x) {

                enemyArray[i][j].facing = -1
                ctx.drawImage(spriteSheets.necromancer, srcImageCoords.necromancer.frameX, srcImageCoords.necromancer.frameY + 32, enemyArray[i][j].w, enemyArray[i][j].h, enemyArray[i][j].x, enemyArray[i][j].y, enemyArray[i][j].w * srcImageCoords.necromancer.scale, enemyArray[i][j].h * srcImageCoords.necromancer.scale);
            
            } else if (i == 2 && player.x > enemyArray[i][j].x) {

                enemyArray[i][j].facing = 1
                ctx.drawImage(spriteSheets.skeleton, srcImageCoords.skeleton.frameX, srcImageCoords.skeleton.frameY, enemyArray[i][j].w, enemyArray[i][j].h, enemyArray[i][j].x, enemyArray[i][j].y, enemyArray[i][j].w * srcImageCoords.skeleton.scale, enemyArray[i][j].h * srcImageCoords.skeleton.scale);
            
            } else if (i == 2 && player.x < enemyArray[i][j].x) {

                enemyArray[i][j].facing = -1
                ctx.drawImage(spriteSheets.skeleton, srcImageCoords.skeleton.frameX, srcImageCoords.skeleton.frameY + 32, enemyArray[i][j].w, enemyArray[i][j].h, enemyArray[i][j].x, enemyArray[i][j].y, enemyArray[i][j].w * srcImageCoords.skeleton.scale, enemyArray[i][j].h * srcImageCoords.skeleton.scale);
            }
        }
    }

    // draws all the fireballs currently in the array
    for (var i = 0; i < fireballArray.length; i++) {
        for (var j = 0; j < fireballArray[i].length; j++) {
            ctx.beginPath();
            // if the fireball is a player fireball draw it orange, if its a necromancer fireball draw it green
            if (i == 0) {
                ctx.fillStyle = "orange";
            } else if (i == 1) {
                ctx.fillStyle = "green"
            } 
            ctx.arc(fireballArray[i][j].x, fireballArray[i][j].y, fireballArray[i][j].radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    if (bolt != null) {
        bolt.drawMain();
        bolt.drawBranches();

    }
    
}

function animate() {
    if (!gameOver) {
        Animation.playerIdle();
        Animation.ghostIdle();
        Animation.necromancerIdle();
        Animation.skeletonIdle();

    }
}

function enemyShootAndSummon() {  
    // makes the necromancers shoot once per second      
    if (enemyShootDelay === 60) {
        for (var i = 0; i < enemyArray[1].length; i++) {
            enemyArray[1][i].shoot();
        }
        enemyShootDelay = 0;

    } else {
        enemyShootDelay++;
    }

    // necromancers summon skeletons once every 2 seconds
    if (enemySummonDelay === 120) {
        for (var i = 0; i < enemyArray[1].length; i++) {
            enemyArray[1][i].summon();
        }
        enemySummonDelay = 0;

    } else {
        enemySummonDelay++;
    }
}

function update() {
    player.update(friction);
    player.movement();

    for (var i = 0; i < enemyArray.length; i++) {
        for (var j = 0; j < enemyArray[i].length; j++) {
            enemyArray[i][j].update(friction);

        }
    }

    for (var i = 0; i < fireballArray.length; i++) {
        for (var j = 0; j < fireballArray[i].length; j++) {
            fireballArray[i][j].update();
        }
    }

    // checks to see if the round was won
    if (enemyArray[0].length == 0 && enemyArray[1].length == 0 && enemyArray[2].length == 0 && playerHealth.value > 0) {
        
        randomEnemySpawn();

    // otherwise end the game
    } else if (playerHealth.value <= 0) {
        gameOver = true;

        document.getElementById("waveCount").innerHTML = "You survived " + wave + " rounds.";
        document.getElementById("restartButton").style.visibility = "visible";
    }

    if (bolt != null) {
        bolt.update();

    }

    if (lightningBarValue.value < 100) {
        lightningBarValue.value += 0.5;

    }else if (lightningBarValue.value === 100) {
        player.canFireLightning = true;
    }

    if (Spells.spellController.fireball === true) {
        document.getElementById("currentSpell").innerHTML = "Current Spell: Fireball"

    } else if (Spells.spellController.fireball === false) {
        document.getElementById("currentSpell").innerHTML = "Current Spell: Lightning"
    }

    if (firstAidKitArray.length > 0) {
        firstAidKitArray[0].spawn();
    }

}

// Controls the random spawning of enemies at the start of each round
function randomEnemySpawn() {
    document.getElementById("waveCount").innerHTML = "Wave: " + (wave + 1);
    enemyShootDelay = 0;
    enemySummonDelay = 0;

    // allows the player to instantly fire the lightning at the start of each round
    lightningBarValue.value = 100

    for (var i = 0; i <= wave; i++) {
        enemyArray[0].push(new Enemy.Enemy(Utils.getRandomCoord().x, Utils.getRandomCoord().y, 32, 32))
    }

    for (var i = 2; i <= wave; i++) {
        enemyArray[1].push(new Enemy.Necromancer(Utils.getRandomCoord().x, Utils.getRandomCoord().y, 32, 32));
    }
    
    wave++;
}

// Game loop
function loop() {

    if (!gameOver) {
        checkCollisions();
        update();
        enemyShootAndSummon();
        render();
        animate();

    }
    
    requestAnimationFrame(loop)
}

function init() {
    wave = 0;

    // removes all elements from the fireball and enemy arrays at the start of the game
    fireballArray[0].splice(0, fireballArray[0].length);
    fireballArray[1].splice(0, fireballArray[1].length);
    
    enemyArray[0].splice(0, enemyArray[0].length);
    enemyArray[1].splice(0, enemyArray[1].length);
    enemyArray[2].splice(0, enemyArray[2].length);

    randomEnemySpawn();

    loop();
}

init();

// Makes the player look towards the mouse
window.addEventListener("mousemove", e => {
    if (e.x < player.x) {
        srcImageCoords.player.frameY = player.w 
        player.facing = -1
    } else {
        srcImageCoords.player.frameY = 0;
        player.facing = 1;
    }
});

// Creates a new fireball or new lightning on a mouse click, depending on which spell the player currently has selected
window.addEventListener("mousedown", e => {
    // also checks if theres more than 2 fireballs in the array. If so, dont create a new fireball
    if (Spells.spellController.fireball === true && fireballArray[0].length < 2) {
        fireballArray[0].push(new Spells.Fireball(Utils.center(player).x, Utils.center(player).y, 8, e.x - 8, e.y - 8));

    } else if (Spells.spellController.fireball === false && player.canFireLightning) {
        var randomEnemy = getRandomEnemy();

        // sets the source of the lightning at the player
        var source = new Victor(player.x + 32, player.y + 32);
        
        // sets the destination of the lightning to a random enemy defined by the getRandomEnemy function
        var dest = new Victor(randomEnemy.x + 16, randomEnemy.y + 32)
        bolt = new Spells.Lightning(source, dest, 2);

        // makes it so the player can't use another lightning until the lightning charge is at 100
        player.canFireLightning = false;
        
        if (bolt != null) {
            bolt.createBolt(source, dest, 8);
            bolt.createBranches();
        }
    }
});