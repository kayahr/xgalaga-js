/**
 * $Id$
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the xgalaga.Aliens class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs new aliens.
 *
 * @param {HTMLElement} container
 *            The HTML container element
 * @constructor
 * @class The aliens
 */

xgalaga.Aliens = function(container)
{
    var aliens, i;

    this.container = container;
    aliens = this.aliens = [];
    for (i = 0; i < xgalaga.MAX_ALIENS; i++)
        aliens.push(new xgalaga.Alien(container, i));
};

/** The container HTML element. @private @type {HTMLElement} */
xgalaga.Aliens.prototype.container = null;

/** The aliens. @private @type {Array} */
xgalaga.Aliens.prototype.aliens = null;

/** TODO Find out what it does. @private @type {Number} */
xgalaga.Aliens.prototype.convoyX = null;

/** TODO Find out what it does. @private @type {Number} */
xgalaga.Aliens.prototype.convoyMove = null;

/** The maximum number of attacking aliens. @private @type {Number} */
xgalaga.Aliens.prototype.maxAttacking = null;

/** The current number of attacking aliens. @private @type {Number} */
xgalaga.Aliens.prototype.attacking = null;

/** The maximum number of torpedos. @private @type {Number} */
xgalaga.Aliens.prototype.maxTorps = null;

/** The current number of torpedos. @private @type {Number} */
xgalaga.Aliens.prototype.numTorps = null;

/** The number of alive aliens. @private @type {Number} */
xgalaga.Aliens.prototype.liveCount = 0;

/**
 * Initializes the aliens for the specified level.
 *
 * @param {Number} levelNo
 *            The level number
 */

xgalaga.Aliens.prototype.init = function(levelNo)
{
    var levels, level, maxLevels, realLevelNo, metaLevel, aliens, i;

    this.convoyX = 0;
    this.convoyMove = 1;
    this.maxAttacking = Math.min(30, 1 + (level * 2));
    this.attacking = 0;
    this.maxTorps = 10 + (level * 5);
    this.numTorps = 0;

    levels = xgalaga.LEVELS;

    // TODO this.deleteTorps();

    // Calculate the real level number and the meta level number
    maxLevels = levels.length;
    realLevelNo = ((levelNo - 1) % maxLevels) + 1;
    metaLevel = parseInt((levelNo - 1) / maxLevels) + 1;

    // Get the level data
    level = levels[realLevelNo - 1];

    // Reset the aliens
    aliens = this.aliens;
    for (i = 0; i < xgalaga.MAX_ALIENS; i++)
        aliens[i].reset(level, metaLevel);
    this.liveCount = xgalaga.MAX_ALIENS;

    // TODO Create torps
};


/**
 * Updates the aliens.
 *
 * @param {Number} levelNo
 *
 *
 */

xgalaga.Aliens.prototype.update = function(levelNo)
{
    var container, winWidth, winHeight, i, alien, moves, j, lastDir,
        levels, maxLevels, realLevelNo, level, metaLevel, dir;

    container = this.container;
    winWidth = container.offsetWidth;
    winHeight = container.offsetHeight;
    moves = xgalaga.MOVES;

    // Calculate the real level number and the meta level number
    levels = xgalaga.LEVELS;
    maxLevels = levels.length;
    realLevelNo = ((levelNo - 1) % maxLevels) + 1;
    metaLevel = parseInt((levelNo - 1) / maxLevels) + 1;
    level = levels[realLevelNo - 1];

    this.convoyX += this.convoyMove;
    if (this.convoyX <= 0)
    {
        this.convoyX = 0;
        this.convoyMove = -this.convoyMove;
    }
    else if (this.convoyX >= (winWidth - 180))
    {
        this.convoyX = winWidth - 180;
        this.convoyMove = -this.convoyMove;
    }

    this.liveCount = 0;
    this.attacking = 0;
    this.entering = 0;
    for (i = 0; i < xgalaga.MAX_ALIENS; i++)
    {
        alien = this.aliens[i];
        if (alien.isAlive())
        {
            this.liveCount++;
            if (alien.getDirection() >= 0 && alien.getEscorting() < 0 &&
                    !alien.isEntering())
                this.attacking++;
            if (alien.isEntering())
                this.entering++;
        }
    }

    for (i = 0; i < xgalaga.MAX_ALIENS; i++)
    {
        alien = this.aliens[i];
        if (alien.isAlive())
        {
            if (alien.getEscorting() >= 0) this.doEscort(i);

            if (alien.isEntering())
                this.doEnter(i, level, metaLevel);
            else if (alien.getDirection() == -1)
                this.doConvoy(i);
            else if (alien.getDirection() == -2)
            {
                alien.move(this.convoyMove, 2);
                if (alien.getY() >= 20 + (20*(i/10)))
                {
                    alien.setY(20 + (20*(i/10)));
                    alien.setDirection(-1);
                }
            }
            else
            {
                dir = alien.getDirection();
                alien.move(moves[dir][0], moves[dir][1]);
                if (alien.getX() > winWidth + 20)
                    alien.setX(-20);
                else if (alien.getX() < -20)
                    alien.setX(winWidth + 20);

                if (alien.getY() > winHeight)
                {
                    alien.moveTo(20 * (i - 10 * (i / 10)) + this.convoyX +
                        this.convoyMove, -30);
                    alien.setDirection(-2);
                    alien.setPath(-1);
                    alien.setSteer(2);
                    alien.setEscorting(-1);
                    this.attacking--;
                    if(i < 10)
                    {
                        for (j = i + 9; j < i + 12; j++)
                            this.aliens[j].setEscorting(-1);
                    }
                }
                else if (alien.getY() < 0)
                {
                    alien.setDirection(xgalaga.DIR_S);
                }

                if (alien.getEscorting() < 0)
                {
                    alien.decreaseSteer();
                    if (alien.getSteer() <= 0)
                    {
                        if (alien.getPath() >= 0)
                        {
                            lastDir = alien.getDirection();
                            alien.nextPath(level);

                            if (alien.getDirection() < 0)
                            {
                                this.alien.setDirection(lastDir);

/* TODO
                            newpath:
                                switch(random()%8) {
                                case 0:
                                    start_path(P_LOOP, &aliens[i]);
                                    break;
                                case 1:
                                    start_path(P_SWOOP1, &aliens[i]);
                                    break;
                                case 2:
                                    start_path(P_SWOOP2, &aliens[i]);
                                    break;
                                case 3:
                                    start_path(P_ZIGZAG, &aliens[i]);
                                    break;
                                case 4:
                                    start_path(P_LOOP2, &aliens[i]);
                                    break;
                                case 5:
                                    start_path(P_SPIN, &aliens[i]);
                                    break;
                                case 6:
                                    start_path(P_LEFTDIAG, &aliens[i]);
                                    break;
                                case 7:
                                    start_path(P_RIGHTDIAG, &aliens[i]);
                                    break;
                                default:
                                    aliens[i].steer = TURNSPEED;
                                    aliens[i].path = -1;
                                }
                                if((aliens[i].path < 0) || (aliens[i].steer < 0)) {
                                    goto newpath;
                                }
                            */
                            }

                        }
                        else
                        {
                            if (parseInt(Math.random() * 2))
                                alien.rotateRight();
                            else
                                alien.rotateLeft();
                            alien.setSteer(xgalaga.TURN_SPEED);
                        }
                    }
                }

                /* TODO
                tc = TORPCHANCE - level/2 - weapon*5;
                if(tc < 35) tc = 35;

                if(numetorps < maxetorps && (!(random()%tc))) {
                    int xs, ys;

                    // could aim better, not sure it should!

                    if(aliens[i].x > plx + 200) {
                        xs = -3;
                    } else if(aliens[i].x > plx + 100) {
                        xs = -2;
                    } else if(aliens[i].x < plx - 200) {
                        xs = 3;
                    } else if(aliens[i].x < plx - 100) {
                        xs = 2;
                    } else {
                        xs = 0;
                    }
                    ys = (ETORPSPEED+level/5) - ABS(xs);
                    new_etorp(aliens[i].x, aliens[i].y, xs, ys);
                }
                */
            }

            alien.draw();
        }
    }


    if (this.liveCount == 0)
    {
        ENDE;

    /* TODO
        this.starField.changeSpeed(1);
        speed = this.starField.getSpeed();
        // TODO if (speed == 2) play_sound(SND_WARP);
        if (speed >= 120)
        {
            this.starField.changeSpeed(-20);
        }
        else if (speed == 1)
        {
            alert("TODO hyperspace end");
            init_aliens(++level);
            gotlemon = 0;
            starspeed = 1;
            numtorps=0;
        }
        */
    }
};


/**
 * Performs entering action for specified alien.
 *
 * @param {Number} alienId
 *            The alien ID
 * @param {xgalaga.Level} level
 *            The current level
 * @param {Number} metaLevel
 *            The meta level number
 * @private
 */

xgalaga.Aliens.prototype.doEnter = function(alienId, level, metaLevel)
{
    var alien, moves, dir, diffX, diffY;

    moves = xgalaga.MOVES;

    alien = this.aliens[alienId];
    if (alien.getEnterDelay())
    {
        alien.decreaseEnterDelay();
        return;
    }

    if (alien.getPath() >= 0)
    {
        dir = alien.getDirection();
        alien.move(moves[dir][0] + metaLevel * moves[dir][0] / 2,
            moves[dir][1] + metaLevel * moves[dir][1] / 2);

        alien.decreaseSteer();
        if (alien.getSteer() <= 0)
        {
            alien.nextEnterPath(level);

            if (metaLevel > 1)
                alien.setSteer(alien.getSteer() / (1 + ((metaLevel - 1) * 0.5)));

            if (alien.getDirection() < 0)
            {
                alien.setPath(-1);
            }
        }

        /* TODO
        tc = TORPCHANCE - level/2 - weapon*5;
        if(tc < 35) tc = 35;
        if(numetorps < maxetorps && (!(random()%tc))) {
            int xs, ys;

            // could aim better, not sure it should!

            if(aliens[i].x > plx + 200) {
                xs = -3;
            } else if(aliens[i].x > plx + 100) {
                xs = -2;
            } else if(aliens[i].x < plx - 200) {
                xs = 3;
            } else if(aliens[i].x < plx - 100) {
                xs = 2;
            } else {
                xs = 0;
            }
            ys = (ETORPSPEED+level/5) - ABS(xs);
            new_etorp(aliens[i].x, aliens[i].y, xs, ys);
        }
        */
    }
    else
    {
        diffX = Math.abs(this.getConvoyXPos(alienId) - alien.getX());
        diffY = Math.abs(this.getConvoyYPos(alienId) - alien.getY());
        if (diffY < 4 + (metaLevel * 2))
        {
            alien.setY(this.getConvoyYPos(alienId));
            if (diffX < 4 + (metaLevel * 2))
            {
                alien.setX(this.getConvoyXPos(alienId));
                alien.setDirection(-1);
                alien.setEntering(false);
                return;
            }

            alien.setDirection(0);
            if (this.getConvoyXPos(alienId) > alien.getX())
                alien.setDirection(xgalaga.DIR_E);
            else
                alien.setDirection(xgalaga.DIR_W);
        }
        else
        {
            if (this.getConvoyYPos(alienId) < alien.getY())
            {
                if (diffX < 4 + (metaLevel * 2))
                {
                    alien.setX(this.getConvoyXPos(alienId));
                    alien.setDirection(xgalaga.DIR_N);
                }
                else
                {
                    if (this.getConvoyXPos(alienId) > alien.getX())
                        alien.setDirection(xgalaga.DIR_NE);
                    else
                        alien.setDirection(xgalaga.DIR_NW);
                }
            }
            else
            {
                if (diffX < 4 + (metaLevel * 2))
                {
                    alien.setX(this.getConvoyXPos(alienId));
                    alien.setDirection(xgalaga.DIR_S);
                }
                else
                {
                    if (this.getConvoyXPos(alienId) > alian.getX())
                        alien.setDirection(xgalaga.DIR_SE);
                    else
                        alien.setDirection(xgalaga.DIR_SW);
                }
            }
        }
        dir = alien.getDirection();
        alien.move(moves[dir][0] + metaLevel * moves[dir][0] / 2,
            moves[dir][1] + metaLevel * moves[dir][1] / 2);
    }
};


/**
 * Performs convoy action.
 *
 * @private
 */

xgalaga.Aliens.prototype.doConvoy = function(alienId)
{
    var alien;

    alien = this.aliens[alienId];
    alien.moveX(this.convoyMove);
    /*
    if (!this.entering && this.attacking < this.maxAttacking &&
        (this.liveCount< this.maxAttacking ||

    if((entering == 0) &&
       (attacking < maxattacking) &&
       ((livecount < maxattacking) ||
        ((random()%10000) < (level + 2 *(48-(livecount)))))) {
        switch(random()%2) {
        case 0:
            path_dir(P_PEELLEFT, 0, &aliens[i].dir, &aliens[i].steer);
            aliens[i].path = P_PEELLEFT;
            break;
        case 1:
            path_dir(P_PEELRIGHT, 0, &aliens[i].dir, &aliens[i].steer);
            aliens[i].path = P_PEELRIGHT;
            break;
        }
        aliens[i].path_pos = 0;
        attacking++;
        if(i<10) { // Flagship, grab escorts
            int e;
            for(e=i+9;e<i+12;e++) {
                if(aliens[e].alive && aliens[e].dir == -1) {
                    aliens[e].escorting = i;
                }
            }
        }
    }
    */
};


/**
 * Returns the X position of the specified alien when in the convoy.
 *
 * @param {Number} alienId
 *            The ID of the alien
 * @return {Number} The X position in the convoy
 * @private
 */

xgalaga.Aliens.prototype.getConvoyXPos = function(alienId)
{
    return this.convoyX + (20 * (alienId - 10 * parseInt(alienId / 10)));
};


/**
 * Returns the Y position of the specified alien when in the convoy.
 *
 * @param {Number} alienId
 *            The ID of the alien
 * @return {Number} The Y position in the convoy
 * @private
 */

xgalaga.Aliens.prototype.getConvoyYPos = function(alienId)
{
    return 20 + (20 * parseInt(alienId / 10));
};
