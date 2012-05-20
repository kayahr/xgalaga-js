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
 * @param {number} x
 *            The X position of the torpedo
 * @param {number} y
 *            The Y position of the torpedo
 * @param {number} xSpeed
 *            The X speed
 * @param {number} ySpeed
 *            The Y speed
 * @constructor
 * @class A torpedo
 */
xgalaga.AlienTorpedo = function(game, x, y, xSpeed, ySpeed)
{
    this.game = game;
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.image = new Image();
    this.image.src = "images/etorp.png"
};

/**
 * The game
 * @private
 * @type {!xgalaga.Game}
 */
xgalaga.AlienTorpedo.prototype.game;

/**
 * The HTML element (For HTML rendering mode.
 * @private
 * @type {?Element}
 */
xgalaga.AlienTorpedo.prototype.element = null;

/**
 * If torpedo is alive.
 * @private
 * @type {boolean} 
 */
xgalaga.AlienTorpedo.prototype.alive = true;

/**
 * The torpedo image.
 * @private
 * @type {!Image} 
 */
xgalaga.AlienTorpedo.prototype.image;

/**
 * The current animation frame index.
 * @private
 * @type {number} 
 */
xgalaga.AlienTorpedo.prototype.frame = 0;

/**
 * The current X position.
 * @private
 * @type {number} 
 */
xgalaga.AlienTorpedo.prototype.x = 0;

/**
 * The current Y position.
 * @private
 * @type {number} 
 */
xgalaga.AlienTorpedo.prototype.y = 0;

/**
 * The X speed.
 * @private
 * @type {number} 
 */
xgalaga.AlienTorpedo.prototype.xSpeed = 0;

/**
 * The Y speed.
 * @private
 * @type {number} 
 */
xgalaga.AlienTorpedo.prototype.ySpeed = 0;

/**
 * The next torpedo in the linked list.
 * @private
 * @type {?xgalaga.AlienTorpedo} 
 */
xgalaga.AlienTorpedo.prototype.next = null;

/**
 * The previous torpedo in the linked list.
 * @private
 * @type {?xgalaga.AlienTorpedo} 
 */
xgalaga.AlienTorpedo.prototype.prev = null;

/**
 * Moves the torpedo
 */
xgalaga.AlienTorpedo.prototype.move = function()
{
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.frame++;
};

/**
 * Returns the next torpedo in the linked list.
 * 
 * @return {?xgalaga.AlienTorpedo} 
 *            The next torpedo or null if none.
 */
xgalaga.AlienTorpedo.prototype.getNext = function()
{
    return this.next
};

/**
 * Returns the previous torpedo in the linked list.
 *
 * @return {?xgalaga.AlienTorpedo} 
 *            The previous torpedo or null if none.
 */
xgalaga.AlienTorpedo.prototype.getPrev = function()
{
    return this.prev;
};

/**
 * Sets the next torpedo in the linked list.
 * 
 * @param {?xgalaga.AlienTorpedo} next
 *            The next torpedo to set. Null for none.
 */
xgalaga.AlienTorpedo.prototype.setNext = function(next)
{
    this.next = next;
};

/**
 * Sets the previous torpedo in the linked list.
 *
 * @param {?xgalaga.AlienTorpedo} prev
 *            The previous torpedo to set. Null for none.
 */
xgalaga.AlienTorpedo.prototype.setPrev = function(prev)
{
    this.prev = prev;
};

/**
 * Checks if torpedo is alive.
 * 
 * @return {boolean} 
 *            True if torpedo is alive, false if not.
 */
xgalaga.AlienTorpedo.prototype.isAlive = function()
{
    return this.alive;
};

/**
 * Returns the current X position of the torpedo.
 *
 * @return {number} 
 *            The X position.
 */
xgalaga.AlienTorpedo.prototype.getX = function()
{
    return this.x;
};

/**
 * Returns the current Y position of the torpedo.
 *
 * @return {number} 
 *            The Y position.
 */
xgalaga.AlienTorpedo.prototype.getY = function()
{
    return this.y;
};

/**
 * Destroys the torpedo.
 */
xgalaga.AlienTorpedo.prototype.destroy = function()
{
    if (this.element)
    {
        this.element.parentNode.removeChild(this.element);
        this.element = null;
    }
};

/**
 * Renders the rorpedo.
 *
 * @param {(!HTMLElement|!CanvasRenderingContext2D)} ctx
 *            The graphics context. This is either a HTML container element
 *            (For HTML render mode) or a canvas 2D context (For Canvas render
 *            mode)
 */
xgalaga.AlienTorpedo.prototype.render = function(ctx)
{
    var e, s, tmp, img;

    switch (this.game.getRenderMode())
    {
        case xgalaga.RENDER_MODE_CANVAS:
            if (!this.alive) return;
            img = this.image;
            if (!img.width || !img.height) return;
            ctx.drawImage(img, 0, this.frame % 8 * 5, 5, 5,
                this.x - 2, this.y - 2, 5, 5);
            break;

        default:
            e = this.element;
            if (!e)
            {
                e = this.element = document.createElement("div");
                s = e.style;
                s.left = "-5px";
                s.top = "-5px";
                s.width = "5px";
                s.height = "5px";
                s.overflow = "hidden";
                s.position = "absolute";
                s.backgroundImage = "url(images/etorp.png)";
                e["prevAlive"] = false;
                e["prevFrame"] = -1;
                e["prevX"] = -5;
                e["prevY"] = -5;
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
                    s.top = ((e["prevY"] = tmp) - 2) + "px";
                if ((tmp = this.frame) != +e["prevFrame"])
                    s.backgroundPosition = "0 " +
                        (-((e["prevFrame"] = tmp) % 8) * 5) + "px";
            }
    }
};
