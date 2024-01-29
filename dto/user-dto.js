module.exports = class UserDto {
    email;
    id;
    isActivated;
    role;
    profilePictureId;
    constructor(model){
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.role = model.role;
        this.profilePictureId = model.profilePictureId;
    }
}