/**
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @author Klaus Reimer (k@ailis.de)
 *
 * @require xgalaga.js
 */


/**
 * Constructs a new level.
 *
 * @param {Array} pathInfos
 *            The path infos
 * @param {Array} alienShapes
 *            The alien shapes
 * @param {Array} alienPaths
 *            The alien paths
 * @param {Array} alienEnterDelays
 *            The alien enter delays
 * @constructor
 * @class A level
 */

xgalaga.Level = function(pathInfos, alienShapes, alienPaths, alienEnterDelays)
{
    this.pathInfos = pathInfos;
    this.alienShapes = alienShapes;
    this.alienPaths = alienPaths;
    this.alienEnterDelays = alienEnterDelays;
};

/**
 * The path infos.
 * @private
 * @type {Array} 
 */
xgalaga.Level.prototype.pathInfos = null;

/**
 * The alien shapes.
 * @private
 * @type {Array} 
 */
xgalaga.Level.prototype.alienShapes = null;

/**
 * The alien paths.
 * @private
 * @type {Array} 
 */
xgalaga.Level.prototype.alienPaths = null;

/**
 * The alien enter delays.
 * @private
 * @type {Array} 
 */
xgalaga.Level.prototype.alienEnterDelays = null;


/**
 * Returns the shape for the specified alien.
 *
 * @param {number} alienId
 *            The ID of the alien
 * @return {number} The shape
 */

xgalaga.Level.prototype.getAlienShape = function(alienId)
{
    return this.alienShapes[alienId];
};


/**
 * Returns the path infos for the specified alien.
 *
 * @param {number} alienId
 *            The ID of the alien
 * @return {xgalaga.PathInfo} The path infos
 */

xgalaga.Level.prototype.getPathInfo = function(alienId)
{
    return this.pathInfos[this.alienPaths[alienId]];
};


/**
 * Returns the enter delay of the specified alien.
 *
 * @param {number} alienId
 *            The ID of the alien
 * @return {number} The enter delay
 */

xgalaga.Level.prototype.getAlienEnterDelay = function(alienId)
{
    return this.alienEnterDelays[alienId];
};


/**
 * Returns the path of the specified alien.
 *
 * @param {number} alienId
 *            The ID of the alien
 * @return {number} The alien path
 */

xgalaga.Level.prototype.getAlienPath = function(alienId)
{
    return this.alienPaths[alienId];
};
