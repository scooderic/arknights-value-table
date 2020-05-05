var db = {
    selectItem: function (_itemId) {
        if (_items) {
            for (var _i = 0; _i < _items.length; _i ++) {
                var _item = _items[_i];
                if (_itemId === _item.itemId) {
                    return _item;
                }
            }
        }
    },
    selectStage: function (_stageId) {
        if (_stages) {
            for (var _i = 0; _i < _stages.length; _i ++) {
                var _stage = _stages[_i];
                if (_stageId === _stage.stageId) {
                    return _stage;
                }
            }
        }
    },
    selectZone: function (_zoneId) {
        if (_zones) {
            for (var _i = 0; _i < _zones.length; _i ++) {
                var _zone = _zones[_i];
                if (_zoneId === _zone.zoneId) {
                    return _zone;
                }
            }
        }
    },
    selectMatrix: function (_stageId) {
        if (_matrix) {
            for (var _i = 0; _i < _matrix.length; _i ++) {
                var _mtrx = _matrix[_i];
                if (_stageId === _mtrx.stageId) {
                    return _mtrx;
                }
            }
        }
    },
    selectParametricModelPrice: function (_itemId) {
        if (_parametricModelPrices) {
            for (var _i = 0; _i < _parametricModelPrices.length; _i ++) {
                var _priceObj = _parametricModelPrices[_i];
                if (_itemId === _priceObj.itemId) {
                    return _priceObj;
                }
            }
        }
    }
};
