import * as Main from "./main.js"


// Idle functions move the object up and down
// Hurt functions make the object flash red when hit with a fireball

////////////////////////////////////////// Player functions //////////////////////////////////////////
export function playerIdle() {
    if (Main.srcImageCoords.player.delay == 20) {
        Main.srcImageCoords.player.frameX += Main.player.w;

    }
    if (Main.srcImageCoords.player.delay == 40) {
        Main.srcImageCoords.player.frameX = 0;
        Main.srcImageCoords.player.delay = 0;

    }
    else {
        Main.srcImageCoords.player.delay++;
    }

}

// flash red when hit with fireball
export function playerHurt() {
    if (Main.player.facing == -1) {
        Main.srcImageCoords.player.frameX = Main.player.w * 2
        Main.srcImageCoords.player.frameY = Main.player.w

    } else if (Main.player.facing == 1) {
        Main.srcImageCoords.player.frameX = Main.player.w * 2

    }
}

////////////////////////////////////////// Ghost functions //////////////////////////////////////////

export function ghostIdle() {
    if (Main.srcImageCoords.ghost.delay == 20) {
        Main.srcImageCoords.ghost.frameX += Main.player.w;
    }
    if (Main.srcImageCoords.ghost.delay == 40) {
        Main.srcImageCoords.ghost.frameX = 0;
        Main.srcImageCoords.ghost.frameY = 0;
        Main.srcImageCoords.ghost.delay = 0;
    }
    else {
        Main.srcImageCoords.ghost.delay++;
    }
}

export function ghostHurt(ghost) {
    if (ghost.facing == -1) {
        Main.srcImageCoords.ghost.frameX = Main.player.w * 2
        Main.srcImageCoords.ghost.frameY = Main.player.w

    } else if (ghost.facing == 1) {
        Main.srcImageCoords.ghost.frameX = Main.player.w * 2

    }
}

////////////////////////////////////////// Necromancer functions //////////////////////////////////////////

export function necromancerIdle() {
    if (Main.srcImageCoords.necromancer.delay == 20) {
        Main.srcImageCoords.necromancer.frameX += Main.player.w;
    }
    if (Main.srcImageCoords.necromancer.delay == 40) {
        Main.srcImageCoords.necromancer.frameX = 0;
        Main.srcImageCoords.necromancer.delay = 0;
    }
    else {
        Main.srcImageCoords.necromancer.delay++;
    }
}

export function necromancerHurt(necromancer) {
    if (necromancer.facing == -1) {
        Main.srcImageCoords.necromancer.frameX = Main.player.w * 2
        Main.srcImageCoords.necromancer.frameY = Main.player.w

    } else if (necromancer.facing == 1) {
        Main.srcImageCoords.necromancer.frameX = Main.player.w * 2

    }
}

////////////////////////////////////////// Skeleton functions //////////////////////////////////////////

export function skeletonIdle() {
    if (Main.srcImageCoords.skeleton.delay == 20) {
        Main.srcImageCoords.skeleton.frameX += Main.player.w;
    }
    if (Main.srcImageCoords.skeleton.delay == 40) {
        Main.srcImageCoords.skeleton.frameX = 0;
        Main.srcImageCoords.skeleton.delay = 0;
    }
    else {
        Main.srcImageCoords.skeleton.delay++;
    }
}

export function skeletonHurt(skeleton) {
    if (skeleton.facing == -1) {
        Main.srcImageCoords.skeleton.frameX = Main.player.w * 2
        Main.srcImageCoords.skeleton.frameY = Main.player.w

    } else if (skeleton.facing == 1) {
        Main.srcImageCoords.skeleton.frameX = Main.player.w * 2

    }
}