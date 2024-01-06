module.exports = class UserDto {
    id;
    event;
    isPayed;
    seat_row;
    seat_number;
    activationLink;
    date;
    isActivated;
    constructor(model){
        this.id = model.id;
        this.event = model.event;
        this.isPayed = model.isPayed;
        this.seat_row = model.seat_row;
        this.seat_number = model.seat_number;
        this.activationLink = model.activationLink;
        this.date = model.date;
        this.isActivated = model.isActivated;
    }
}