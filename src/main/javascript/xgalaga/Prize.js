/**
 * Copyright (C) 2012 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 *
 * @require xgalaga.js
 */

/**
 * Constructs a new prize.
 *
 * @param {!xgalaga.Game} game
 *            The game
 * @param {number} x
 *            The X position of the prize
 * @param {number} y
 *            The Y position of the prize
 * @constructor
 * @class A prize
 */
xgalaga.Prize = function(game, x, y)
{
    this.game = game;
    this.x = x;
    this.y = y;
    this.type = parseInt(Math.random() * xgalaga.NUMPRIZES, 10);
    this.image = new Image();
    this.image.src = xgalaga.PRIZE_IMG[this.type];
};

/**
 * The game
 * @private
 * @type {!xgalaga.Game}
 */
xgalaga.Prize.prototype.game;

/**
 * The HTML element (For HTML rendering mode).
 * @private
 * @type {?Element}
 */
xgalaga.Prize.prototype.element = null;

/**
 * The prize image.
 * @private
 * @type {!Image} 
 */
xgalaga.Prize.prototype.image;

/**
 * The current X position.
 * @private
 * @type {number} 
 */
xgalaga.Prize.prototype.x = 0;

/**
 * The current Y position.
 * @private
 * @type {number} 
 */
xgalaga.Prize.prototype.y = 0;

/**
 * The next prize in the linked list.
 * @private
 * @type {?xgalaga.Prize} 
 */
xgalaga.Prize.prototype.next = null;

/**
 * The previous prize in the linked list.
 * @private
 * @type {?xgalaga.Prize} 
 */
xgalaga.Prize.prototype.prev = null;

/**
 * Returns the next prize in the linked list.
 * 
 * @return {?xgalaga.Prize} 
 *            The next prize or null if none.
 */
xgalaga.Prize.prototype.getNext = function()
{
    return this.next;
};

/**
 * Returns the previous prize in the linked list.
 *
 * @return {?xgalaga.Prize} 
 *            The previous prize or null if none.
 */
xgalaga.Prize.prototype.getPrev = function()
{
    return this.prev;
};

/**
 * Sets the next prize in the linked list.
 * 
 * @param {?xgalaga.Prize} next
 *            The next prize to set. Null for none.
 */
xgalaga.Prize.prototype.setNext = function(next)
{
    this.next = next;
};

/**
 * Sets the previous prize in the linked list.
 *
 * @param {?xgalaga.Prize} prev
 *            The previous prize to set. Null for none.
 */
xgalaga.Prize.prototype.setPrev = function(prev)
{
    this.prev = prev;
};

/**
 * Returns the current X position of the prize.
 *
 * @return {number} 
 *            The X position.
 */
xgalaga.Prize.prototype.getX = function()
{
    return this.x;
};

/**
 * Returns the current Y position of the prize.
 *
 * @return {number} 
 *            The Y position.
 */
xgalaga.Prize.prototype.getY = function()
{
    return this.y;
};

xgalaga.Prize.prototype.destroy = function()
{
    // Remove HTML element if present.
    if (this.element)
    {
        this.element.parentNode.removeChild(this.element);
        this.element = null;
    }
    
    // Remove from list of prizes
    this.game.getPrizes().removePrize(this);
};

/**
 * Renders the prize.
 *
 * @param {(!HTMLElement|!CanvasRenderingContext2D)} ctx
 *            The graphics context. This is either a HTML container element
 *            (For HTML render mode) or a canvas 2D context (For Canvas render
 *            mode)
 */
xgalaga.Prize.prototype.render = function(ctx)
{
    var e, s, tmp, img;

    switch (this.game.getRenderMode())
    {
        case xgalaga.RENDER_MODE_CANVAS:
            img = this.image;
            if (!img.width || !img.height) return;
            ctx.drawImage(img, this.x - 7, this.y - 5);
            break;

        default:
            e = this.element;
            if (!e)
            {
                e = this.element = document.createElement("div");
                ctx.appendChild(e);
                s = e.style;
                s.left = "-15px";
                s.top = "-10px";
                s.width = "15px";
                s.height = "10px";
                s.overflow = "hidden";
                s.position = "absolute";
                s.backgroundImage = "url(" + this.image.src + ")";
                e["prevX"] = -15;
                e["prevY"] = -10;
            } else s = e.style;
            if (tmp)
            {
                if ((tmp = this.x) != +e["prevX"])
                    s.left = ((e["prevX"] = tmp) - 7) + "px";
                if ((tmp = this.y) != +e["prevY"])
                    s.top = ((e["prevY"] = tmp) - 5) + "px";
            }
    }
};

/**
 * Updates the prize.
 */
xgalaga.Prize.prototype.update = function()
{
    var player, winHeight, game;
    
    this.y += xgalaga.PRIZESPEED;
    game = this.game;
    player = game.getPlayer();
    winHeight = game.getHeight();  
    if (this.y > winHeight - 20 && Math.abs(this.x - player.getX()) < 15 &&
        !player.isDead())
    {
        this.game.playSound("ddloo");
        this.destroy();
        switch (this.type)
        {
            case xgalaga.PR_SING:
                if (player.getWeapon() == xgalaga.WEAPON_SINGLESHOT)
                    player.addTorp();
                else
                    player.setWeapon(xgalaga.WEAPON_SINGLESHOT);
                break;

            case xgalaga.PR_DOUB:
                if (player.getWeapon() == xgalaga.WEAPON_DOUBLESHOT)
                    player.addTorp();
                else
                    player.setWeapon(xgalaga.WEAPON_DOUBLESHOT);
                break;
                
            case xgalaga.PR_TRIP:
                if (player.getWeapon() == xgalaga.WEAPON_TRIPLESHOT)
                    player.addTorp();
                else
                    player.setWeapon(xgalaga.WEAPON_TRIPLESHOT);
                break;
                
            case xgalaga.PR_SPEED:
                player.incSpeed();
                break;
                
        }
    }
    else if (this.y > winHeight)
    {
        this.destroy();
    }
};
