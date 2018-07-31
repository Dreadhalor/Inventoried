export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  assignmentIds: number[];
  roles: number[];
}