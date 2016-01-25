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

        /*for (var i = 0; i < columns.length; i++) {
            if (columns[i].id.toUpperCase().indexOf(id + "" + nbr) == 0) {
                //There is another column starting with the sameID
                //check the length
                if (id.length == columns[i].id.length) {
                    //there is a column with the same id, append a number
                    nbr = 1;
                }
                else {
                    //it is longer, get the appended number
                    var tmpNbr = columns[i].id.substring(id.length, columns[i].id.length);
                    if (tmpNbr > nbr) nbr = tmpNbr;
                }
            }
        }

        if (nbr != 0) {
            nbr++;
            id = id + "" + nbr;
        }*/
        return id + "" + nbr;
    }

    //ColumnIDGenerator.prototype.generate = function (columns, colIdx) {
    //    if (!columns)
    //        return "";
    //    var id = columns[colIdx].dataType.toUpperCase();

    //    var nbr = 0;
    //    for (var i = 0; i < columns.length; i++) {
    //        if (i != colIdx) {
    //            if (columns[i].id.toUpperCase().indexOf(id) == 0) {
    //                //There is another column starting with the sameID
    //                //check the length
    //                if (id.length == columns[i].id.length) {
    //                    //there is a column with the same id, append a number
    //                    nbr = 1;
    //                }
    //                else {
    //                    //it is longer, get the appended number
    //                    var tmpNbr = columns[i].id.substring(id.length, columns[i].id.length);
    //                    if (tmpNbr > nbr) nbr = tmpNbr;
    //                }
    //            }
    //        }
    //    }

    //    if (nbr != 0) {
    //        nbr++;
    //        id = id + "" + nbr;
    //    }
    //    return id;
    //}

    return ColumnIDGenerator;
});