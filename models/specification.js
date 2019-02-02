const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const patcher = require('mongoose-json-patch');
const Schema = mongoose.Schema;


let specificationSchema = new Schema({
    autoId: {
        type: Number
    },
    parentCategoryId: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        default: null
    },
    title: {
        type: String,
        trim: true,
        unique: true
    },
    fieldType: {
        type: String,
        enum: ['Dropdown', 'Text', 'Checkbox', 'Radio Button'],
        require: true
    },
    mandatory:{
        type: Boolean,
		default: false
    },
    values: {
        type: Array
    }
});


specificationSchema.plugin(autoIncrement.plugin,
    {
        model: 'specification',
        field: 'autoId',
        startAt: 1,
        incrementBy: 1
    });

specificationSchema.plugin(patcher);

const SpecificationModel = mongoose.model('specification', specificationSchema);

module.exports = SpecificationModel;