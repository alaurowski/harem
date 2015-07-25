var uniqueItems = function (data, key, subkey) {
    var result = [];

    for (var i = 0; i < data.length; i++) {
        var value = data[i][key];

        if (subkey)
            value = value[subkey];

        if (result.indexOf(value) == -1 && value) {
            result.push(value);
        }

    }
    return result;
};

var uniqueArrayItems = function (data, key, subkey) {
    var result = [];

    for (var i = 0; i < data.length; i++) {
        var value = data[i][key];

        if (value) {
            for (sk in value) {

                var subarrayVal = value[sk];

                if (subkey)
                    subarrayVal = subarrayVal[subkey];

                if (result.indexOf(subarrayVal) == -1 && subarrayVal) {
                    result.push(subarrayVal);
                }
            }
        }

    }
    return result;
};