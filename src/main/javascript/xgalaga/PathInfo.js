/**
 * $Id$
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the xgalaga.PathInfo class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new path info.
 *
 * @param {Number} startX
 *            The start X position
 * @param {Number} startY
 *            The start Y position
 * @param {Array} entries
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

/** The start X position. @private @type {Number} */
xgalaga.PathInfo.prototype.startX = null;

/** The start Y position. @private @type {Number} */
xgalaga.PathInfo.prototype.startY = null;

/** The path entries. @private @type {Array} */
xgalaga.PathInfo.prototype.entries = null;


/**
 * Returns the start X position.
 *
 * @return {Number} The start X position
 */

xgalaga.PathInfo.prototype.getStartX = function()
{
    return this.startX;
};


/**
 * Returns the start Y position.
 *
 * @return {Number} The start Y position
 */

xgalaga.PathInfo.prototype.getStartY = function()
{
    return this.startY;
};


/**
 * Returns the path entry with the specified id.
 *
 * @param {Number} entryId
 *            The entry id
 * @return {xgalaga.PathEntry} The path entry
 */

xgalaga.PathInfo.prototype.getEntry = function(entryId)
{
    return this.entries[entryId];
};
