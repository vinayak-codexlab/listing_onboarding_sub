import { Schema, model } from "mongoose";
import {
  ListingType, ListingStatus, HomeUnitType, UnitFloorPosition, ProjectType,
  PlotAreaUnitType, PropertyStatus, PossessionTimeline, PropertyPurpose, Direction,
  AreaUnitType, PetsAllowed, VisitDay, Day, BrokerageTerms, NoticeNeededDuration,
  CurrentOccupancy, AreaType, VastuCompliant, CrossVentilation, NaturalLight, OnboardingStep, YesAndNo, 
  LandOwnershipType, PlotShape, LandTapography, NoOfOpenSides, AccessRoad,RoadType,RoadFacingSide,SourceOfWater,SewageDrainage,ExistingStructure,
  ElectricityConnection, AgeOfBuilding,FitOutCondition,FlooringType,  VisibilityFrom, KeysOccupancy
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
    unit_no: String,
    floor_no: String,
    combine_unit_no: [String],
    UnitFloorPosition: { type: String, enum: Object.values(UnitFloorPosition) },
    towerHide: { type: Boolean, default: false },
    projectHide: { type: Boolean, default: false },
    unitHide: { type: Boolean, default: false },
    floorHide: { type: Boolean, default: false },
    isCustomUnit: { type: Boolean, default: false },
    share: { type: Boolean, default: true },
    area: Schema.Types.Mixed,
    area_type: { type: String, enum: Object.values(AreaType) },
    listing_name: String,
    entry_direction: { type: String, enum: Object.values(Direction) },
    exit_direction: { type: String, enum: Object.values(Direction) },
    view: String,
    project_type: { type: String, enum: Object.values(ProjectType) },
    // unit_type: { type: String, enum: Object.values(UnitType) },
    unit_type: {type: String},
    area_unit_type: { type: String, enum: Object.values(AreaUnitType) },
    plot_area_unit_type: { type: String, enum: Object.values(PlotAreaUnitType) },
    plot_area: String,
    property_status: { type: String, enum: Object.values(PropertyStatus) },
    age_of_building:{ type: String, enum: Object.values(AgeOfBuilding) },
    possession_timeline: { type: String, enum: Object.values(PossessionTimeline) },
    completion_date: Date,
    no_of_service_lifts: Number,
    total_floor: String,
    flooring: { type: String, enum: Object.values(FlooringType) },
    flooring_type: String,
    no_of_balconies: String,
    no_of_bathrooms: String,
    no_of_lifts: String,
    no_of_passengers_lifts: String,
    no_of_parkings: String,
    no_of_private_parkings: String,
    cross_ventilation: { type: String, enum: Object.values(CrossVentilation) },
    natural_light: { type: String, enum: Object.values(NaturalLight) },
    furnishing: String,
    furnishing_type: String,
    ceiling_height: String,
    ceiling_height_side: String,
    vastu_compliant: { type: String, enum: Object.values(VastuCompliant) },
    pets_allowed: { type: String, enum: Object.values(PetsAllowed) },
    source_of_water: {type:String, enum: Object.values(SourceOfWater)},

    //------------- Office Specific -------------------
    no_of_seats: String,
    no_of_cabins: String,
    no_of_meeting_rooms: String,
    no_of_conference_rooms: String,
    no_of_private_washroom: String,
    no_of_common_washroom: String,
    reception_area: { type: String, enum: Object.values(YesAndNo) },
    pantry: { type: String, enum: Object.values(YesAndNo) },
    lobby: { type: String, enum: Object.values(YesAndNo) },
    refuge: { type: String, enum: Object.values(YesAndNo) },
    food_court_cafeteria: { type: String, enum: Object.values(YesAndNo) },

    //------------- Home Specific -------------------
    bhk: Schema.Types.Mixed,
    bhk_type: String,
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

    //------------- Industrial Specific -------------------
    location_type: String,
    ceiling_height_inch: String,
    ceiling_height_side_inch: String,
    power_in_KA: String,
    office_area: { type: String, enum: Object.values(YesAndNo) },
    truck_access: { type: String, enum: Object.values(YesAndNo) },
    access_road_width: String,
    vehicle_height_restrictions: String,
    // vehicle_height_inch: String,
    loading_area: { type: String, enum: Object.values(YesAndNo) },
    lorry_bay_area: { type: String, enum: Object.values(YesAndNo) },

    //------------- Land Specific -------------------
    plot_length: String,
    plot_length_unit_type: String,
    plot_width: String,
    plot_width_unit_type: String,
    land_ownership_type: {type : String, enum:Object.values(LandOwnershipType)},
    plot_shape: {type:String, enum:Object.values(PlotShape)},
    access_road: {type:String, enum:Object.values(AccessRoad)},
    access_road_width_unit_type: String,
    road_type: {type:String, enum: Object.values(RoadType)},
    electricity_connection: Boolean,
    land_tapography: { type: String, enum: Object.values(LandTapography) },
    road_facing_side: {type: String, enum: Object.values(RoadFacingSide)},
    corner_plot: { type: String, enum: Object.values(YesAndNo) },
    no_of_open_sides: {type:String, enum: Object.values(NoOfOpenSides)},
    boundary_wall: Boolean,
    sewage_drainage: {type: String, enum:Object.values(SewageDrainage)},
    gated_community: { type: String, enum: Object.values(YesAndNo) },
    existing_structure: {type:String, enum:Object.values(ExistingStructure)},
    constructed_area: String,
    constructed_area_unit_type: String,

    //------------- Retail Specific -------------------
    fit_out_condition: { type: String, enum: Object.values(FitOutCondition) },
    frontage: Number,
    frontageType: String,
    visibility_from: { type: String, enum: Object.values(VisibilityFrom) },
    signage_rights: Boolean,
    display_area: Boolean,
    mezzanine: Boolean
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
    available_from: Schema.Types.Mixed,
    current_occupation_status: { type: String, enum: Object.values(CurrentOccupancy) },
    visit_day: { type: String, enum: Object.values(VisitDay) },
    particular_day: { type: String, enum: Object.values(Day), default: null },
    start_time: String,
    end_time: String,
    discount_price: { type: Number, default: 0 },
    security_amount: { type: Number, default: 0 },
    property_price: { type: Number, default: 0 },
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
    move_in_charges: { type: Number, default: 0 },
    cam_charges: { type: Number, default: 0 },
    building_plan_approval: { type: String, enum: Object.values(YesAndNo) },
    fire_noc: { type: String, enum: Object.values(YesAndNo) },

    //------------- Office Specific -------------------
    monthly_rent: { type: Number, default: 0 },
    sale_consideration: Number,
    availablility_status: String,

    //------------- Land Specific -------------------
    visit_allowed: Boolean,
    access_notes: String,
    tax_govt_charges_included: { type: String, enum: Object.values(YesAndNo) },

    //------------- Retail Specific -------------------
    suitable_for: String,
    oc: { type: String, enum: Object.values(YesAndNo) },
    cam_charges_included: { type: String, enum: Object.values(YesAndNo) },
    keys_occupation:  { type: String, enum: Object.values(KeysOccupancy) }
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
    tower: String,

    //----------retail--------
    floor_no: String,
    tower_name: String,
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
    pincode: Number,

    //----------industrial------------
    district: String,
    taluka: String,
    village: String,

    //----------land----------------
    google_map_link: String,
    google_map_link_hide: { type: Boolean, default: false },
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
    vrTour: { type: String, default: "" }, //industrial only
    coverImageKey: { type:String, default:""}, // indus, land, retail only
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