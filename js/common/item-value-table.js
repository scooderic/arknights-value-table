// 龙门币因子，每 100 龙门币的价值
var lmd100Value = 30 * 100 / 7500 / 3; // 三分之一 CE-5 倍率
// 中级作战记录价值因子
var expCard2Value = 30 * 1000 / 7400 / 3; // 三分之一 LS-5 倍率
// 高级作战记录价值
var expCard3Value = 2 * expCard2Value;
// 初级作战记录价值
var expCard1Value = 0.4 * expCard2Value;
// 基础作战记录价值
var expCard0Value = 0.2 * expCard2Value;
// 蓝材料们才参与基础运算，其余的材料价值基于蓝材料
var valuableItems = [
    "30013", // 固源岩组
    "30063", // 全新装置
    "30033", // 聚酸酯组
    "30023", // 糖组
    "30043", // 异铁组
    "30053", // 酮凝集组
    "30073", // 扭转醇
    "30083", // 轻锰矿
    "30093", // 研磨石
    "30103", // RMA70-12
    "31013", // 凝胶
    "31023" // 炽合金
];
// 绿材料
var greenItems = [
    "30012", // 固源岩
    "30062", // 装置
    "30032", // 聚酸酯
    "30022", // 糖
    "30042", // 异铁
    "30052" // 酮凝集
];
// 灰材料
var greyItems = [
    "30011", // 源岩
    "30061", // 破损装置
    "30031", // 酯原料
    "30021", // 代糖
    "30041", // 异铁碎片
    "30051" // 双酮
];
// 紫材料
var purpleItems = [
    "30014", // 提纯源岩
    "30064", // 改量装置
    "30034", // 聚酸酯块
    "30024", // 糖聚块
    "30044", // 异铁块
    "30054", // 酮阵列
    "30074", // 白马醇
    "30084", // 三水锰矿
    "30094", // 五水研磨石
    "30104", // RMA70-24
    "31014", // 聚合凝胶
    "31024" // 炽合金块
];
// 蓝材料最低耗体关卡列表【修改此部分输入，即可影响全局所有结果，无需更改代码】
var stageList1 = [
    {
        "itemId": "31023", // 炽合金
        "stageId": "sub_03-3-1",
        "code": "S3-6"
    },
    {
        "itemId": "30023", // 糖组
        "stageId": "main_02-05",
        "code": "2-5"
    },
    {
        "itemId": "30073", // 扭转醇
        "stageId": "main_06-10",
        "code": "6-11"
    },
    {
        "itemId": "30053", // 酮凝集组
        "stageId": "main_03-01",
        "code": "3-1"
    },
    {
        "itemId": "30012", // 固源岩（固源岩合成固源岩组）
        "stageId": "main_01-07",
        "code": "1-7"
    },
    {
        "itemId": "30083", // 轻锰矿
        "stageId": "main_03-02",
        "code": "3-2"
    },
    {
        "itemId": "30093", // 研磨石
        "stageId": "main_03-03",
        "code": "3-3"
    },
    {
        "itemId": "30103", // RMA70-12
        "stageId": "main_02-10",
        "code": "2-10"
    },
    {
        "itemId": "30043", // 异铁组
        "stageId": "main_02-08",
        "code": "2-8"
    },
    {
        "itemId": "30063", // 全新装置
        "stageId": "main_03-04",
        "code": "3-4"
    },
    {
        "itemId": "31013", // 凝胶
        "stageId": "sub_04-4-1",
        "code": "S4-10"
    },
    {
        "itemId": "30033", // 聚酸酯组
        "stageId": "main_02-06",
        "code": "2-6"
    }
];
// （蓝）材料价值，一个材料的价值等于：该材料所属“最优”关卡的掉落率的倒数乘以理智消耗，即理智消耗 * 样本数 / 掉落数
var blueItemValueTable = function () {
    var ret = [];
    for (var i00 = 0; i00 < stageList1.length; i00 ++) {
        var entry = stageList1[i00];
        var itemId = entry.itemId;
        var itemName = db.selectItem(itemId).name;
        var stageId = entry.stageId;
        var stageCode = entry.code;
        var stageObj = db.selectStage(stageId);
        var matrix = _matrix.matrix;
        for (var i01 = 0; i01 < matrix.length; i01 ++) {
            var mat = matrix[i01];
            if (stageId === mat.stageId && itemId === mat.itemId) {
                // 查到关卡理智消耗
                var apCost = stageObj.apCost;
                var obj = {};
                if (stageId === "main_01-07" && itemId === "30012") { // 固源岩组特殊处理，因为它是按 1-7 刷固源岩来算的
                    obj.itemId = "30013";
                    obj.name = "固源岩组";
                    obj.value = (apCost * mat.times / mat.quantity) * 5 + (2 * lmd100Value);
                } else {
                    obj.itemId = itemId;
                    obj.name = itemName;
                    obj.value = apCost * mat.times / mat.quantity;
                }
                obj.by = stageId;
                obj.byCode = stageCode;
                ret.push(obj);
            }
        }
    }
    return ret;
};
// 蓝材料价值
var blueItemValueTable0 = blueItemValueTable();
// 绿材料价值，等于：(蓝材料价值 - 200 龙门币价值) / 4，固源岩是除以 5
var greenItemValueTable = function () {
    var ret = [];
    for (var i00 = 0; i00 < greenItems.length; i00 ++) {
        var greenItemId = greenItems[i00];
        var itemName = db.selectItem(greenItemId).name;
        // 前 4 位和相应蓝材料一致
        var itemClass = greenItemId.substring(0, 4);
        for (var i01 = 0; i01 < blueItemValueTable0.length; i01 ++) {
            var blueItemValueObj = blueItemValueTable0[i01];
            if (itemClass === blueItemValueObj.itemId.substring(0, 4)) {
                var obj = {};
                obj.itemId = greenItemId;
                obj.name = itemName;
                if (greenItemId === "30012") {
                    obj.value = (blueItemValueObj.value - (2 * lmd100Value)) / 5;
                } else {
                    obj.value = (blueItemValueObj.value - (2 * lmd100Value)) / 4;
                }
                ret.push(obj);
            }
        }
    }
    return ret;
};
// 绿材料价值
var greenItemValueTable0 = greenItemValueTable();
// 灰材料价值，等于：(绿材料价值 - 100 龙门币价值) / 3
var greyItemValueTable = function () {
    var ret = [];
    for (var i00 = 0; i00 < greyItems.length; i00 ++) {
        var greyItemId = greyItems[i00];
        var itemName = db.selectItem(greyItemId).name;
        // 前 4 位和相应绿材料一致
        var itemClass = greyItemId.substring(0, 4);
        for (var i01 = 0; i01 < greenItemValueTable0.length; i01 ++) {
            var greenItemValueObj = greenItemValueTable0[i01];
            if (itemClass === greenItemValueObj.itemId.substring(0, 4)) {
                var obj = {};
                obj.itemId = greyItemId;
                obj.name = itemName;
                obj.value = (greenItemValueObj.value - lmd100Value) / 3;
                ret.push(obj);
            }
        }
    }
    return ret;
};
// 灰材料价值
var greyItemValueTable0 = greyItemValueTable();
// 快速获取某蓝材料价值
var getBlueItemValue = function (itemId) {
    for (var j00 = 0; j00 < blueItemValueTable0.length; j00 ++) {
        var blueItemValueObj0 = blueItemValueTable0[j00];
        if (itemId === blueItemValueObj0.itemId) {
            return blueItemValueObj0.value;
        }
    }
};
// 紫材料价值，等于：SUM(合成需要的蓝材料价值) + 300 龙门币价值
var purpleItemValueTable = function () {
    var ret = [];
    var obj30014 = {
        itemId: "30014",
        name: "提纯源岩",
        value: ((getBlueItemValue("30013") * 4) + (3 * lmd100Value))
    };
    ret.push(obj30014);
    var obj30064 = {
        itemId: "30064",
        name: "改量装置",
        value: ((getBlueItemValue("30013") * 2) + getBlueItemValue("30063") + getBlueItemValue("30093") + (3 * lmd100Value))
    };
    ret.push(obj30064);
    var obj30034 = {
        itemId: "30034",
        name: "聚酸酯块",
        value: ((getBlueItemValue("30033") * 2) + getBlueItemValue("30053") + getBlueItemValue("30073") + (3 * lmd100Value))
    };
    ret.push(obj30034);
    var obj30024 = {
        itemId: "30024",
        name: "糖聚块",
        value: ((getBlueItemValue("30023") * 2) + getBlueItemValue("30043") + getBlueItemValue("30083") + (3 * lmd100Value))
    };
    ret.push(obj30024);
    var obj30044 = {
        itemId: "30044",
        name: "异铁块",
        value: ((getBlueItemValue("30043") * 2) + getBlueItemValue("30063") + getBlueItemValue("30033") + (3 * lmd100Value))
    };
    ret.push(obj30044);
    var obj30054 = {
        itemId: "30054",
        name: "酮阵列",
        value: ((getBlueItemValue("30053") * 2) + getBlueItemValue("30023") + getBlueItemValue("30083") + (3 * lmd100Value))
    };
    ret.push(obj30054);
    var obj30074 = {
        itemId: "30074",
        name: "白马醇",
        value: (getBlueItemValue("30073") + getBlueItemValue("30023") + getBlueItemValue("30103") + (3 * lmd100Value))
    };
    ret.push(obj30074);
    var obj30084 = {
        itemId: "30084",
        name: "三水锰矿",
        value: ((getBlueItemValue("30083") * 2) + getBlueItemValue("30033") + getBlueItemValue("30073") + (3 * lmd100Value))
    };
    ret.push(obj30084);
    var obj30094 = {
        itemId: "30094",
        name: "五水研磨石",
        value: (getBlueItemValue("30093") + getBlueItemValue("30043") + getBlueItemValue("30063") + (3 * lmd100Value))
    };
    ret.push(obj30094);
    var obj30104 = {
        itemId: "30104",
        name: "RMA70-24",
        value: ((getBlueItemValue("30013") * 2) + getBlueItemValue("30103") + getBlueItemValue("30053") + (3 * lmd100Value))
    };
    ret.push(obj30104);
    var obj31014 = {
        itemId: "31014",
        name: "聚合凝胶",
        value: (getBlueItemValue("30043") + getBlueItemValue("31013") + getBlueItemValue("31023") + (3 * lmd100Value))
    };
    ret.push(obj31014);
    var obj31024 = {
        itemId: "31024",
        name: "炽合金块",
        value: (getBlueItemValue("30063") + getBlueItemValue("30093") + getBlueItemValue("31023") + (3 * lmd100Value))
    };
    ret.push(obj31024);
    return ret;
};
// 紫材料价值
var purpleItemValueTable0 = purpleItemValueTable();
// 作战记录价值表
var expCardValueTable = function () {
    var ret = [];
    var obj2001 = {
        itemId: "2001",
        name: "基础作战记录",
        value: expCard0Value
    };
    ret.push(obj2001);
    var obj2002 = {
        itemId: "2002",
        name: "初级作战记录",
        value: expCard1Value
    };
    ret.push(obj2002);
    var obj2003 = {
        itemId: "2003",
        name: "中级作战记录",
        value: expCard2Value
    };
    ret.push(obj2003);
    var obj2004 = {
        itemId: "2004",
        name: "高级作战记录",
        value: expCard3Value
    };
    ret.push(obj2004);
    return ret;
};
// 作战记录价值
var expCardValueTable0 = expCardValueTable();
// 价值总表
var ITEM_VALUE_TABLE = blueItemValueTable0.concat(greenItemValueTable0).concat(greyItemValueTable0).concat(purpleItemValueTable0).concat(expCardValueTable0);
// 快速获取某材料价值
var getItemValue = function (itemId) {
    for (var j00 = 0; j00 < ITEM_VALUE_TABLE.length; j00 ++) {
        var itemValueObj0 = ITEM_VALUE_TABLE[j00];
        if (itemId === itemValueObj0.itemId) {
            return itemValueObj0.value;
        }
    }
};
