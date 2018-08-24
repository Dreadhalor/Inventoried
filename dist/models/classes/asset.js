"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Asset {
    static formatAsset(iasset) {
        let keys = Object.keys(iasset);
        let result = [];
        keys.forEach((key) => {
            if (typeof iasset[key] == 'object')
                result.push(iasset[key].join(','));
            else
                result.push(iasset[key]);
        });
        return result;
    }
}
exports.Asset = Asset;
//# sourceMappingURL=asset.js.map