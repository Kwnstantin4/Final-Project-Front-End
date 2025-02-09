export interface User {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  address: Address;
  phone: Phone[];
}

export interface Address {
  area: string;
  road: string;
}

export interface Phone {
  type: string;
  number: string;
}

export interface Credentials {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  address: Address;
  phone: Phone[];
}


export interface LoggedInUser {
  fullname: string,
  email:string
}

export interface LoginCredentials {
  email: string;
  password: string;
}
