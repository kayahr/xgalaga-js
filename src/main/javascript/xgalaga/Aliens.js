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
 * @param {xgalaga.Game} game
 *            The game
 * @constructor
 * @class The aliens
 */

xgalaga.Aliens = function(game)
{
    var aliens, i;

    this.game = game;
    aliens = this.aliens = [];
    for (i = 0; i < xgalaga.MAX_ALIENS; i++)
        aliens.push(new xgalaga.Alien(game, i));

    this.torps = new xgalaga.AlienTorpedos(game);
};

/** The game. @private @type {xgalaga.Game} */
xgalaga.Aliens.prototype.game = null;

/** The aliens. @private @type {Array} */
xgalaga.Aliens.prototype.aliens = null;

/** The torpedos. @private @type {Array} */
xgalaga.Aliens.prototype.torps = null;

/** The convoy X position. @private @type {Number} */
xgalaga.Aliens.prototype.convoyX = null;

/** The convoy movement. @private @type {Number} */
xgalaga.Aliens.prototype.convoyMove = null;

/** The maximum number of attacking aliens. @private @type {Number} */
xgalaga.Aliens.prototype.maxAttacking = null;

/** The current number of attacking aliens. @private @type {Number} */
xgalaga.Aliens.prototype.attacking = null;

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
    this.maxAttacking = Math.min(30, 1 + (levelNo * 2));
    this.attacking = 0;

    levels = xgalaga.LEVELS;

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

    // Initialize the alien torpedos
    this.torps.init(levelNo);
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
    var game, winWidth, winHeight, i, alien, moves, j, lastDir,
        levels, maxLevels, realLevelNo, level, metaLevel, dir;

    game = this.game;
    winWidth = game.getWidth();
    winHeight = game.getHeight();
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
                this.doEnter(i, levelNo, level, metaLevel);
            else if (alien.getDirection() == -1)
                this.doConvoy(i, levelNo);
            else if (alien.getDirection() == -2)
            {
                alien.move(this.convoyMove, 2);
                if (alien.getY() >= 20 + (20 * parseInt(i / 10)))
                {
                    alien.setY(20 + (20 * parseInt(i / 10)));
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
                    alien.moveTo(20 * (i - 10 * parseInt(i / 10)) + this.convoyX +
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
                                alien.setDirection(lastDir);

                                do
                                {
                                    switch (parseInt(Math.random() * 8))
                                    {
                                        case 0:
                                            alien.startPath(xgalaga.P_LOOP);
                                            break;

                                        case 1:
                                            alien.startPath(xgalaga.P_SWOOP1);
                                            break;

                                        case 2:
                                            alien.startPath(xgalaga.P_SWOOP2);
                                            break;

                                        case 3:
                                            alien.startPath(xgalaga.P_ZIGZAG);
                                            break;

                                        case 4:
                                            alien.startPath(xgalaga.P_LOOP2);
                                            break;

                                        case 5:
                                            alien.startPath(xgalaga.P_SPIN);
                                            break;

                                        case 6:
                                            alien.startPath(xgalaga.P_LEFTDIAG);
                                            break;

                                        case 7:
                                            alien.startPath(xgalaga.P_RIGHTDIAG);
                                            break;

                                        default:
                                            alien.setSteer(xgalaga.TURN_SPEED);
                                            alien.setPath(-1);
                                    }
                                }
                                while ((alien.getPath() < 0) || (alien.getSteer() < 0));
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

                this.torps.considerTorp(alien);
            }
        }
    }

    // Update alien torpedos
    this.torps.update();
};


/**
 * Performs escorting action for specified alien.
 *
 * @param {Number} alienId
 *            The alien ID
 * @private
 */

xgalaga.Aliens.prototype.doEscort = function(alienId)
{
    var alien, flagshipId, flagship;

    alien = this.aliens[alienId];
    flagshipId = alien.getEscorting();
    flagship = this.aliens[flagshipId];

    if (!flagship.isAlive())
    {
        alien.setEscorting(-1);
    }
    else if (flagship.getDirection() >= 0)
    {
        alien.setDirection(flagship.getDirection());
    }
    else
    {
        alien.moveTo(20 * (alienId - 10 * parseInt(alienId / 10)) +
            this.convoyY + this.convoyMove, -10);
        alien.setDirection(-2);
        alien.setPath(-1);
        alien.setSteer(2);
        alien.setEscorting(-1);
    }
};


/**
 * Performs entering action for specified alien.
 *
 * @param {Number} alienId
 *            The alien ID
 * @param {Number} levelNo
 *            The level number
 * @param {xgalaga.Level} level
 *            The current level
 * @param {Number} metaLevel
 *            The meta level number
 * @private
 */

xgalaga.Aliens.prototype.doEnter = function(alienId, levelNo, level, metaLevel)
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
        alien.move(moves[dir][0] + metaLevel * parseInt(moves[dir][0] / 2),
            moves[dir][1] + metaLevel * parseInt(moves[dir][1] / 2));

        alien.decreaseSteer();
        if (alien.getSteer() <= 0)
        {
            alien.nextEnterPath(level);

            if (metaLevel > 1)
                alien.setSteer(parseInt(alien.getSteer() / (1 +
                    (parseInt((metaLevel - 1) * 0.5)))));

            if (alien.getDirection() < 0)
            {
                alien.setPath(-1);
            }
        }

        this.torps.considerTorp(alien);
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
        alien.move(moves[dir][0] + metaLevel * parseInt(moves[dir][0] / 2),
            moves[dir][1] + metaLevel * parseInt(moves[dir][1] / 2));
    }
};


/**
 * Performs convoy action.
 *
 * @param {Number} alienId
 *            The alien ID
 * @param {Number} levelNo
 *            The level number
 * @private
 */

xgalaga.Aliens.prototype.doConvoy = function(alienId, levelNo)
{
    var alien, liveCount, maxAttacking, e, eAlien;

    liveCount = this.liveCount;
    maxAttacking = this.maxAttacking;

    alien = this.aliens[alienId];
    alien.moveX(this.convoyMove);
    if (!this.entering && (this.attacking < maxAttacking) &&
           ((liveCount < maxAttacking) || (parseInt(Math.random() * 10000) <
           (levelNo + 2 * (48 - (liveCount))))))
    {
        switch (parseInt(Math.random() * 2))
        {
            case 0:
                alien.applyPath(xgalaga.P_PEELLEFT);
                break;
            case 1:
                alien.applyPath(xgalaga.P_PEELRIGHT);
                break;
        }
        this.attacking++;

         // Flagship, grab escorts
        if (alienId < 10)
        {
            for (e = alienId + 9; e < alienId + 12; e++)
            {
                eAlien = this.aliens[e];
                if (eAlien.isAlive() && eAlien.getDirection() == -1)
                {
                    eAlien.setEscorting(alienId);
                }
            }
        }
    }
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


/**
 * Renders the aliens.
 *
 * @param {Object} ctx
 *            The graphics context. This is either a HTML container element
 *            (For HTML render mode) or a canvas 2D context (For Canvas render
 *            mode)
 */

xgalaga.Aliens.prototype.render = function(ctx)
{
    var i;

    for (i = 0; i < xgalaga.MAX_ALIENS; i++)
        this.aliens[i].render(ctx);

    // Render alien torpedos
    this.torps.render(ctx);
};


/**
 * Destroys the specified alien and decreases the attacking counter if alien
 * was currently attacking.
 *
 * @param {xgalaga.Alien} alien
 *            The alien to destroy
 */

xgalaga.Aliens.prototype.destroy = function(alien)
{
    alien.destroy();
    if (alien.getDirection() >= 0) this.attacking--;
};


/**
 * Returns the alien with the specified ID.
 *
 * @param {Number} index
 *            The alien index
 * @return {xgalaga.Alien} The alien
 */

xgalaga.Aliens.prototype.getAlien = function(index)
{
    return this.aliens[index];
};


/**
 * Returns the number of aliens still alive.
 *
 * @return {Number} The number of alive aliens
 */

xgalaga.Aliens.prototype.getLiveCount = function()
{
    return this.liveCount;
};
