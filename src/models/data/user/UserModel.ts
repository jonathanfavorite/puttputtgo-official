interface UserModel {
    ID: number,
    UserKey: string,
    Name: string,
    Username: string,
    Phone: string,
    Email: string,
    CreatedDate: Date
    ProfileImage?: string

}

export default UserModel