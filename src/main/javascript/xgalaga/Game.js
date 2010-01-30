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

/** The game canvas. @private @type {HTMLCanvasElement} */
xgalaga.Game.prototype.canvas = null;

/** The graphics context. @private @type {Object} */
xgalaga.Game.prototype.ctx = null;

/** The screen width. @private @type {Number} */
xgalaga.Game.prototype.width = null;

/** The screen height. @private @type {Number} */
xgalaga.Game.prototype.height = null;

/** The render mode. @private @type {Number} */
xgalaga.Game.prototype.renderMode = xgalaga.RENDER_MODE_HTML;

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
    var container, canvas;
    
    // Try to get container reference
    this.container = container = document.getElementById(this.containerId);
    
    // If not yet present then delay initialization
    if (!container)
    {
        this.init.bind(this).delay(0.1);
        return;
    }

    // Create the canvas
    switch (this.renderMode)
    {
        case xgalaga.RENDER_MODE_CANVAS:
            canvas = this.canvas = document.createElement("canvas");
            container.appendChild(canvas);
            canvas.id = "gameCanvas";
            this.ctx = canvas.getContext("2d");
            break;
            
        default:
            this.ctx = container;
    }

    // Re-call resize method when window resizes
    Event.observe(window, "resize", this.resize.bindAsEventListener(this));
    
    // Initialize the game size
    this.resize();

    // Perform game initialization
    this.starField = new xgalaga.StarField(this);
    this.aliens = new xgalaga.Aliens(this);

    // Go to starting level
    this.gotoLevel(xgalaga.START_LEVEL);
    
    // Auto-start the game if needed
    if (this.autoStart) this.start();
};


/**
 * This method must be called when the size of the output container has been
 * resized. It updates the internal HTML elements which are located in this
 * output container.
 */

xgalaga.Game.prototype.resize = function()
{
    var container, width, height, canvas;

    container = this.container;
    canvas = this.canvas;
    width = this.width = container.offsetWidth;
    height = this.height = container.offsetHeight;
    
    if (this.renderMode == xgalaga.RENDER_MODE_CANVAS)
    {
        canvas.width = width;
        canvas.height = height;
    }
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
    var ctx;

    this.starField.update();
    this.aliens.update(this.levelNo);

    ctx = this.ctx;

    if (this.renderMode == xgalaga.RENDER_MODE_CANVAS)
    {
        ctx.clearRect(0, 0, this.width, this.height);
    }

    this.starField.render(ctx);
    this.aliens.render(ctx);
};


/**
 * Returns the screen width.
 *
 * @return {Number} The screen width
 */

xgalaga.Game.prototype.getWidth = function()
{
    return this.width;
};


/**
 * Returns the screen height.
 *
 * @return {Number} The screen height
 */

xgalaga.Game.prototype.getHeight = function()
{
    return this.height;
};


/**
 * Returns the render mode.
 * 
 * @return {Number} The render mode
 */

xgalaga.Game.prototype.getRenderMode = function()
{
    return this.renderMode;
};