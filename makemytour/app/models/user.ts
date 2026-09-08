export class User {
    public id: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public phoneNumber: string;
    private passwordHash: string;

    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        phoneNumber: string,
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.passwordHash = this.hashPassword(password);
    }

    public getFullName(): string {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    private hashPassword(password: string): string {
        return password;
    }
}