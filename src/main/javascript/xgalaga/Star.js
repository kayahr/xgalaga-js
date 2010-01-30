/**
 * $Id$
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the xgalaga.Star class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new star.
 *
 * @param {xgalaga.Game} game
 *            The game
 * @constructor
 * @class A star
 */

xgalaga.Star = function(game)
{
    this.game = game;
    this.speed = parseInt(Math.random() * 3) + 1;
    this.randomize();
    this.y = parseInt(Math.random() * game.getHeight());
};

/** The possible star colors. @private @type {Array} */
xgalaga.Star.COLORS = [ "#fff", "#0f0", "#0ff", "#f00", "#ff0" ];

/** The HTML element (For HTML render mode). @private @type {HTMLElement} */
xgalaga.Star.prototype.element = null;

/** The X coordinate of the star. @private @type {Number} */
xgalaga.Star.prototype.x = null;

/** The Y coordinate of the star. @private @type {Number} */
xgalaga.Star.prototype.y = null;

/** The color of the star. @private @type {String} */
xgalaga.Star.prototype.color = null;

/** The star speed. @private @type {Number} */
xgalaga.Star.prototype.speed = null;


/**
 * Randomizes the color and the X position of the star. This must be called
 * on init and whenever the star has left the screen.
 *
 * @private
 */
 
xgalaga.Star.prototype.randomize = function()
{
    var colors;
    
    colors = xgalaga.Star.COLORS;
    this.color = colors[parseInt(Math.random() * colors.length)];
    this.x = parseInt(Math.random() * this.game.getWidth());
};


/**
 * Updates the star with the specified star speed. If the star reaches the
 * bottom of the screen then it is randomized again so a new star comes
 * in from the top.
 *
 * @param {Number} starSpeed
 *            The star speed
 */
 
xgalaga.Star.prototype.update = function(starSpeed)
{
    var y, height;
    
    height = this.game.getHeight();
    y = this.y += this.speed * ((starSpeed < 20) ? Math.abs(starSpeed) : 20);
    if (y >= height)
    {
        this.randomize();
        y = (this.y -= height + starSpeed);        
    }
};


/**
 * Renders the star.
 *
 * @param {Object} ctx
 *            The graphics context. This is either a HTML container element
 *            (For HTML render mode) or a canvas 2D context (For Canvas render
 *            mode)
 */

xgalaga.Star.prototype.render = function(ctx)
{
    var e, s, tmp;

    switch (this.game.getRenderMode())
    {
        case xgalaga.RENDER_MODE_CANVAS:
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, 1, 1);
            break;

        default:
            e = this.element;
            if (!e)
            {
                e = this.element = document.createElement("div");
                ctx.appendChild(e);
                s = e.style;
                s.width = "1px";
                s.height = "1px";
                s.position = "absolute";
                e.prevX = null;
                e.prevY = null;
                e.prevColor = null;
            } else s = e.style;

            if ((tmp = this.color) != e.prevColor)
                s.backgroundColor = (this.prevColor = tmp);
            if ((tmp = this.x) != e.prevX)
                s.left = (e.prevX = tmp) + "px";
            if ((tmp = this.y) != e.prevY)
                s.top = (e.prevY = tmp) + "px";
    }
};
