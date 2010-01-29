/**
 * $Id$
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the xgalaga.Star class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new star.
 *
 * @param {HTMLElement} root
 *            The root HTML element
 * @constructor
 * @class A star
 */

xgalaga.Star = function(root)
{
    var e, s;
    
    e = this.element = document.createElement("div");
    root.appendChild(e);
    s = e.style;
    this.speed = parseInt(Math.random() * 3) + 1;
    this.randomize();
    s.top = (this.y = Math.random() * e.offsetParent.offsetHeight) + "px";    
    s.width = "1px";
    s.height = "1px";
    s.position = "absolute";
};

/** The possible star colors. @private @type {Array} */
xgalaga.Star.COLORS = [ "#fff", "#0f0", "#0ff", "#f00", "#ff0" ];

/** The HTML element. @private @type {HTMLElement} */
xgalaga.Star.prototype.element = null;

/** The X coordinate of the star. @private @type {Number} */
xgalaga.Star.prototype.x = null;

/** The X coordinate of the star. @private @type {Number} */
xgalaga.Star.prototype.y = null;

/** The X coordinate of the star. @private @type {Number} */
xgalaga.Star.prototype.speed = null;


/**
 * Creates a new star with random data for the specified screen size.
 *
 * @param {Number} width
 *            The screen width
 * @param {Number} height
 *            The screen height
 * @private
 */
 
xgalaga.Star.prototype.randomize = function()
{
    var colors, e, s;
    
    e = this.element;
    s = e.style;
    colors = xgalaga.Star.COLORS;
    s.backgroundColor = colors[parseInt(Math.random() *
        colors.length)]
    s.left = (this.x = Math.random() * e.offsetParent.offsetWidth) + "px";    
};


/**
 * Updates the star with the specified star speed. If the star reaches the
 * bottom of the screen then it is randomized again so a new star comes
 * in from the top.
 *
 * @param {Number} starSpeed
 *            The star speed
 */
 
xgalaga.Star.prototype.update = function(starSpeed)
{
    var y, height, e;
    
    e = this.element;
    height = e.offsetParent.offsetHeight;
    y = this.y += this.speed * ((starSpeed < 20) ? Math.abs(starSpeed) : 20);
    if (y >= height)
    {
        this.randomize();
        y = (this.y -= height + starSpeed);        
    }
    e.style.top = y + "px";
};

