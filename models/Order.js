import mongoose from "mongoose";

const Schema = mongoose.Schema;

// generate random numbers for order
const randomTxt = Math.random().toString(36).substring().toLocaleUpperCase();
const randomNumbers = Math.floor(1000 + Math.random()* 9000);

const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [
        {
            type: Object,
            required: true
        }
    ],
    shippingAddress: {
        type: Object,
        required: true
    },
    orderNumber: {
        type: String,
        default: randomTxt + randomNumbers
    },
    // for stripe payment
    paymentStatus: {
        type: String,
        default: "Not paid",
    },
    paymentMethod: {
        type: String,
        default: "Not specified"
    },
    currency: {
        type: String,
        default: "Not specified"
    },
    status: {
        type: String,
        default: "pending",
        enum: ['pending', 'processing', 'shipped', 'delivered']
    },
    deliveredAt: {
        type: Date,

    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;
