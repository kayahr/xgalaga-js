/**
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require xgalaga.js
 */

/**
 * Constructs the explosion factory.
 *
 * @param {!xgalaga.Game} game
 *            The game
 * @constructor
 * @class The explosion factory
 */
xgalaga.Explosions = function(game)
{
    var i, explosions;

    this.game = game;

    explosions = this.explosions = [];
    for (i = 0; i < xgalaga.MAX_EXPLOSIONS; i++)
        explosions[i] = new xgalaga.Explosion(game);
};

/**
 * The game.
 * @private
 * @type {!xgalaga.Game} 
 */
xgalaga.Explosions.prototype.game;

/**
 * The explosions.
 * @private
 * @type {!Array.<!xgalaga.Explosion>} 
 */
xgalaga.Explosions.prototype.explosions;

/**
 * Updates the explosions.
 */
xgalaga.Explosions.prototype.update = function()
{
    var i;

    for (i = 0; i < xgalaga.MAX_EXPLOSIONS; i++)
        this.explosions[i].update();
};

/**
 * Renders the explosions.
 *
 * @param {(!HTMLElement|!CanvasRenderingContext2D)} ctx
 *            The graphics context. This is either a HTML container element
 *            (For HTML render mode) or a canvas 2D context (For Canvas render
 *            mode)
 */
xgalaga.Explosions.prototype.render = function(ctx)
{
    var i;

    for (i = 0; i < xgalaga.MAX_EXPLOSIONS; i++)
        this.explosions[i].render(ctx);
};

/**
 * Starts a new explosion.
 *
 * @param {number} x
 *            The explosion X position
 * @param {number} y
 *            The explosion Y position
 * @param {number} type
 *            The explosion type
 */
xgalaga.Explosions.prototype.newExplosion = function(x, y, type)
{
    var i, explosions, explosion;

    explosions = this.explosions;
    for (i = 0; i < xgalaga.MAX_EXPLOSIONS; i++)
    {
        explosion = explosions[i];
        if (!explosion.isRunning())
        {
            explosion.run(x, y, type);
            return;
        }
    }
};
