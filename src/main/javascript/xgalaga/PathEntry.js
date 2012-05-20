/**
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require xgalaga.js
 */

/**
 * Constructs a new path entry.
 *
 * @param {number} direction
 *            The flight direction (One of xgalaga.DIR_*)
 * @param {number} duration
 *            The flight duration
 * @constructor
 * @class A path entry
 */
xgalaga.PathEntry = function(direction, duration)
{
    this.direction = direction;
    this.duration = duration;
};

/**
 * The flight direction (One of xgalaga.DIR_*) .
 * @private
 * @type {number} 
 */
xgalaga.PathEntry.prototype.direction;

/**
 * The flight duration.
 * @private
 * @type {number} 
 */
xgalaga.PathEntry.prototype.duration;


/**
 * Returns the flight direction. This is one of the xgalaga.DIR_* constants.
 *
 * @return {number} The flight direction
 */

xgalaga.PathEntry.prototype.getDirection = function()
{
    return this.direction;
};


/**
 * Returns the flight duration.
 *
 * @return {number} The flight duration
 */

xgalaga.PathEntry.prototype.getDuration = function()
{
    return this.duration;
};
