import { IDurable } from "../models/interfaces/IDurable";
import { IConsumable } from "../models/interfaces/IConsumable";
import { IAssignment } from "../models/interfaces/IAssignment";
import { IUser } from "../models/interfaces/IUser";

export class SeedValues {
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
  
  public static initUsers: IUser[] = [
    {
      id: '1',
      fullName: 'Test McTesterson',
      email: 'test@test.com',
      assignmentIds: undefined
    },
    {
      id: '2',
      fullName: 'Boy McBoysen',
      email: 'ohboy@test.com',
      assignmentIds: undefined
    },
    {
      id: '3',
      fullName: 'Real McPerson',
      email: 'thisisreal@test.com',
      assignmentIds: undefined
    },
    {
      id: '4',
      fullName: 'Admin McAdminface',
      email: 'admin@test.com',
      assignmentIds: undefined
    }
  ]
  
  public static initAssignments: IAssignment[] = [
    {
      id: '1',
      userId: SeedValues.initUsers[0].id,
      assetId: SeedValues.initConsumables[1].id,
      checkoutDate: 'January 1st 2018',
      dueDate: 'September 4th 2018'
    },
    {
      id: '2',
      userId: SeedValues.initUsers[1].id,
      assetId: SeedValues.initConsumables[3].id,
      checkoutDate: 'January 1st 2018',
      dueDate: 'September 4th 2018'
    },
    {
      id: '3',
      userId: SeedValues.initUsers[3].id,
      assetId: SeedValues.initConsumables[0].id,
      checkoutDate: 'January 1st 2018',
      dueDate: 'September 4th 2018'
    },
    {
      id: '4',
      userId: SeedValues.initUsers[2].id,
      assetId: SeedValues.initDurables[0].id,
      checkoutDate: 'January 1st 2018',
      dueDate: 'September 4th 2018'
    },
    {
      id: '5',
      userId: SeedValues.initUsers[3].id,
      assetId: SeedValues.initDurables[1].id,
      checkoutDate: 'January 1st 2018',
      dueDate: 'September 4th 2018'
    },
    {
      id: '6',
      userId: SeedValues.initUsers[3].id,
      assetId: SeedValues.initConsumables[0].id,
      checkoutDate: 'July 1st 2018',
      dueDate: 'September 4th 2018'
    },
    {
      id: '7',
      userId: SeedValues.initUsers[1].id,
      assetId: SeedValues.initConsumables[2].id,
      checkoutDate: 'July 1st 2018',
      dueDate: 'August 5th 2018'
    }
  ]
}