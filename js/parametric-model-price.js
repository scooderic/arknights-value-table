/**
 * <p>寻访参数模型商店性价比表。</p>
 * <p>为了偷懒，item-value-table.js 直接拷贝的 index.js 的内容。</p>
 * @author Lyric
 * @since 2020-05-05
 */
(function ($) {
    "use strict";
    $(function ($_$) {
        // 性价比结果表
        var costEffectiveTable = [];
        for (var i09 = 0; i09 < ITEM_VALUE_TABLE.length; i09 ++) {
            var itemValueObj = ITEM_VALUE_TABLE[i09];
            var parametricModelPriceObj = db.selectParametricModelPrice(itemValueObj.itemId);
            if (parametricModelPriceObj) { // 基础作战记录什么的，没有
                var costEff = itemValueObj.value / parametricModelPriceObj.price;
                var costEffObj = {
                    itemId: itemValueObj.itemId,
                    name: itemValueObj.name,
                    value: itemValueObj.value,
                    price: parametricModelPriceObj.price,
                    costEffective: costEff
                };
                costEffectiveTable.push(costEffObj);
            }
        }
        // 排序
        var sortFunc = function (a, b) {
            if (a.costEffective > b.costEffective) {
                return -1;
            } else if (a.costEffective === b.costEffective) {
                return 0;
            } else {
                return 1;
            }
        };
        costEffectiveTable.sort(sortFunc);
        // DOM 操作
        for (var j00 = 0; j00 < costEffectiveTable.length; j00 ++) {
            var item = costEffectiveTable[j00];
            $("#output").append("<li>" + item.name + "：" + item.costEffective.toFixed(2) + "</li>");
        }
    });
})(jQuery);
