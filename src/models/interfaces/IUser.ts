export interface IUser {
  id: string,
  title: string, // 1
  locationId: string, // 2
  jobTitle: string,// 3
  firstName: string,// 4
  middleName: string,// 5
  lastName: string,// 6
  username: string,// 7
  //domain: 'la-archdiocese.org',// 8
  departmentName: string,// 9
  managerName: string,// 10
  fullName: string,// 11
  phone: string,// 12
  directReports: number, //14
  email: string,
  distinguishedName: string,
  assignmentIds: string[]
}