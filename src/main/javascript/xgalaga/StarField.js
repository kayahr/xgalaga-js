/**
 * $Id$
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the xgalaga.StarField class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new star field.
 *
 * @param {xgalaga.Game} game
 *            The game
 * @constructor
 * @class A star field
 */

xgalaga.StarField = function(game)
{
    var stars, i;
    
    stars = this.stars = [];
    for (i = 0; i < xgalaga.MAX_STARS; i++)
        stars.push(new xgalaga.Star(game));
};

/** The stars. @private @type {Array} */
xgalaga.StarField.prototype.stars = null;

/** The current speed. @private @type {Number} */
xgalaga.StarField.prototype.speed = 1;


/**
 * Updates the star field.
 */
 
xgalaga.StarField.prototype.update = function()
{
    var i;

    for (i = 0; i < xgalaga.MAX_STARS; i++)
        this.stars[i].update(this.speed);
};


/**
 * Renders the star field.
 *
 * @param {Object} ctx
 *            The graphics context. This is either a HTML container element
 *            (For HTML render mode) or a canvas 2D context (For Canvas render
 *            mode)
 */

xgalaga.StarField.prototype.render = function(ctx)
{
    var i;

    for (i = 0; i < xgalaga.MAX_STARS; i++)
        this.stars[i].render(ctx);
};


/**
 * Changes the current star speed.
 *
 * @param {Number} delta
 *            The speed delta
 */

xgalaga.StarField.prototype.changeSpeed = function(delta)
{
    this.speed += delta;
};


/**
 * Returns the current star speed.
 *
 * @return {Number} The current star speed
 */

xgalaga.StarField.prototype.getSpeed = function()
{
    return this.speed;
};
