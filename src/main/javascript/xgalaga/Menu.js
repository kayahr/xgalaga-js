/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the Menu class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new menu screen
 * 
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
    
    // Create preferences button
    if (xgalaga.onHelp)
    {
        e = document.createElement("div");
        buttons.appendChild(e);
        e.id = "helpButton";
        e.className = "button";
        e.onclick = xgalaga.onHelp;
    }    

    // Create preferences button
    if (xgalaga.onPreferences)
    {
        e = document.createElement("div");
        buttons.appendChild(e);
        e.id = "preferencesButton";
        e.className = "button";
        e.onclick = xgalaga.onPreferences;
    }    
};

/** The game reference. @private @type {xgalaga.Game} */
xgalaga.Menu.prototype.game = null;

/** The HTML element. @private @type {HTMLElement} */
xgalaga.Menu.prototype.element = null;

/** If menu is open or not. @private @type {Boolean} */
xgalaga.Menu.prototype.opened = false;

/** The buttons container. @private @type {HTMLElement} */
xgalaga.Menu.prototype.buttons = null;

/** The continue button. @private @type {HTMLElement} */
xgalaga.Menu.prototype.continueButton = null;


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
 * @return {Boolean} True if menu is open, false if not
 */

xgalaga.Menu.prototype.isOpen = function()
{
    return this.opened;
};


/**
 * Returns the root HTML element of the menu screen.
 * 
 * @return {HTMLElement} The root HTML element
 */

xgalaga.Menu.prototype.getElement = function()
{
    return this.element;
};
