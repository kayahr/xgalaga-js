/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the Hud class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new hud
 * 
 * @constructor
 * @class The hud
 */

xgalaga.Hud = function(game)
{
    var root, value, topBar, display;
    
    this.game = game;
    
    // Create the root element
    root = this.element = document.createElement("div");
    root.id = "hud";
    
    // Create the top HUD bar
    topBar = document.createElement("div");
    root.appendChild(topBar);
    topBar.className = "bar";
    topBar.id = "topBar";
    
    // Create the level box
    display = document.createElement("div");
    topBar.appendChild(display);
    display.id = "levelDisplay";
    display.className = "display";
    display.appendChild(document.createTextNode(xgalaga.msgLevel));
    value = this.levelElement = document.createElement("span");
    display.appendChild(value);
    value.id = "levelValue";
    value.className = "value";
    value.appendChild(document.createTextNode(1));

    // Create the score box
    display = document.createElement("div");
    topBar.appendChild(display);
    display.id = "scoreDisplay";
    display.className = "display";
    display.appendChild(document.createTextNode(xgalaga.msgScore));
    value = this.scoreElement = document.createElement("span");
    display.appendChild(value);
    value.id = "scoreValue";
    value.className = "value";
    value.appendChild(document.createTextNode(0));

    // Create the ships display
    display = document.createElement("div");
    topBar.appendChild(display);
    display.id = "shipsDisplay";
    display.className = "display";
    display.appendChild(document.createTextNode(xgalaga.msgShips));
    value = this.shipsElement = document.createElement("span");
    display.appendChild(value);
    value.id = "shipsValue";
    value.className = "value";
    value.appendChild(document.createTextNode(0));
};

/** The game reference. @private @type {xgalaga.Game} */
xgalaga.Hud.prototype.game = null;

/** The HTML element. @private @type {HTMLElement} */
xgalaga.Hud.prototype.element = null;

/** If hud is open or not. @private @type {Boolean} */
xgalaga.Hud.prototype.opened = false;

/** The ships HTML element. @private @type {HTMLElement} */
xgalaga.Hud.prototype.shipsElement = null;

/** The level HTML element. @private @type {HTMLElement} */
xgalaga.Hud.prototype.levelElement = null;

/** The score HTML element. @private @type {HTMLElement} */
xgalaga.Hud.prototype.scoreElement = null;


/**
 * Opens the hud screen.
 */

xgalaga.Hud.prototype.open = function()
{
    this.element.className = "visible";
    this.opened = true;
};


/**
 * Closes the hud screen.
 */

xgalaga.Hud.prototype.close = function()
{
    this.element.className = "";
    this.opened = false;
};


/**
 * Checks if hud is open.
 * 
 * @return {Boolean} True if hud is open, false if not
 */

xgalaga.Hud.prototype.isOpen = function()
{
    return this.opened;
};


/**
 * Returns the root HTML element of the hud screen.
 * 
 * @return {HTMLElement} The root HTML element
 */

xgalaga.Hud.prototype.getElement = function()
{
    return this.element;
};


/**
 * Sets the level display value.
 * 
 * @param {Number} level
 *            The level display value to set
 */

xgalaga.Hud.prototype.setLevel = function(level)
{
    this.levelElement.innerHTML = level;
};


/**
 * Sets the score display value.
 * 
 * @param {Number} score
 *            The score display value to set
 */

xgalaga.Hud.prototype.setScore = function(score)
{
    this.scoreElement.innerHTML = xgalaga.formatNumber(score);
};


/**
 * Sets the ships display value.
 *
 * @param {Number} ships
 *            The ships display value to set
 */

xgalaga.Hud.prototype.setShips = function(ships)
{
    this.shipsElement.innerHTML = ships;
};
