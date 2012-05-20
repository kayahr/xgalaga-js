/**
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require xgalaga.js
 */

/**
 * Constructs a new game.
 *
 * @param {string} containerId
 *            The ID of the HTML container element
 * @param {boolean} autoStart
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

/** 
 * The ID of the HTML container element. 
 * @private 
 * @type {string} 
 */
xgalaga.Game.prototype.containerId;

/**
 * The HTML container element.
 * @private
 * @type {?Element} 
 */
xgalaga.Game.prototype.container = null;

/**
 * The game canvas.
 * @private
 * @type {?HTMLCanvasElement} 
 */
xgalaga.Game.prototype.canvas = null;

/**
 * The graphics context.
 * @private
 * @type {(!CanvasRenderingContext2D|!HTMLElement)} 
 */
xgalaga.Game.prototype.ctx;

/**
 * The screen width.
 * @private
 * @type {number} 
 */
xgalaga.Game.prototype.width = 0;

/**
 * The screen height.
 * @private
 * @type {number} 
 */
xgalaga.Game.prototype.height = 0;

/**
 * The render mode.
 * @private
 * @type {number} 
 */
xgalaga.Game.prototype.renderMode = xgalaga.RENDER_MODE_CANVAS;

/**
 * If game should start automatically after init.
 * @private
 * @type {boolean} 
 */
xgalaga.Game.prototype.autoStart = true;

/**
 * The game thread.
 * @private
 * @type {Function} 
 */
xgalaga.Game.prototype.gameThread = null;

/**
 * The game thread timer.
 * @private
 * @type {?number} 
 */
xgalaga.Game.prototype.timer = null;

/**
 * The star field.
 * @private
 * @type {!xgalaga.StarField} 
 */
xgalaga.Game.prototype.starField;

/**
 * The aliens.
 * @private
 * @type {!xgalaga.Aliens} 
 */
xgalaga.Game.prototype.aliens;

/**
 * The player.
 * @private
 * @type {!xgalaga.Player} 
 */
xgalaga.Game.prototype.player;

/**
 * The explosions.
 * @private
 * @type {!xgalaga.Explosions} 
 */
xgalaga.Game.prototype.explosions;

/**
 * The current level number.
 * @private
 * @type {number} 
 */
xgalaga.Game.prototype.levelNo = 0;

/**
 * The key down handler.
 * @private
 * @type {!function(!jQuery.event=)} 
 */
xgalaga.Game.prototype.keyDownHandler;

/**
 * The key up handler.
 * @private
 * @type {!function(!jQuery.event=)} 
 */
xgalaga.Game.prototype.keyUpHandler;

/**
 * The mouse down handler.
 * @private
 * @type {!function(!jQuery.event=)} 
 */
xgalaga.Game.prototype.mouseDownHandler;

/**
 * The mouse up handler.
 * @private
 * @type {!function(!jQuery.event=)} 
 */
xgalaga.Game.prototype.mouseUpHandler;

/**
 * If game has been paused.
 * @private
 * @type {boolean} 
 */
xgalaga.Game.prototype.paused = false;

/**
 * If game is over.
 * @private
 * @type {boolean} 
 */
xgalaga.Game.prototype.gameOver = true;

/**
 * The game-state label.
 * @private
 * @type {Element} 
 */
xgalaga.Game.prototype.stateLabel = null;

/**
 * The menu.
 * @private
 * @type {xgalaga.Menu} 
 */
xgalaga.Game.prototype.menu = null;

/**
 * The hud.
 * @private
 * @type {xgalaga.Hud} 
 */
xgalaga.Game.prototype.hud = null;

/**
 * If game has been initialized or not.
 * @private
 * @type {boolean}
 */
xgalaga.Game.prototype.initialized = false;

/**
 * Initializes the game.
 *
 * @private
 */
 
xgalaga.Game.prototype.init = function()
{
    var container, canvas, hud, menu, stateLabel;
    
    // Try to get container reference
    this.container = container = document.getElementById(this.containerId);
    
    // If not yet present then delay initialization
    if (!container)
    {
        window.setTimeout(this.init.bind(this), 100);
        return;
    }

    // Create the canvas
    switch (this.renderMode)
    {
        case xgalaga.RENDER_MODE_CANVAS:
            canvas = this.canvas = /** @type {HTMLCanvasElement} */ 
                document.createElement("canvas");
            container.appendChild(canvas);
            canvas.id = "gameCanvas";
            this.ctx = /** @type {!CanvasRenderingContext2D} */ 
                canvas.getContext("2d");
            break;
            
        default:
            this.ctx = container;
    }

    // Re-call resize method when window resizes
    // TODO
    jQuery(window).bind("resize", this.resize.bind(this));

    // Create game thread
    this.gameThread = this.run.bind(this);

    // Create keyboard listeners
    this.keyDownHandler = this.handleKeyDown.bind(this);
    this.keyUpHandler = this.handleKeyUp.bind(this);
    this.mouseDownHandler = this.handleMouseDown.bind(this);
    this.mouseUpHandler = this.handleMouseUp.bind(this);
    
    // Initialize the game size
    this.resize();

    // Create the game state label
    this.stateLabel = stateLabel = document.createElement("span");
    container.appendChild(stateLabel);
    stateLabel.id = "stateLabel";

    // Create the menu
    menu = this.menu = new xgalaga.Menu(this);
    container.appendChild(menu.getElement());

    // Create the HUD
    hud = this.hud = new xgalaga.Hud(this);
    container.appendChild(hud.getElement());

    // Perform game initialization
    this.starField = new xgalaga.StarField(this);
    this.aliens = new xgalaga.Aliens(this);
    this.player = new xgalaga.Player(this);
    this.explosions = new xgalaga.Explosions(this);

    // Start game with intro
    this.startIntro();

    // Mark game as initialized
    this.initialized = true;

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
 * Resets the game.
 */

xgalaga.Game.prototype.reset = function()
{
    this.gotoLevel(xgalaga.START_LEVEL);
};


/**
 * Goes to the specified level.
 *
 * @param {number} levelNo
 *            The number of the level to go to
 * @private
 */

xgalaga.Game.prototype.gotoLevel = function(levelNo)
{
    var player;

    this.hideStateLabel();
    this.levelNo = levelNo;
    this.aliens.init(levelNo);
    player = this.player;
    if (levelNo == 1)
    {
        this.hud.open();
        player.reset();
    }
    else
        player.nextLevel();
    this.hud.setLevel(levelNo);
    this.hud.setScore(player.getScore());
    this.hud.setShips(player.getShips());
    this.gameOver = false;
};

/**
 * Checks if game is initialized.
 *
 * @return {boolean} True if game is initialized, false if not
 */
xgalaga.Game.prototype.isInitialized = function()
{
    return this.initialized;
};

/**
 * Starts the game.
 */
xgalaga.Game.prototype.start = function()
{
    // Do nothing if game is not initialized yet
    if (!this.initialized) return;

    // Start the game thread
    if (!this.timer)
        this.timer = window.setInterval(this.gameThread, 33);

    // Install keyboard handlers
    jQuery(window).bind("keydown", this.keyDownHandler);
    jQuery(window).bind("keyup", this.keyUpHandler);
    jQuery(this.container).bind("mousedown", this.mouseDownHandler);
    jQuery(this.container).bind("mouseup", this.mouseUpHandler);
};

/**
 * Stops the game
 */
xgalaga.Game.prototype.stop = function()
{
    // Uninstall keyboard handlers
    jQuery(window).unbind("keydown", this.keyDownHandler);
    jQuery(window).unbind("keyup", this.keyUpHandler);     
    jQuery(this.container).unbind("mousedown", this.mouseDownHandler);     
    jQuery(this.container).unbind("mouseup", this.mouseUpHandler);     

    // Stop game thread
    if (this.timer)
    {
        window.clearInterval(this.timer);
        this.timer = null;
    }
};


/**
 * Checks if game has been stopped or is running
 */

xgalaga.Game.prototype.isPaused = function()
{
    return this.paused;
};


/**
 * Pauses the game
 */

xgalaga.Game.prototype.pause = function()
{
    if (!this.paused)
    {
        // Stop game thread
        if (this.timer)
        {
            window.clearTimeout(this.timer);
            this.timer = null;
        }

        this.paused = true;
    }
};


/**
 * Resumes the game
 */

xgalaga.Game.prototype.resume = function()
{
    if (this.paused && (this.gameOver || !this.menu.isOpen()))
    {
        // Start the game thread
        if (!this.timer)
            this.timer = window.setInterval(this.gameThread, 33);

        this.paused = false;
    }
};


/**
 * The game run thread.
 *
 * @private
 */
 
xgalaga.Game.prototype.run = function()
{
    var ctx, speed;

    this.starField.update();
    this.aliens.update();
    if (!this.gameOver)
    {
        this.player.update();
        this.explosions.update();
    }
    
    ctx = this.ctx;

    if (this.renderMode == xgalaga.RENDER_MODE_CANVAS)
    {
        ctx.clearRect(0, 0, this.width, this.height);
    }

    this.starField.render(ctx);
    this.aliens.render(ctx);
    if (!this.gameOver)
    {
        this.player.render(ctx);
        this.explosions.render(ctx);

        if (!this.aliens.getLiveCount())
        {
            this.starField.changeSpeed(1);
            speed = this.starField.getSpeed();
            if (speed == 2)
            {
                // TODO play_sound(SND_WARP);
                this.stateLabel.innerHTML = xgalaga.msgNextLevel.replace(
                    "%LEVEL%", "" + (this.levelNo + 1));
                this.hud.close();
                this.showStateLabel();
            }
            if (speed >= 120)
            {
                this.starField.setSpeed(-20);
            }
            else if (speed == 1)
            {
                this.hideStateLabel();
                this.hud.open();
                this.gotoLevel(++this.levelNo);
                this.starField.setSpeed(1);
            }
        }
    }
};


/**
 * Returns the screen width.
 *
 * @return {number} The screen width
 */

xgalaga.Game.prototype.getWidth = function()
{
    return this.width;
};


/**
 * Returns the screen height.
 *
 * @return {number} The screen height
 */

xgalaga.Game.prototype.getHeight = function()
{
    return this.height;
};


/**
 * Returns the render mode.
 * 
 * @return {number} The render mode
 */

xgalaga.Game.prototype.getRenderMode = function()
{
    return this.renderMode;
};


/**
 * Returns the aliens.
 *
 * @return {xgalaga.Aliens} The aliens
 */

xgalaga.Game.prototype.getAliens = function()
{
    return this.aliens;
};


/**
 * Returns the player.
 *
 * @return {xgalaga.Player} The player
 */

xgalaga.Game.prototype.getPlayer = function()
{
    return this.player;
};


/**
 * Returns the explosions.
 *
 * @return {xgalaga.Explosions} The explosions
 */

xgalaga.Game.prototype.getExplosions = function()
{
    return this.explosions;
};


/**
 * Returns the star field.
 *
 * @return {xgalaga.StarField} The star field
 */

xgalaga.Game.prototype.getStarField = function()
{
    return this.starField;
};


/**
 * Checks if control is in the specified controls array.
 *
 * @param {number} control
 *            The control to check
 * @param {Array} controls
 *            Controls array
 * @return {boolean} True if control is in the array, false if not
 * @private
 */

xgalaga.Game.prototype.isControl = function(control, controls)
{
    var i;

    for (i = controls.length - 1; i >= 0; i--)
        if (control == controls[i]) return true;
    return false;
};


/**
 * Handles the control down event.
 *
 * @param {number} control
 *            The control id
 * @return {boolean} True if event was handles, false if not
 *
 * @private
 */

xgalaga.Game.prototype.handleControlDown = function(control)
{
    // Controls when within menu
    if (this.menu.isOpen())
    {
        return false;
    }

    // Controls when playing
    if (!this.gameOver && !this.paused)
    {
        if (this.isControl(control, xgalaga.ctrlRight))
            this.player.startMoveRight();
        else if (this.isControl(control, xgalaga.ctrlLeft))
            this.player.startMoveLeft();
        else if (this.isControl(control, xgalaga.ctrlFire))
            this.player.startFire();
        else if (this.isControl(control, xgalaga.ctrlMenu))
            this.gotoMenu();
        else
            return false;
    }

    // Unhandled control
    else return false;

    return true;
};


/**
 * Handles the control up event.
 *
 * @param {number} control
 *            The control id
 * @return {boolean} True if event was handles, false if not
 *
 * @private
 */

xgalaga.Game.prototype.handleControlUp = function(control)
{
    // Controls when playing
    if (!this.menu.isOpen() && !this.gameOver && !this.paused)
    {
        if (this.isControl(control, xgalaga.ctrlRight))
            this.player.stopMoveRight();
        else if (this.isControl(control, xgalaga.ctrlLeft))
            this.player.stopMoveLeft();
        else if (this.isControl(control, xgalaga.ctrlFire))
            this.player.stopFire();
        else
            return false;
    }

    // Unhandled control
    else return false;

    return true;
};


/**
 * Handles the key down event.
 *
 * @param {!jQuery.event=} event
 *            The key down event
 * @private
 */

xgalaga.Game.prototype.handleKeyDown = function(event)
{
    if (this.handleControlDown(event.which) ||
        this.handleControlDown(0)) event.preventDefault();
};


/**
 * Handles the key up event.
 *
 * @param {!jQuery.event=} event
 *            The key down event
 * @private
 */

xgalaga.Game.prototype.handleKeyUp = function(event)
{
    if (this.handleControlUp(event.which) ||
        this.handleControlUp(0)) event.preventDefault();
};


/**
 * Handles the mouse down event.
 *
 * @param {!jQuery.event=} event
 *            The mouse down event
 * @private
 */

xgalaga.Game.prototype.handleMouseDown = function(event)
{
    if (this.handleControlDown(-1)) event.preventDefault();
};


/**
 * Handles the mouse up event.
 *
 * @param {!jQuery.event=} event
 *            The mouse up event
 * @private
 */

xgalaga.Game.prototype.handleMouseUp = function(event)
{
    if (this.handleControlUp(-1)) event.preventDefault();
};


/**
 * Ends the game.
 */

xgalaga.Game.prototype.endGame = function()
{
    var score;

    if (!this.gameOver)
    {
        this.gameOver = true;
        score = this.player.getScore();
        this.stateLabel.innerHTML = xgalaga.msgGameOver.replace("%SCORE%",
            xgalaga.formatNumber(score));
        this.showStateLabel();
        
        if (xgalaga.HighScores.getInstance().determineRank(score))
            window.setTimeout(this.newHighScore.bind(this), 500);
        else
            window.setTimeout(this.startIntro.bind(this), 500);
        this.hud.close();
    }
};


/**
 * Returns the HUD.
 *
 * @return {xgalaga.Hud} The HUD
 */

xgalaga.Game.prototype.getHud = function()
{
    return this.hud;
};


/**
 * Starts a new game.
 */

xgalaga.Game.prototype.newGame = function()
{
    //this.playSound(xgalaga.SND_LEVEL_UP);

    this.gameOver = true;
    this.menu.close();
    this.resume();
    this.destroyAll();
    this.stateLabel.innerHTML = xgalaga.msgNextLevel.replace("%LEVEL%", "1");
    this.showStateLabel();
    
    window.setTimeout(this.reset.bind(this), 2000);
};


/**
 * Plays an intro which is used as a background for the main menu.
 */

xgalaga.Game.prototype.startIntro = function()
{
    this.hideStateLabel();
    this.aliens.init(1);
    this.menu.open();
};


/**
 * Checks if the game is over.
 *
 * @return {boolean} True if game is over, false if not
 */

xgalaga.Game.prototype.isGameOver = function()
{
    return this.gameOver;
};


/**
 * Pauses the game and opens the menu.
 */

xgalaga.Game.prototype.gotoMenu = function()
{
    this.pause();
    this.hud.close();
    this.menu.open();
};


/**
 * Closes the menu and continues the game.
 */

xgalaga.Game.prototype.continueGame = function()
{
    this.menu.close();
    this.hud.open();
    this.resume();
};


/**
 * Destroys all items.
 */

xgalaga.Game.prototype.destroyAll = function()
{
    this.aliens.destroyAll();
};


/**
 * Records a new high score.
 *
 * @param {number} place
 *            The achieved place
 * @private
 */

xgalaga.Game.prototype.newHighScore = function(place)
{
    var message, rank, highScores, score;

    score = this.player.getScore();
    highScores = xgalaga.HighScores.getInstance();
    rank = highScores.determineRank(score);
    message = xgalaga.msgNewHighScore.replace("%SCORE%",
        xgalaga.formatNumber(score)).
        replace("%RANK%", "" + rank)
    xgalaga.onPrompt(xgalaga.msgNewHighScoreTitle, message,
        this.saveHighScore, this);
};


/**
 * Submits the high score name. This method must be called by the external
 * newHighScore
 *
 * @param {string} name
 *            The high score name
 * @private
 */

xgalaga.Game.prototype.saveHighScore = function(name)
{
    var highScores;
    
    if (name)
    {
        highScores = xgalaga.HighScores.getInstance();
        highScores.add(name, this.levelNo, this.player.getScore());
    }
    this.startIntro();
};


/**
 * Shows the game state label.
 *
 * @private
 */

xgalaga.Game.prototype.showStateLabel = function()
{
    this.stateLabel.className = "visible";
};


/**
 * Hides the game state label.
 *
 * @private
 */

xgalaga.Game.prototype.hideStateLabel = function()
{
    this.stateLabel.className = "hidden";
};
