/**
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require jade.js
 */

/**
 * Constructs a new instance of the highscores.
 * 
 * @constructor
 * @class The highscores.
 * 
 */
xgalaga.HighScores = function()
{
    this.scores = [];
    this.load();
};

/**
 * The singleton instance.
 * @private
 * @type {?xgalaga.HighScores} 
 */
xgalaga.HighScores.instance = null;

/**
 * Array with the scores (Entries:name,level,score).
 * @private
 * @type {!Array.<!{name:string,level:number,score:number}>} 
 */
xgalaga.HighScores.prototype.scores;

/**
 * The maximum number of entries in the high score list.
 * @type {number} 
 */
xgalaga.HighScores.prototype.entries = 5;

/**
 * Returns the singleton instance of the high scores list.
 * 
 * @return {!xgalaga.HighScores} The high scores
 */
xgalaga.HighScores.getInstance = function()
{
    if (!xgalaga.HighScores.instance) xgalaga.HighScores.instance = new xgalaga.HighScores();
    return xgalaga.HighScores.instance;
};

/**
 * Loads the high scores.
 * 
 * @private
 */
xgalaga.HighScores.prototype.load = function()
{
    var cookie, name, level, score, i;
  
    // TODO IMplement highscore storage.
    // Read high scores from mojo cookies if possible
//    if (window.Mojo && Mojo.Model && Mojo.Model.Cookie)
//        cookie = new Mojo.Model.Cookie("highscores").get();
/*
    if (cookie)
    {
        
        for (i = 0; i < this.entries; i++)
        {
            level = cookie["level" + i];
            if (!level) continue;
            name = cookie["name" + i];
            score = cookie["score" + i];
            this.scores.push({
                "name": name,
                "level": level,
                "score": score
            });
        }
    } else this.reset();
    */
};

/**
 * Saves the high scores.
 */
xgalaga.HighScores.prototype.save = function()
{
    var data, max, entry, i;
    
    data = {};
    for (i = 0, max = this.scores.length; i < max; i++)
    {
        entry = this.scores[i];
        data["name" + i] = entry["name"];
        data["level" + i] = entry["level"];
        data["score" + i] = entry["score"];
    }

    // Write to Mojo cookie if available
    // TODO Implement highscore saving
    
    //if (window.Mojo && Mojo.Model && Mojo.Model.Cookie)
      //  new Mojo.Model.Cookie("highscores").put(data);
};


/**
 * Resets the high scores.
 */

xgalaga.HighScores.prototype.reset = function()
{
    this.scores = [
        { "name": "-", "level": 1, "score": 0 },
        { "name": "-", "level": 1, "score": 0 },
        { "name": "-", "level": 1, "score": 0 },
        { "name": "-", "level": 1, "score": 0 },
        { "name": "-", "level": 1, "score": 0 },
    ];
};


/**
 * Returns the rank in the high score list the specified score would get.
 * Returns 0 if this score is not good enough to be recorded in the list at
 * all.
 * 
 * @param {number} score
 *             The score
 * @return {number} The rank or 0 if not in the list.
 */

xgalaga.HighScores.prototype.determineRank = function(score)
{
    var rank, entries, entry;
    
    for (rank = 0, entries = this.scores.length; rank < entries; rank++)
    {
        entry = this.scores[rank];
        if (score > entry["score"]) return rank + 1;
    }
    if (rank < this.entries) return rank + 1;
    return 0;
};


/**
 * Adds a new high score entry.
 * 
 * @param {string} name
 *            The name to add
 * @param {number} level
 *            The level to add
 * @param {number} score
 *            The score to add
 */

xgalaga.HighScores.prototype.add = function(name, level, score)
{
    var rank;
    
    // Get the rank in the list
    rank = this.determineRank(score);
    
    // If no rank then do nothing
    if (!rank) return;
    
    // Insert the new entry
    this.scores.splice(rank - 1, 0, {
        "name": name,
        "level": level,
        "score": score
    });
    
    // Truncate the list if needed
    if (this.scores.length > this.entries)
        this.scores = this.scores.slice(0, this.entries);
    
    this.save();
};


/**
 * Returns the scores.
 * 
 * @return {Array} The scores
 */

xgalaga.HighScores.prototype.getScores = function()
{
    return this.scores;
};
