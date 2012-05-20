/**
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require xgalaga.js
 */

/**
 * Constructs a new menu screen
 * 
 * @param {!xgalaga.Game} game
 *            The game.
 * @constructor
 * @class The menu screen
 */

xgalaga.Menu = function(game)
{
    var root, e, buttons;
    
    // Remember the game reference
    this.game = game;
    
    // Create the root element
    root = this.element = document.createElement("div");
    root.id = "mainMenu";
    
    // Create the title element
    e = document.createElement("div");
    root.appendChild(e);
    e.id = "title";
    
    // Create the buttons container
    buttons = this.buttons = document.createElement("div");
    root.appendChild(buttons);
    buttons.id = "buttons";
    
    // Create the "new game" button
    e = document.createElement("div");
    buttons.appendChild(e);
    e.id = "newGameButton";
    e.className = "button";
    e.onclick = function() { game.newGame.call(game); };
    
    // Create the "Continue" button
    e = this.continueButton = document.createElement("div");
    buttons.appendChild(e);
    e.id = "continueGameButton";
    e.className = "button";
    e.onclick = function() { game.continueGame.call(game); };    
};

/**
 * The game reference.
 * @private
 * @type {!xgalaga.Game} 
 */
xgalaga.Menu.prototype.game;

/**
 * The HTML element.
 * @private
 * @type {!Element} 
 */
xgalaga.Menu.prototype.element;

/**
 * If menu is open or not.
 * @private
 * @type {boolean} 
 */
xgalaga.Menu.prototype.opened = false;

/**
 * The buttons container.
 * @private
 * @type {!Element} 
 */
xgalaga.Menu.prototype.buttons;

/**
 * The continue button.
 * @private
 * @type {!Element} 
 */
xgalaga.Menu.prototype.continueButton;


/**
 * Opens the menu screen.
 */

xgalaga.Menu.prototype.open = function()
{
    if (this.game.isGameOver())
        this.continueButton.className = "hidden-button button";
    else
        this.continueButton.className = "button";
    
    this.element.className = "visible";
    this.opened = true;
};


/**
 * Closes the menu screen.
 */

xgalaga.Menu.prototype.close = function()
{
    this.element.className = "";
    this.opened = false;
    
};


/**
 * Checks if menu is open.
 * 
 * @return {boolean} True if menu is open, false if not
 */

xgalaga.Menu.prototype.isOpen = function()
{
    return this.opened;
};


/**
 * Returns the root HTML element of the menu screen.
 * 
 * @return {!Element} The root HTML element
 */
xgalaga.Menu.prototype.getElement = function()
{
    return this.element;
};
