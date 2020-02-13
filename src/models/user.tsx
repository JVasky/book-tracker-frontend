export interface UserInterface {
    username: string,
    email: string,
    firstName: string,
    lastName: string
    createdDt?: Date,
    roles: String[]
}

export class User implements UserInterface {

    username: string;
    email: string;
    firstName: string;
    lastName: string;
    createdDt: Date;
    roles: String[];

    constructor(username:string, email:string, firstName: string, 
        lastName:string, roles:String[], createdDt:Date=new Date(0)) {
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.createdDt = createdDt;
        this.roles = roles;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName
    }

    getEmail() {
        return this.email;
    }

    getCreatedDt() {
        return this.createdDt;
    }

    getRoles() {
        return this.roles;
    }

    getIsAdmin() {
        return this.roles.includes('admin') || this.roles.includes('developer');
    }
}

export default User