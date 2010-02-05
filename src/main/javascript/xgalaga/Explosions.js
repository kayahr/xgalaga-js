/**
 * $Id$
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the xgalaga.Explosions class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs the explosion factory.
 *
 * @param {xgalaga.Game} game
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

/** The game. @private @type {xgalaga.Game} */
xgalaga.Explosions.prototype.game = null;

/** The explosions. @private @type {Number} */
xgalaga.Explosions.prototype.explosions = null;


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
 * @param {Object} ctx
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
 * @param {Number} x
 *            The explosion X position
 * @param {Number} y
 *            The explosion Y position
 * @param {Number} type
 *            The explosion type
 */

xgalaga.Explosions.prototype.newExplosion = function(x, y, type)
{
    var i, explosions, explosion;

    explosions = this.explosions;
    console.log(xgalaga.MAX_EXPLOSIONS);
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
