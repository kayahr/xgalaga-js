/**
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 *
 * @require xgalaga.js
 */

/**
 * Constructs a new explosion.
 *
 * @param {!xgalaga.Game} game
 *            The game
 * @constructor
 * @class An explosion
 */
xgalaga.Explosion = function(game)
{
    this.game = game;
    this.image = new Image();
    this.image.src = "images/explosion.png"
};

/**
 * The game.
 * @private
 * @type {!xgalaga.Game}
 */
xgalaga.Explosion.prototype.game;

/**
 * The HTML element (For HTML render mode).
 * @private
 * @type {?Element}
 */
xgalaga.Explosion.prototype.element;

/**
 * The explosion image.
 * @private
 * @type {!Image} 
 */
xgalaga.Explosion.prototype.image;

/**
 * If explosion is currently running.
 * @private
 * @type {boolean} 
 */
xgalaga.Explosion.prototype.running = false;

/**
 * The current animation frame index.
 * @private
 * @type {number} 
 */
xgalaga.Explosion.prototype.frame = 0;

/**
 * The current X position.
 * @private
 * @type {number} 
 */
xgalaga.Explosion.prototype.x = 0;

/**
 * The current Y position.
 * @private
 * @type {number} 
 */
xgalaga.Explosion.prototype.y = 0;

/**
 * The explosion type.
 * @private
 * @type {number} 
 */
xgalaga.Explosion.prototype.type = 0;

/**
 * Starts the explosion at the specified position and with the specified type.
 *
 * @param {number} x
 *            The X position of the torpedo
 * @param {number} y
 *            The Y position of the torpedo
 * @param {number} type
 *            The explosion type
 */
xgalaga.Explosion.prototype.run = function(x, y, type)
{
    this.x = x;
    this.y = y;
    this.type = type;
    this.frame = 0;
    this.running = true;
};

/**
 * Checks if this explosion is still running;
 * 
 * @return {boolean} 
 *            True if explosion is still running, false if not
 */
xgalaga.Explosion.prototype.isRunning = function()
{
    return this.running;
};

/**
 * Updates the explosion.
 */
xgalaga.Explosion.prototype.update = function()
{
    if (!this.running) return;

    this.frame++;
    if (this.frame > 4) this.running = false;
};

/**
 * Renders the explosion.
 *
 * @param {(!HTMLElement|!CanvasRenderingContext2D)} ctx
 *            The graphics context. This is either a HTML container element
 *            (For HTML render mode) or a canvas 2D context (For Canvas render
 *            mode)
 */
xgalaga.Explosion.prototype.render = function(ctx)
{
    var e, s, tmp, img;

    switch (this.game.getRenderMode())
    {
        case xgalaga.RENDER_MODE_CANVAS:
            if (!this.running) return;
            img = this.image;
            if (!img.width || !img.height) return;
            ctx.drawImage(img, 0, this.frame % 5 * 65, 65, 65,
                this.x - 32, this.y - 32, 65, 65);
            break;

        default:
            e = this.element;
            if (!e)
            {
                e = this.element = document.createElement("div");
                s = e.style;
                s.left = "-32px";
                s.top = "-32px";
                s.width = "65px";
                s.height = "65px";
                s.overflow = "hidden";
                s.position = "absolute";
                s.backgroundImage = "url(" + this.image.src + ")";
                e["prevRunning"] = false;
                e["prevFrame"] = -1;
                e["prevX"] = -32;
                e["prevY"] = -32;
            } else s = e.style;

            if ((tmp = this.running) != !!e["prevRunning"])
            {
                e["prevRunning"] = this.running;
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
                        (-((e["prevFrame"] = tmp) % 65) * 65) + "px";
            }
    }
};
