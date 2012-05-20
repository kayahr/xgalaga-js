/**
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require xgalaga.js
 */

/**
 * Constructs a new path info.
 *
 * @param {number} startX
 *            The start X position
 * @param {number} startY
 *            The start Y position
 * @param {!Array.<xgalaga.PathEntry>} entries
 *            The path entries
 * @constructor
 * @class A path info
 */
xgalaga.PathInfo = function(startX, startY, entries)
{
    this.startX = startX;
    this.startY = startY;
    this.entries = entries;
};

/**
 * The start X position.
 * @private
 * @type {number} 
 */
xgalaga.PathInfo.prototype.startX = 0;

/**
 * The start Y position.
 * @private
 * @type {number} 
 */
xgalaga.PathInfo.prototype.startY = 0;

/**
 * The path entries.
 * @private
 * @type {!Array.<!xgalaga.PathEntry>} 
 */
xgalaga.PathInfo.prototype.entries;


/**
 * Returns the start X position.
 *
 * @return {number} The start X position
 */

xgalaga.PathInfo.prototype.getStartX = function()
{
    return this.startX;
};


/**
 * Returns the start Y position.
 *
 * @return {number} The start Y position
 */

xgalaga.PathInfo.prototype.getStartY = function()
{
    return this.startY;
};


/**
 * Returns the path entry with the specified id.
 *
 * @param {number} entryId
 *            The entry id
 * @return {xgalaga.PathEntry} The path entry
 */

xgalaga.PathInfo.prototype.getEntry = function(entryId)
{
    return this.entries[entryId];
};
