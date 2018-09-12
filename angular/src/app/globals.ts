export class Globals {

  public static dialogWidth = '500px';
  public static dialogConfig = {
    width: Globals.dialogWidth,
    maxWidth: Globals.dialogWidth
  }
  public static historyFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';

  private static _title = 'Inventoried';
  static get title(){
    return this._title;
  }

  private static _host = 'localhost:5000';
  static get host(){
    return this._host;
  }

  private static _protocol = 'http';
  static get protocol(){
    return this._protocol;
  }

  static get request_prefix(){
    return `${this.protocol}://${this.host}/`;
  }

  private static _settings_route = 'settings/get_settings';
  static get settings_route(){
    return this._settings_route;
  }

  public static triggerArrayChange(array: any[]){
    array = array.slice(0);
  }

  public static countInArray(array, what) {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
}

  public static deepCopy(obj) {
    var copy;
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;
    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = this.deepCopy(obj[i]);
        }
        return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

}