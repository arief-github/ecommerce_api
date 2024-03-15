import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CouponSchema = new Schema(
    {
        code: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
            default: 0
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: {virtuals: true}
    }
);

// check coupon is expired
CouponSchema.virtual("isExpired").get(function() {
    return this.endDate < Date.now();
});

// count days left coupon is valid
CouponSchema.virtual("daysLeft").get(function() {
    const daysLeft = Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24)) + " " + "Days Left";

    return daysLeft;
});

// validation

// if end date is less than start date
CouponSchema.pre("validate", function(next) {
    if (this.endDate < this.startDate) {
        next(new Error("End date cannot be less than start date"));
    } else {
        next();
    }
});

// if start date less than today
CouponSchema.pre("validate", function(next) {
    if (this.startDate < Date.now()) {
        next(new Error("Start date cannot be less than today"));
    } else {
        next();
    }
});

// if end date less than today
CouponSchema.pre("validate", function(next) {
    if (this.endDate < Date.now()) {
        next(new Error("End date cannot be less than today"));
    } else {
        next();
    }
});

// discount is less than 0 and greater than 100
CouponSchema.pre("validate", function(next) {
    if (this.discount < 0 || this.discount > 100) {
        next(new Error("Discount cannot be less than 0 or greater than 100"));
    } else {
        next();
    }
});

const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;