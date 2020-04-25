/**
 * @since 2020-04-25
 */
(function ($) {
    "use strict";
    $(function ($_$) {
        // 蓝材料们
        var valuableMaterials = [
            "30013",
            "30063",
            "30033",
            "30023",
            "30043",
            "30053",
            "30073",
            "30083",
            "30093",
            "30103",
            "31013",
            "31023"
        ];
        // 素材价值 V1
        // 该素材最低耗体图的单件平均耗体的以 10 为底的对数
        var materialValueV1 = function () {
            var coll = [];
            for (var i00 = 0; i00 < valuableMaterials.length; i00 ++) {
                var mat = valuableMaterials[i00];
            }
            console.log(coll);
        };

        materialValueV1();




























        !($("body").append("<p id='p1'><span>p</span></p>"));
        !($("#p1").append("<span>span</span>"));
    });
})(window.jQuery);
