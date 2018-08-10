import { IConsumable } from './models/interfaces/IConsumable';
import { IDurable } from "./models/interfaces/IDurable";

export class Globals {

  public static dialogWidth = '500px';
  public static dialogConfig = {
    width: Globals.dialogWidth,
    maxWidth: Globals.dialogWidth
  }

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

  public static initDurables: IDurable[] = [
    {
      id: '1',
      serialNumber: 'sdfewagw',
      categoryId: '3',
      manufacturerId: '2',
      notes: 'This is a thing',
      assignmentId: undefined,
      tagIds: ['1','3','4'],
      active: undefined
    },
    {
      id: '2',
      serialNumber: 'g34h6765',
      categoryId: '1',
      manufacturerId: '4',
      notes: 'Hello, world!',
      assignmentId: undefined,
      tagIds: ['2','3'],
      active: undefined
    },
    {
      id: '3',
      serialNumber: 'e5yhgfhg',
      categoryId: '5',
      manufacturerId: '1',
      notes: 'Ughhhhhh',
      assignmentId: undefined,
      tagIds: ['5','3'],
      active: undefined
    },
    {
      id: '4',
      serialNumber: '87fgh49y',
      categoryId: '2',
      manufacturerId: '5',
      notes: 'Ooga booga shoeshine',
      assignmentId: undefined,
      tagIds: ['2'],
      active: undefined
    },
    {
      id: '5',
      serialNumber: 'df6890gh',
      categoryId: '4',
      manufacturerId: '3',
      notes: 'Two households, both alike in dignity, In fair Verona, where we lay our scene, From ancient grudge break to new mutiny, Where civil blood makes civil hands unclean.',
      assignmentId: undefined,
      tagIds: ['2','1','4'],
      active: undefined
    }
  ]

  public static initConsumables: IConsumable[] = [
    {
      id: '6',
      label: 'HDMI cable',
      quantity: 25,
      categoryId: '1',
      manufacturerId: '4',
      notes: 'To connect 2 HDMI ports',
      assignmentIds: undefined,
      tagIds: ['1','2']
    },
    {
      id: '7',
      label: 'VGA to HDMI adapter',
      quantity: 51,
      categoryId: '3',
      manufacturerId: '1',
      notes: 'Pretty self-explanatory',
      assignmentIds: undefined,
      tagIds: ['3','5']
    },
    {
      id: '8',
      label: 'Power supply',
      quantity: 23,
      categoryId: '5',
      manufacturerId: '3',
      notes: 'For monitors, desktops, etc',
      assignmentIds: undefined,
      tagIds: ['4']
    },
    {
      id: '9',
      label: 'VGA cable',
      quantity: 7,
      categoryId: '4',
      manufacturerId: '5',
      notes: 'Old-fashioned video cable; does not transmit sound',
      assignmentIds: undefined,
      tagIds: ['3','4','5']
    },
    {
      id: '10',
      label: 'Surge protector',
      quantity: 5,
      categoryId: '2',
      manufacturerId: '2',
      notes: '1 per workstation',
      assignmentIds: undefined,
      tagIds: ['1']
    }
  ]
}