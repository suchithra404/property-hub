import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    // ======================
    // BASIC DETAILS (OLD)
    // ======================
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    regularPrice: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      required: true,
    },

    bathrooms: {
      type: Number,
      required: true,
    },

    bedrooms: {
      type: Number,
      required: true,
    },

    furnished: {
      type: Boolean,
      required: true,
    },

    parking: {
      type: Boolean,
      required: true,
    },

    type: {
      type: String, // rent / sale
      required: true,
    },

    offer: {
      type: Boolean,
      required: true,
    },

    imageUrls: {
      type: Array,
      required: true,
    },

    userRef: {
      type: String,
      required: true,
    },

    // ======================
    // NEW ADVANCED FEATURES
    // ======================

    // Property Category
    propertyType: {
      type: String,
      default: "Apartment", // Apartment / Villa / Plot / House
    },

    // Location Details
    city: {
      type: String,
      default: "",
    },

    locality: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    landmark: {
      type: String,
      default: "",
    },

    // Area
    builtUpArea: {
      type: Number, // sq.ft
      default: 0,
    },

    floorNumber: {
      type: Number,
      default: 0,
    },

    totalFloors: {
      type: Number,
      default: 0,
    },

    // Pricing Extras
    maintenanceCharge: {
      type: Number,
      default: 0,
    },

    securityDeposit: {
      type: Number,
      default: 0,
    },

    negotiable: {
      type: Boolean,
      default: false,
    },

    // Furnishing Type
    furnishingType: {
      type: String,
      default: "Unfurnished", // Unfurnished / Semi / Fully
    },

    // Amenities
    amenities: {
      parking: {
        type: Boolean,
        default: false,
      },

      lift: {
        type: Boolean,
        default: false,
      },

      powerBackup: {
        type: Boolean,
        default: false,
      },

      waterSupply: {
        type: Boolean,
        default: true,
      },

      security: {
        type: Boolean,
        default: false,
      },

      gym: {
        type: Boolean,
        default: false,
      },
    },

    // Availability
    availableFrom: {
      type: Date,
      default: Date.now,
    },

    immediate: {
      type: Boolean,
      default: true,
    },

    // Contact Preferences
    showPhone: {
      type: Boolean,
      default: true,
    },

    whatsappEnabled: {
      type: Boolean,
      default: false,
    },

    // Media
    videoTourLink: {
      type: String,
      default: "",
    },

    // ======================
// LOCATION (FOR MAP VIEW)
// ======================
location: {
  lat: {
    type: Number,
    default: null,
  },
  lng: {
    type: Number,
    default: null,
  },
},


  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
