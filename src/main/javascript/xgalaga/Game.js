/**
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require xgalaga.js
 */

/**
 * Constructs a new game.
 *
 * @param {!HTMLElement} container
 *            The main game HTML element.
 * @constructor
 * @class
 * The main class of the game.
 */
xgalaga.Game = function(container)
{
    this.container = container;
    this.init();
};

/**
 * The HTML container element.
 * @private
 * @type {!HTMLElement} 
 */
xgalaga.Game.prototype.container;

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
xgalaga.Game.prototype.renderMode = xgalaga.RENDER_MODE_HTML;

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
 * If we are in menu mode.
 * @private
 * @type {boolean} 
 */
xgalaga.Game.prototype.menu = true;

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
    var container, canvas, hud, stateLabel;
    
    // Try to get container reference
    container = /** @type {!HTMLElement} */ jQuery(".output", this.container)[0];
   
    canvas = this.canvas = /** @type {HTMLCanvasElement} */ 
        document.createElement("canvas");
    container.appendChild(canvas);
    canvas.className = "canvas";
    if (canvas["getContext"])
    {
        this.renderMode = xgalaga.RENDER_MODE_CANVAS;
        this.ctx = /** @type {!CanvasRenderingContext2D} */ 
            canvas.getContext("2d");
    }
    else
    {
        this.renderMode = xgalaga.RENDER_MODE_HTML;
        this.ctx = container;
    }

    // Re-call resize method when window resizes
    jQuery(window).bind("resize", this.resize.bind(this));

    // Create game thread
    this.gameThread = this.run.bind(this);

    // Create keyboard listeners
    this.keyDownHandler = this.handleKeyDown.bind(this);
    this.keyUpHandler = this.handleKeyUp.bind(this);
    
    // Initialize the game size
    this.resize();

    // Create the game state label
    this.stateLabel = stateLabel = document.createElement("span");
    container.appendChild(stateLabel);
    stateLabel.id = "stateLabel";

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

    container = jQuery(".output", this.container);
    canvas = this.canvas;
    width = this.width = +container.width();
    height = this.height = +container.height();
    
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
    jQuery(document).bind("keydown", this.keyDownHandler);
    jQuery(document).bind("keyup", this.keyUpHandler);
};

/**
 * Stops the game
 */
xgalaga.Game.prototype.stop = function()
{
    // Uninstall keyboard handlers
    jQuery(document).unbind("keydown", this.keyDownHandler);
    jQuery(document).unbind("keyup", this.keyUpHandler);     

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
    if (this.paused && (this.gameOver || !this.menu))
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
                this.playSound("warp");
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
 * Handles the key down event.
 *
 * @param {!jQuery.event=} event
 *            The key down event
 * @private
 */
xgalaga.Game.prototype.handleKeyUp = function(event)
{
    var key;
    
    key = event.which;

    // Controls when playing
    if (!this.menu && !this.gameOver && !this.paused)
    {
        if (key == 39)
            this.player.stopMoveRight();
        else if (key == 37)
            this.player.stopMoveLeft();
        else if (key == 32)
            this.player.stopFire();
        else            
            return;
    }

    // Unhandled control
    else return;
    
    event.preventDefault();
};


/**
 * Handles the key up event.
 *
 * @param {!jQuery.event=} event
 *            The key down event
 * @private
 */

xgalaga.Game.prototype.handleKeyDown = function(event)
{
    var key;
    
    key = event.which;
    
    // Controls when within menu
    if (this.menu)
    {
        if (key == 32)
            this.newGame();
        else
            return;
    }
    
    // Controls when paused
    else if (this.paused)
    {
        if (key == 80)
            this.resume();
        else
            return;
    }
    
    // Controls when playing
    else if (!this.gameOver)
    {
        if (key == 39)
            this.player.startMoveRight();
        else if (key == 37)
            this.player.startMoveLeft();
        else if (key == 32)
            this.player.startFire();
        else if (key == 80)
            this.pause();
        else if (key == 81)
            this.player.endGame();
        else
            return;
    }

    // Unhandled control
    else return;

    event.preventDefault();
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
        
//        if (xgalaga.HighScores.getInstance().determineRank(score))
  //          window.setTimeout(this.newHighScore.bind(this), 500);
    //    else
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
    this.gameOver = true;
    this.hideMenu();
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
    this.showMenu();
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
    this.showMenu();
};

/**
 * Closes the menu and continues the game.
 */
xgalaga.Game.prototype.continueGame = function()
{
    this.hideMenu();
    this.hud.open();
    this.resume();
};

/**
 * Shows the menu.
 * @private
 */
xgalaga.Game.prototype.showMenu = function()
{
    if (this.menu) return;
    this.menu = true;
    jQuery(".menu", this.container).removeClass("hidden");
};

/**
 * Hides the menu.
 * @private
 */
xgalaga.Game.prototype.hideMenu = function()
{
    if (!this.menu) return;
    this.menu = false;
    jQuery(".menu", this.container).addClass("hidden");
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

/**
 * Plays a sound.
 * 
 * @param {string} sound
 *            The sound to play.
 */
xgalaga.Game.prototype.playSound = function(sound)
{
    var e, audio;
    
    e = document.getElementById(sound + "-sound");
    if (!e) return;
    audio = (/** @type {!HTMLMediaElement} */ e.cloneNode(true));
    e = e.cloneNode(true);
    if (audio["play"]) audio.play();
};
