/**
 * Converts string to title case
 * Example: "to-title" => "To-Title"
 * Usage: "to-title".toTitleCase()
 */
String.prototype.toTitleCase = function () {
    return this.replace(
        /([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

module.exports = String
