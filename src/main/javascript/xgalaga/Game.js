/**
 * $Id$
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the xgalaga.Game class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new game.
 *
 * @param {HTMLElement} containerId
 *            The ID of the HTML container element
 * @param {Boolean} autoStart
 *            If game should start automatically after initialization.
 *            This parameter is optional and defaults to true
 * @constructor
 * @class A game
 */

xgalaga.Game = function(containerId, autoStart)
{
    this.containerId = containerId;
    if (autoStart === false) this.autoStart = false;
    this.init();
};

/** The ID of the HTML container element. @private @type {String} */
xgalaga.Game.prototype.containerId = null;

/** The HTML container element. @private @type {HTMLElement} */
xgalaga.Game.prototype.container = null;

/** If game should start automatically after init. @private @type {Boolean} */
xgalaga.Game.prototype.autoStart = true;

/** The game thread. @private @type {Object} */
xgalaga.Game.prototype.thread = null;

/** The star field. @private @type {xgalaga.StarField} */
xgalaga.Game.prototype.starField = null;

/** The aliens. @private @type {xgalaga.Aliens} */
xgalaga.Game.prototype.aliens = null;

/** The current level number. @private @type {Number} */
xgalaga.Game.prototype.levelNo = null;


/**
 * Initializes the game.
 *
 * @private
 */
 
xgalaga.Game.prototype.init = function()
{
    var container;
    
    // Try to get container reference
    this.container = container = document.getElementById(this.containerId);
    
    // If not yet present then delay initialization
    if (!container)
    {
        this.init.bind(this).delay(0.1);
        return;
    }

    // Perform game initialization
    this.starField = new xgalaga.StarField(container);
    this.aliens = new xgalaga.Aliens(container);

    // Go to starting level
    this.gotoLevel(xgalaga.START_LEVEL);
    
    // Auto-start the game if needed
    if (this.autoStart) this.start();
};


/**
 * Goes to the specified level.
 *
 * @param {Number} levelNo
 *            The number of the level to go to
 * @private
 */

xgalaga.Game.prototype.gotoLevel = function(levelNo)
{
    this.levelNo = levelNo;
    this.aliens.init(levelNo);
};


/**
 * Starts the game.
 */
 
xgalaga.Game.prototype.start = function()
{
    var game;
    
    game = this;
    this.thread = setInterval(function() { game.run(); }, 33);
};


/**
 * Stops the game
 */
 
xgalaga.Game.prototype.stop = function()
{
    clearInterval(this.thread);
    this.thread = null;
};


/**
 * The game run thread.
 *
 * @private
 */
 
xgalaga.Game.prototype.run = function()
{
    this.starField.update();
    this.aliens.update(this.levelNo);
};

