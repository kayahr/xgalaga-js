/**
 * Copyright (C) 2012 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 *
 * @require xgalaga.js
 */

/**
 * Constructs new prizes.
 *
 * @param {!xgalaga.Game} game
 *            The game
 * @constructor
 * @class The prizes.
 */
xgalaga.Prizes = function(game)
{
    this.game = game;
};

/**
 * The game.
 * @private
 * @type {!xgalaga.Game} 
 */
xgalaga.Prizes.prototype.game;

/**
 * The first prize (linked list).
 * @private
 * @type {?xgalaga.Prize} 
 */
xgalaga.Prizes.prototype.firstPrize = null;

/**
 * Creates a new prize.
 *
 * @param {number} x
 *            Starting X-position.
 * @param {number} y
 *            Starting Y-position.
 */
xgalaga.Prizes.prototype.newPrize = function(x, y)
{
    var prize;
    
    prize = new xgalaga.Prize(this.game, x, y);
    if (this.firstPrize)
    {
        this.firstPrize.setPrev(prize);
        prize.setNext(this.firstPrize);
    }
    this.firstPrize = prize;
};

/**
 * Renders the prizes.
 *
 * @param {(!HTMLElement|!CanvasRenderingContext2D)} ctx
 *            The graphics context. This is either a HTML container element
 *            (For HTML render mode) or a canvas 2D context (For Canvas render
 *            mode)
 */
xgalaga.Prizes.prototype.render = function(ctx)
{
    var prize;

    prize = this.firstPrize;
    while (prize)
    {
        prize.render(ctx);
        prize = prize.getNext();
    }
};

/**
 * Updates the prizes.
 */
xgalaga.Prizes.prototype.update = function()
{
    var prize;

    prize = this.firstPrize;
    while (prize)
    {
        prize.update();
        prize = prize.getNext();
    }
};

/**
 * Removes the specified prize.
 * 
 * @param {!xgalaga.Prize} prize
 *            The prize to remove.
 */
xgalaga.Prizes.prototype.removePrize = function(prize)
{
    if (prize.getNext())
        prize.getNext().setPrev(prize.getPrev());
    if (prize.getPrev())
        prize.getPrev().setNext(prize.getNext());
    if (prize == this.firstPrize)
        this.firstPrize = prize.getNext();    
};