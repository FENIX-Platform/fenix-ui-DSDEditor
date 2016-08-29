define([
],
function () {
    var ColumnIDGenerator = function () {
    };
    ColumnIDGenerator.prototype.generate = function (columns, newCol) {
        var type = "OTHER";
        if (newCol.key)
            type = "DIMENSION";
        else if (newCol.subject == 'value')
            type = "VALUE";
        return this._generate(columns, type);
    }

    ColumnIDGenerator.prototype._generate = function (columns, type) {
        if (!columns)
            return "";
        var id = type.toUpperCase();
        var nbr = 0;

        var found = true;
        while (found) {
            found = false;
            var newId = id + "" + nbr;
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].id == newId) {
                    found = true;
                    nbr++;
                    break;
                }
            }
        }

        
        return id + "" + nbr;
    }

    
    return ColumnIDGenerator;
});