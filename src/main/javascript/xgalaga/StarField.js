/**
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require xgalaga.js
 */

/**
 * Constructs a new star field.
 *
 * TODO Clean up the parallax scrolling. Implement switch between classic
 * and new theme.
 *
 * @param {!xgalaga.Game} game
 *            The game
 * @constructor
 * @class A star field
 */
xgalaga.StarField = function(game)
{
    var stars, i;

    //this.container = game.getContainer();
    //this.canvas = game.canvas;
    //game.container.style.background = "url(images/stars.png)";
    //game.canvas.style.background = "url(images/nebular2.png)";
    this.y = 0;
    this.ny = 0;

    stars = this.stars = [];
    for (i = 0; i < xgalaga.MAX_STARS; i++)
        stars.push(new xgalaga.Star(game));
};

/**
 * The stars.
 * @private
 * @type {!Array.<!xgalaga.Star>} 
 */
xgalaga.StarField.prototype.stars;

/**
 * The current speed.
 * @private
 * @type {number} 
 */
xgalaga.StarField.prototype.speed = 1;

/**
 * Updates the star field.
 */ 
xgalaga.StarField.prototype.update = function()
{
    var i;

    for (i = 0; i < xgalaga.MAX_STARS; i++)
        this.stars[i].update(this.speed);

    this.y += 1 * ((this.speed < 20) ? Math.abs(this.speed) : 20);
    if (this.y > 1500) this.y -= 1500;
    this.ny += 5 * ((this.speed < 20) ? Math.abs(this.speed) : 20);
    if (this.ny > 1500) this.ny -= 1500;
};


/**
 * Renders the star field.
 *
 * @param {(!HTMLElement|!CanvasRenderingContext2D)} ctx
 *            The graphics context. This is either a HTML container element
 *            (For HTML render mode) or a canvas 2D context (For Canvas render
 *            mode)
 */
xgalaga.StarField.prototype.render = function(ctx)
{
    var i;

    for (i = 0; i < xgalaga.MAX_STARS; i++)
        this.stars[i].render(ctx);

//    this.container.style.backgroundPosition = "center " + parseInt(this.y, 10) + "px";
  //  this.canvas.style.backgroundPosition = "center " + parseInt(this.ny, 10) + "px";
};


/**
 * Changes the current star speed.
 *
 * @param {number} delta
 *            The speed delta
 */

xgalaga.StarField.prototype.changeSpeed = function(delta)
{
    this.speed += delta;
};


/**
 * Sets the speed.
 *
 * @param {number} speed
 *            The speed to set
 */

xgalaga.StarField.prototype.setSpeed = function(speed)
{
    this.speed = speed;
};


/**
 * Returns the current star speed.
 *
 * @return {number} The current star speed
 */

xgalaga.StarField.prototype.getSpeed = function()
{
    return this.speed;
};
