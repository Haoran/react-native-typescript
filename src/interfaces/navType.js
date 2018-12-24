// 导航 左侧（icon or text）, title(drop or text）, 右侧 (icon or text)
export var navType;
(function (navType) {
    navType[navType["empty"] = 0] = "empty";
    navType[navType["icon"] = 1] = "icon";
    navType[navType["drop"] = 2] = "drop";
    navType[navType["text"] = 3] = "text";
    navType[navType["element"] = 4] = "element";
})(navType || (navType = {}));
//# sourceMappingURL=navType.js.map