/**
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require xgalaga.js
 */

/**
 * Constructs a new torpedo.
 *
 * @param {!xgalaga.Game} game
 *            The game
 * @constructor
 * @class A torpedo
 */
xgalaga.PlayerTorpedo = function(game)
{
    this.game = game;
    this.image = new Image();
    this.image.src = "images/mtorp.png"
};

/**
 * The game.
 * @private
 * @type {!xgalaga.Game}
 */
xgalaga.PlayerTorpedo.prototype.game;

/**
 * The HTML element for HTML rendering.
 * @private
 * @type {?Element}
 */
xgalaga.PlayerTorpedo.prototype.element = null;

/**
 * If torpedo is alive.
 * @private
 * @type {boolean} 
 */
xgalaga.PlayerTorpedo.prototype.alive = true;

/**
 * The torpedo image.
 * @private
 * @type {!Image} 
 */
xgalaga.PlayerTorpedo.prototype.image;

/**
 * The current X position.
 * @private
 * @type {number} 
 */
xgalaga.PlayerTorpedo.prototype.x = 0;

/**
 * The current Y position.
 * @private
 * @type {number} 
 */
xgalaga.PlayerTorpedo.prototype.y = 0;

/**
 * The X speed.
 * @private
 * @type {number} 
 */
xgalaga.PlayerTorpedo.prototype.xSpeed = 0;

/**
 * The Y speed.
 * @private
 * @type {number} 
 */
xgalaga.PlayerTorpedo.prototype.ySpeed = 0;

/**
 * Resets the torpedo.
 * 
 * @param {number} x
 *            The X position of the torpedo
 * @param {number} y
 *            The Y position of the torpedo
 * @param {number} xSpeed
 *            The X speed
 * @param {number} ySpeed
 *            The Y speed
 */
xgalaga.PlayerTorpedo.prototype.reset = function(x, y, xSpeed, ySpeed)
{
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.alive = true;
};

/**
 * Updates the torpedo.
 */
xgalaga.PlayerTorpedo.prototype.update = function()
{
    var x, y, xSpeed, winWidth;

    x = (this.x += (xSpeed = this.xSpeed));
    y = (this.y += this.ySpeed);

    winWidth = this.game.getWidth();
    xSpeed = Math.abs(xSpeed);
    if (y < -xSpeed || x < xSpeed || x > winWidth - xSpeed)
        this.alive = false;
};


/**
 * Sets the alive state of the torpedo.
 *
 * @param {boolean} alive
 *            The alive state to set
 */

xgalaga.PlayerTorpedo.prototype.setAlive = function(alive)
{
    this.alive = alive;
};


/**
 * Checks if torpedo is alive.
 *
 * @return {boolean} True if torped is alive, false if not
 */
xgalaga.PlayerTorpedo.prototype.isAlive = function()
{
    return this.alive;
};


/**
 * Returns the current X position of the torpedo.
 *
 * @return {number} The X position
 */

xgalaga.PlayerTorpedo.prototype.getX = function()
{
    return this.x;
};


/**
 * Returns the current Y position of the torpedo.
 *
 * @return {number} The Y position
 */

xgalaga.PlayerTorpedo.prototype.getY = function()
{
    return this.y;
};


/**
 * Returns the X speed.
 *
 * @return {number} The X speed
 */

xgalaga.PlayerTorpedo.prototype.getXSpeed = function()
{
    return this.xSpeed;
};


/**
 * Returns the Y speed.
 *
 * @return {number} The Y speed
 */

xgalaga.PlayerTorpedo.prototype.getYSpeed = function()
{
    return this.ySpeed;
};

/**
 * Renders the torpedo.
 *
 * @param {(!HTMLElement|!CanvasRenderingContext2D)} ctx
 *            The graphics context. This is either a HTML container element
 *            (For HTML render mode) or a canvas 2D context (For Canvas render
 *            mode)
 */
xgalaga.PlayerTorpedo.prototype.render = function(ctx)
{
    var e, s, tmp, img;

    switch (this.game.getRenderMode())
    {
        case xgalaga.RENDER_MODE_CANVAS:
            if (!this.alive) return;
            img = this.image;
            if (!img.width || !img.height) return;
            ctx.drawImage(img, 0, 0, 5, 7,
                this.x - 2, this.y - 3, 5, 7);
            break;

        default:
            e = this.element;
            if (!e)
            {
                e = this.element = document.createElement("div");
                s = e.style;
                s.left = "-5px";
                s.top = "-7px";
                s.width = "5px";
                s.height = "7px";
                s.overflow = "hidden";
                s.position = "absolute";
                s.backgroundImage = "url(" + this.image.src + ")";
                e["prevAlive"] = false;
                e["prevFrame"] = -1;
                e["prevX"] = -5;
                e["prevY"] = -7;
            } else s = e.style;

            if ((tmp = this.alive) != !!e["prevAlive"])
            {
                e["prevAlive"] = tmp;
                if (tmp)
                    ctx.appendChild(e);
                else
                    ctx.removeChild(e);
            }
            if (tmp)
            {
                if ((tmp = this.x) != +e["prevX"])
                    s.left = ((e["prevX"] = tmp) - 2) + "px";
                if ((tmp = this.y) != +e["prevY"])
                    s.top = ((e["prevY"] = tmp) - 3) + "px";
            }
    }
};
