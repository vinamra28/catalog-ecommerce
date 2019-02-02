const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const Schema = mongoose.Schema;

const bannerSchema = new Schema({
	autoId:{
		type: Number
	},
	name:{
		type: String,
		trim: true
	},	
	size:{
        width: {type: Number},
        height: {type: Number}
    },
    redirectUrl: {
        type: String
    },
    photos: [Schema.Types.ObjectId],

    duration: {
        type: Number                    //seconds
    },
    target: {
        type: String,
        enum: ["same window", "new window"]
    }
},{timeStamps: true});


bannerSchema.plugin(autoIncrement.plugin,
    { model: 'banner',
      field: 'autoId',
      startAt: 1,
      incrementBy: 1
    });
const Banner = mongoose.model('banner', bannerSchema);

module.exports = Banner;


