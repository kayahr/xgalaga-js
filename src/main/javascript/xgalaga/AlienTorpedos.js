/**
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 *
 * @require xgalaga.js
 */

/**
 * Constructs new alien torpedos.
 *
 * @param {!xgalaga.Game} game
 *            The game
 * @constructor
 * @class The alien torpedos
 */
xgalaga.AlienTorpedos = function(game)
{
    this.game = game;
};

/**
 * The game.
 * @private
 * @type {!xgalaga.Game} 
 */
xgalaga.AlienTorpedos.prototype.game;

/**
 * The current level.
 * @private
 * @type {number} 
 */
xgalaga.AlienTorpedos.prototype.level = 0;

/**
 * The first torpedo (linked list).
 * @private
 * @type {?xgalaga.AlienTorpedo} 
 */
xgalaga.AlienTorpedos.prototype.firstTorp = null;

/**
 * The maximum number of torpedos.
 * @private
 * @type {number} 
 */
xgalaga.AlienTorpedos.prototype.maxTorps = 0;

/**
 * The current number of torpedos.
 * @private
 * @type {number} 
 */
xgalaga.AlienTorpedos.prototype.numTorps = 0;

/**
 * Initializes the alien torpedos for the specified level.
 *
 * @param {number} level
 *            The level
 */
xgalaga.AlienTorpedos.prototype.init = function(level)
{
    this.level = level;
    this.maxTorps = 10 + (level * 5);
    this.numTorps = 0;
    this.firstTorp = null;
};

/**
 * Updates the alien torpedos
 */
xgalaga.AlienTorpedos.prototype.update = function()
{
    var t, nextT, game, winWidth, winHeight, x, pldead, plflash, plshield,
        playerShipHeight, plx, player, explosions;

    game = this.game;
    player = game.getPlayer();
    pldead = player.isDead();
    plflash = player.isFlashing();
    plshield = player.hasShield();
    plx = player.getX();
    explosions = game.getExplosions();
    winWidth = game.getWidth();
    winHeight = game.getHeight();
    playerShipHeight = 20;
    t = this.firstTorp;
    while (t)
    {
        nextT = t.getNext();
        if (t.isAlive())
        {
            t.move();
            x = t.getX();
            if (t.getY() > winHeight || x < 0 || x > winWidth)
            {
                if (t.getNext())
                    t.getNext().setPrev(t.getPrev());
                if (t.getPrev())
                    t.getPrev().setNext(t.getNext());
                if (t == this.firstTorp)
                    this.firstTorp = t.getNext();
                t.destroy();
                this.numTorps--;
            }
            else if (!pldead && !plflash && !plshield &&
                (Math.abs(t.getX() - plx) < 8) &&
                (Math.abs(t.getY() - (winHeight - 
                    parseInt(playerShipHeight / 2, 10))) < 8))
            {
                player.destroy();
            }
        }
        t = nextT;
    }
};

/**
 * Renders the torpedos.
 *
 * @param {(!HTMLElement|!CanvasRenderingContext2D)} ctx
 *            The graphics context. This is either a HTML container element
 *            (For HTML render mode) or a canvas 2D context (For Canvas render
 *            mode)
 */
xgalaga.AlienTorpedos.prototype.render = function(ctx)
{
    var t;

    t = this.firstTorp;
    while (t)
    {
        t.render(ctx);
        t = t.getNext();
    }
};

/**
 * Considers firing a new torpedo.
 *
 * @param {!xgalaga.Alien} alien
 *            The alien firing the torpedo
 */
xgalaga.AlienTorpedos.prototype.considerTorp = function(alien)
{
    var weapon, plx, chance, alienX, xs, ys, level, game, player;

    game = this.game;
    player = game.getPlayer();
    level = this.level;
    weapon = player.getWeapon();
    plx = player.getX();
    chance = Math.max(35, xgalaga.TORP_CHANCE - parseInt(level / 2, 10) -
        weapon * 5);

    if (this.numTorps < this.maxTorps &&
        (!parseInt(Math.random() * chance, 10)))
    {
        // could aim better, not sure it should!
        alienX = alien.getX();
        if (alienX > plx + 200)
            xs = -3;
        else if (alienX > plx + 100)
            xs = -2;
        else if (alienX < plx - 200)
            xs = 3;
        else if (alienX < plx - 100)
            xs = 2;
        else
            xs = 0;
        ys = (xgalaga.ETORP_SPEED + parseInt(level / 5, 10)) - Math.abs(xs);
        this.newTorp(alienX, alien.getY(), xs, ys);
    }
};

/**
 * Fires a new torpedo.
 *
 * @param {number} x
 *            Starting X-position.
 * @param {number} y
 *            Starting Y-position.
 * @param {number} xSpeed
 *            The horizontal speed.
 * @param {number} ySpeed
 *            The vertical speed.
 * @private
 */
xgalaga.AlienTorpedos.prototype.newTorp = function(x, y, xSpeed, ySpeed)
{
    var t;

    t = new xgalaga.AlienTorpedo(this.game, x, y, xSpeed, ySpeed);
    if (this.firstTorp)
    {
        this.firstTorp.setPrev(t);
        t.setNext(this.firstTorp);
    }
    this.firstTorp = t;
    this.numTorps++;
};
