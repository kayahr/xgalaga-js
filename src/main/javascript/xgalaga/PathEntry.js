/**
 * $Id$
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the xgalaga.PathEntry class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new path entry.
 *
 * @param {Number} direction
 *            The flight direction (One of xgalaga.DIR_*)
 * @param {Number} duration
 *            The flight duration
 * @constructor
 * @class A path entry
 */

xgalaga.PathEntry = function(direction, duration)
{
    this.direction = direction;
    this.duration = duration;
};

/** The flight direction (One of xgalaga.DIR_*) . @private @type {Number} */
xgalaga.PathEntry.prototype.direction = null;

/** The flight duration. @private @type {Number} */
xgalaga.PathEntry.prototype.duration = null;


/**
 * Returns the flight direction. This is one of the xgalaga.DIR_* constants.
 *
 * @return {Number} The flight direction
 */

xgalaga.PathEntry.prototype.getDirection = function()
{
    return this.direction;
};


/**
 * Returns the flight duration.
 *
 * @return {Number} The flight duration
 */

xgalaga.PathEntry.prototype.getDuration = function()
{
    return this.duration;
};
