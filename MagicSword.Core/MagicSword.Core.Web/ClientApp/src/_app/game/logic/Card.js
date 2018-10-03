var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../BoxObject"], function (require, exports, BoxObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Card = /** @class */ (function (_super) {
        __extends(Card, _super);
        function Card(definition, resourcePath, width, height, depth, delay, isPawn) {
            if (delay === void 0) { delay = false; }
            if (isPawn === void 0) { isPawn = false; }
            var _this = _super.call(this, resourcePath + "/" + definition.imageUrl, width, height, depth, delay, isPawn) || this;
            _this.definition = definition;
            _this.selectable = true;
            _this.draggable = true;
            _this.isCard = true;
            _this.isCardStack = false;
            _this.isCovered = true;
            _this.dispose = function () {
                _this.originStack.disposeCard(_this);
            };
            return _this;
        }
        Object.defineProperty(Card.prototype, "name", {
            get: function () {
                return this.definition ? this.definition.name : "Karta";
            },
            enumerable: true,
            configurable: true
        });
        Card.prototype.init = function () {
            _super.prototype.init.call(this);
        };
        Object.defineProperty(Card.prototype, "faceUrl", {
            get: function () {
                return this.isCovered ? this.originStack.faceUrl : this.topTexture;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Card.prototype, "contentUrl", {
            get: function () {
                return this.topTexture;
            },
            enumerable: true,
            configurable: true
        });
        Card.prototype.setCovered = function (isCovered) {
            this.isCovered = isCovered;
            this.changeTex(this.faceUrl);
        };
        Card.prototype.toggleCovered = function () {
            this.setCovered(!this.isCovered);
        };
        return Card;
    }(BoxObject_1.BoxObject));
    exports.Card = Card;
});
//# sourceMappingURL=Card.js.map