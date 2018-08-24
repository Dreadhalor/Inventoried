export class Asset {
  public static formatAsset(iasset: object){
    let keys = Object.keys(iasset);
    let result = [];
    keys.forEach((key) => {
      if (typeof iasset[key] == 'object')
        result.push(iasset[key].join(','));
      else result.push(iasset[key]);
    });
    return result;
  }
}