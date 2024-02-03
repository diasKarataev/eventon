module.exports = class UserDto {
    email;
    id;
    isActivated;
    role;
    profilePictureId;
    name; // Add the missing field
    surname; // Add the missing field
    birthdate; // Add the missing field
    creationDate; // Add the missing field

    constructor(model){
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.role = model.role;
        this.profilePictureId = model.profilePictureId;
        // Add the missing assignments
        this.name = model.name;
        this.surname = model.surname;
        this.birthDate = model.birthDate;
        this.creationDate = model.creationDate;
    }
}
