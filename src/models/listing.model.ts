import { Schema, model } from "mongoose";
import {
  ListingType, ListingStatus, HomeUnitType, UnitFloorPosition, ProjectType,
  PlotAreaUnitType, PropertyStatus, PossessionTimeline, PropertyPurpose, Direction,
  AreaUnitType, PetsAllowed, VisitDay, Day, BrokerageTerms, NoticeNeededDuration,
  CurrentOccupancy, AreaType, VastuCompliant, CrossVentilation, NaturalLight, OnboardingStep, YesAndNo
} from "../constants/index.constant.js";

const noIdOption = { _id: false };

// ===========================Sub Schemas =================================
const ListingDetailsSchema = new Schema(
  {
    //-------------common fields -------------------
    listing_status: { type: String, enum: Object.values(ListingStatus) },
    listing_location: String,
    project: String,
    tower: String,
    unit_no: String, // can be objectId or string value
    floor_no: String,
    combine_unit_no: [String],
    UnitFloorPosition: { type: String, enum: Object.values(UnitFloorPosition) },
    towerHide: { type: Boolean, default: false },
    projectHide: { type: Boolean, default: false },
    unitHide: { type: Boolean, default: false },
    floorHide: { type: Boolean, default: false },
    isCustomUnit: { type: Boolean, default: false },
    share: { type: Boolean, default: true },
    area: Number,
    area_type: { type: String, enum: Object.values(AreaType) },
    listing_name: String,
    entry_direction: { type: String, enum: Object.values(Direction) },
    exit_direction: { type: String, enum: Object.values(Direction) },
    view: String,
    project_type: { type: String, enum: Object.values(ProjectType) },
    unit_type: { type: String, enum: Object.values(HomeUnitType) },
    area_unit_type: { type: String, enum: Object.values(AreaUnitType) },
    plot_area_unit_type: { type: String, enum: Object.values(PlotAreaUnitType) },
    plot_area: String,
    property_status: { type: String, enum: Object.values(PropertyStatus) },
    possession_timeline: { type: String, enum: Object.values(PossessionTimeline) },
    completion_date: Date,
    no_of_service_lifts: Number,
    total_floor: String,
    flooring: String,
    flooring_type: String,
    bhk: String,
    bhk_type: String,
    no_of_balconies: String,
    no_of_bathrooms: String,
    no_of_passengers_lifts: String,
    no_of_parkings: String,
    cross_ventilation: { type: String, enum: Object.values(CrossVentilation) },
    natural_light: { type: String, enum: Object.values(NaturalLight) },
    furnishing: String,
    furnishing_type: String,
    ceiling_height: String,
    ceiling_height_side: String,
    vastu_compliant: { type: String, enum: Object.values(VastuCompliant) },
    pets_allowed: { type: String, enum: Object.values(PetsAllowed) },

    //-------------office page fields -------------------
    no_of_seats: String,
    no_of_cabins: String,
    no_of_meeting_rooms: String,
    reception_area: {type:String, enum: Object.values(YesAndNo)},
    pantry: {type:String, enum: Object.values(YesAndNo)},
    no_of_private_washroom: String,
    no_of_common_washroom: String,
    no_of_private_parkings: String,

    no_of_conference_rooms: String,
    lobby: { type: String, enum: Object.values(YesAndNo) },
    refuge: { type: String, enum: Object.values(YesAndNo) },
    food_court_cafeteria: { type: String, enum: Object.values(YesAndNo) },

    //-------------other additional fields --------------
    building_status: String,
    building_age: Number,
    structure: String,

    boundary_wall_type: String,
    boundary_wall_height: String,
    boundary_wall_height_side: String,

    gate_type: String,
    gate_height: String,
    gate_height_side: String,

    servant_quarters: { type: String, enum: Object.values(YesAndNo) },
    lawn_area: String,

    no_of_lifts: String,
    

  },
  noIdOption
);

const CommercialDetailsSchema = new Schema(
  {
    //-------------common fields -------------------
    parking_type: String,
    property_purpose: { type: String, enum: Object.values(PropertyPurpose) },
    availability_status: String,
    priceHide: { type: Boolean, default: false },
    available_from: Date,
    current_occupation_status: { type: String, enum: Object.values(CurrentOccupancy) },
    visit_day: { type: String, enum: Object.values(VisitDay) },
    particular_day: { type: String, enum: Object.values(Day), default: null },
    start_time: String,
    end_time: String,
    discount_price: { type: Number, default: 0 },
    security_amount: { type: Number, default: 0 },
    property_price: Number,
    avg_rate_per_sqft: Number,
    brokerage_charge: { type: Number, default: 0 },
    tenantsPreferred: String,
    transfer_charges: { type: Number, default: 0 },
    registration_charges: { type: Number, default: 0 },
    stamp_duty: { type: Number, default: 0 },
    brokerage_terms: { type: String, enum: Object.values(BrokerageTerms) },
    maintenance_charges: { type: Number, default: 0 },
    maintenance_included: { type: String, default: "" },
    notice_needed: { type: String, enum: Object.values(NoticeNeededDuration) },
    internal_notes: { type: String, default: "" },

    //-------------office page fields -------------------
    monthly_rent: { type: Number, default: 0 },
    // security_amount: Number,
    cam_charges: {type:Number, default: 0},
    building_plan_approval: {type:String, enum: Object.values(YesAndNo)},
    fire_noc: {type:String, enum: Object.values(YesAndNo)},
    move_in_charges: {type: Number, default: 0},
    sale_consideration: Number,
  },
  noIdOption
);

const BrokerAndAgentSchema = new Schema(
  {
    sub: { type: String, required: true, index: true },
    firm_id: { type: Schema.Types.ObjectId, required: true, index: true }
  },
  noIdOption
);

const ListingPropertyDetailsSchema = new Schema(
  {
    unit_no: String,
    project_name: String,
    tower: String
  },
  noIdOption
);

const ListingAddressSchema = new Schema(
  {
    line_1: { type: String, default: "" },
    region: String,
    subregion: String,
    locality: String,
    city: String,
    pincode: Number
  },
  noIdOption
);

// ========================Main Listing Schema====================================
const listingOnboardingSchema = new Schema(
  {
    listing_type: { type: String, enum: Object.values(ListingType) },
    listing_details: { type: ListingDetailsSchema },
    commercial_details: { type: CommercialDetailsSchema },
    lastUpdate: Date,
    broker_and_agent: { type: BrokerAndAgentSchema, required: true },
    key_features: { type: [String], default: [] },
    onboarding_type: { type: String, default: "normal" },
    property_details: { type: ListingPropertyDetailsSchema },
    listing_address: { type: ListingAddressSchema },
    furnishingAmenities: { type: [Schema.Types.Mixed], default: [] },
    apartmentAmenities: { type: [String], default: [] },
    firm_name: String,
    broker_name: String,
    is_personalized: { type: Boolean, default: false },
    listing_id: { type: String, required: true, unique: true, index: true },
    current_step: {
      type: String,
      enum: Object.values(OnboardingStep),
      default: OnboardingStep.ESSENTIAL
    }
  },
  { timestamps: true }
);

// Indexes
listingOnboardingSchema.index({ "broker_and_agent.sub": 1, "broker_and_agent.firm_id": 1 });
listingOnboardingSchema.index({ listing_id: 1, current_step: 1 });

export default model("Listings", listingOnboardingSchema);