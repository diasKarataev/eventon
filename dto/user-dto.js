module.exports = class UserDto {
    email;
    id;
    isActivated;
    role;
    profilePictureId;
    name;
    surname;
    birthdate;
    creationDate;

    constructor(model){
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.role = model.role;
        this.profilePictureId = model.profilePictureId;
        this.name = model.name;
        this.surname = model.surname;
        this.birthDate = model.birthDate;
        this.creationDate = model.creationDate;
        this.isSubscribed = model.isSubscribed;
    }
}
