const tokenService = require("../service/token-service");
const UserModel = require("../entity/user");
const eventService = require("../service/event-service")
const path = require("path");
const Image = require('../entity/image');
const EventModel = require("../entity/event");



class ImageController {

   async getImage(req, res, next){
       try {
           const image = await Image.findById(req.params.id);
           if (!image) {
               return res.status(404).send('Image not found');
           }

           // Resolve the image path to an absolute path
           const absoluteImagePath = path.resolve(image.imagePath);

           // Send the image as a response
           res.sendFile(absoluteImagePath);
       } catch (error) {
           console.error(error);
           res.status(500).send('Internal Server Error');
       }
   }
   async uploadUserImage(req, res, next ){
       try {
           const { refreshToken } = req.cookies;
           const tokenData = tokenService.validateRefreshToken(refreshToken);
           const user = UserModel.findById(tokenData.id);
           if(user.profilePictureId != null) {
               Image.findByIdAndDelete(user.profilePictureId);
           }
           const imagePath = req.file.path;
           const image = new Image({ imagePath });
           await image.save();
           await UserModel.findByIdAndUpdate(tokenData.id, {$set: {profilePictureId : image.id}});
           res.status(201).send({ image });
       } catch (error) {
           console.error(error);
           res.status(500).send('Internal Server Error');
       }
   }
    async uploadEventImage(req, res, next) {
        try {
            const event = await eventService.getEvent(req.params.id);
            const images = event.imagesIds || [];
            const imagePath = req.file.path;
            const image = new Image({ imagePath });
            await image.save();
            images.push(image.id);
            await EventModel.findByIdAndUpdate(req.params.id, { $set: { imagesIds: images } });
            res.status(201).send({ image });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
    async deleteImage(req, res, next) {
        try {
            const imageId = req.params.id;

            const user = await UserModel.findOne({ profilePictureId: imageId });
            if (user) {
                await UserModel.findByIdAndUpdate(user._id, { $set: { profilePictureId: null } });
            } else {
                const event = await EventModel.findOne({ imagesIds: imageId });
                if (event) {
                    await EventModel.findByIdAndUpdate(event._id, { $pull: { imagesIds: imageId } });
                }
            }

            await Image.findByIdAndDelete(imageId);

            res.status(200).send('Image deleted successfully');
        } catch (error) {
            console.error(error);
            res.status(400).send('Bad Request');
        }
    }
    async getImageModels(req, res, next) {
        try {
            const images = await Image.find();
            res.json(images);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    async deleteAllImages(req, res, next) {
        try {
            const allImages = await Image.find();

            for (const image of allImages) {
                const user = await UserModel.findOne({ profilePictureId: image._id });
                if (user) {
                    await UserModel.findByIdAndUpdate(user._id, { $set: { profilePictureId: null } });
                } else {
                    const event = await EventModel.findOne({ imagesIds: image._id });
                    if (event) {
                        await EventModel.findByIdAndUpdate(event._id, { $pull: { imagesIds: image._id } });
                    }
                }
                await Image.findByIdAndDelete(image._id);
            }

            res.status(200).send('All images deleted successfully');
        } catch (error) {
            console.error(error);
            res.status(400).send('Bad Request');
        }
    }
}

module.exports = new ImageController();