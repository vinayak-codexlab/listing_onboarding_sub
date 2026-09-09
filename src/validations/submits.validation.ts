import * as Constants from "../constants/index.constant.js";

// Shared array templates to eliminate duplication
const COMMON_PLOT_FIELDS = [
  "listing_details.unit_type",
  "listing_details.plot_area",
  "listing_details.plot_area_unit_type",
];

const COMMON_HOME_FIELDS = [
  "listing_details.project",
  "listing_details.tower",
  "listing_details.unit_no",
  "listing_details.floor_no",
  "listing_details.bhk",
  "listing_details.no_of_bathrooms",
  "listing_details.no_of_balconies",
  "listing_details.cross_ventilation",
  "listing_details.natural_light",
];

const COMMON_VILLA_FIELDS = [
  "listing_details.bhk",
  "listing_details.lawn_area",
  "listing_details.boundary_wall_type",
  "listing_details.boundary_wall_height",
  "listing_details.boundary_wall_height_side",
  "listing_details.gate_type",
  "listing_details.gate_height",
  "listing_details.gate_height_side",
  "listing_details.servant_quarters",
  "listing_details.no_of_bathrooms",
  "listing_details.no_of_balconies",
  "listing_details.cross_ventilation",
  "listing_details.natural_light",
];

const COMMON_OFFICE_FIELDS = [
  "listing_details.project",
  "listing_details.unit_no",
  "listing_details.floor_no",
  "listing_details.no_of_seats",
  "listing_details.no_of_cabins",
  "listing_details.no_of_meeting_rooms",
  "listing_details.reception_area",
  "listing_details.pantry",
  "listing_details.no_of_private_washroom",
  "listing_details.no_of_common_washroom",
  "listing_details.no_of_private_parkings",
  "commercial_details.monthly_rent",
  "commercial_details.security_amount",
  "commercial_details.cam_charges",
  "commercial_details.building_plan_approval",
  "commercial_details.fire_noc",
];

const COMMON_INDUSTRIAL_FIELDS = [
  "listing_details.project",
  "listing_details.unit_no",
];

const COMMON_LAND_FIELDS = ["listing_details.plot_area"];

const REQUIRED_FIELDS = {
  common: [
    "listing_type",
    // Listing details
    "listing_details.listing_location",
    "listing_details.area",
    "listing_details.area_type",
    "listing_details.listing_name",
    "listing_details.project_type",
    "listing_details.property_status",
    "listing_details.possession_timeline",
    "listing_details.completion_date",
    "listing_details.area_unit_type",
    "listing_details.ceiling_height",
    "listing_details.ceiling_height_side",
    // Commercial details
    "commercial_details.property_purpose",
    "commercial_details.availability_status",
    "commercial_details.available_from",
    "commercial_details.current_occupation_status",
    "commercial_details.visit_day",
    "commercial_details.start_time",
    "commercial_details.end_time",
    "commercial_details.brokerage_terms",
    "commercial_details.notice_needed",
    "commercial_details.internal_notes",
    // Address
    "listing_address.line_1",
    "listing_address.region",
    "listing_address.subregion",
    "listing_address.locality",
    "listing_address.city",
    "listing_address.pincode",
    // Other
    "key_features",
  ],

  listingType: {
    [Constants.ListingType.HOME]: [...COMMON_PLOT_FIELDS, "commercial_details.parking_type"],
    [Constants.ListingType.OFFICE]: COMMON_PLOT_FIELDS,
    [Constants.ListingType.INDUSTRIAL]: COMMON_PLOT_FIELDS,
    [Constants.ListingType.RETAIL]: COMMON_PLOT_FIELDS,
    [Constants.ListingType.LAND]: COMMON_PLOT_FIELDS,
  } as Record<string, string[]>,

  unitType: {
    // HOME
    [Constants.HomeUnitType.APARTMENT]: COMMON_HOME_FIELDS,
    [Constants.HomeUnitType.DUPLEX]: COMMON_HOME_FIELDS,
    [Constants.HomeUnitType.PENTHOUSE]: COMMON_HOME_FIELDS,
    [Constants.HomeUnitType.JODI]: COMMON_HOME_FIELDS,
    [Constants.HomeUnitType.STUDIO]: COMMON_HOME_FIELDS,
    [Constants.HomeUnitType.INDEPENDENT_FLOOR]: COMMON_HOME_FIELDS,

    // HOME - VILLA GROUP
    [Constants.HomeUnitType.VILLA]: COMMON_VILLA_FIELDS,
    [Constants.HomeUnitType.INDEPENDENT_HOUSE]: COMMON_VILLA_FIELDS,
    [Constants.HomeUnitType.HOLIDAY_HOME]: COMMON_VILLA_FIELDS,
    [Constants.HomeUnitType.ROW_TOWN_HOUSE]: COMMON_VILLA_FIELDS,

    // OFFICE
    // [Constants.OfficeUnitType.INDEPENDENT_HOUSE]: COMMON_OFFICE_FIELDS,
    [Constants.OfficeUnitType.INDEPENDENT_BUILDING]: COMMON_OFFICE_FIELDS,

    // INDUSTRIAL
    [Constants.IndustrialUnitType.WAREHOUSE]: COMMON_INDUSTRIAL_FIELDS,
    [Constants.IndustrialUnitType.DARKSTORE]: COMMON_INDUSTRIAL_FIELDS,
    [Constants.IndustrialUnitType.SHED]: COMMON_INDUSTRIAL_FIELDS,
    [Constants.IndustrialUnitType.GODOWN]: COMMON_INDUSTRIAL_FIELDS,
    [Constants.IndustrialUnitType.IN_BUILDING]: COMMON_INDUSTRIAL_FIELDS,

    // RETAIL
    [Constants.RetailUnitType.SHOP]: COMMON_INDUSTRIAL_FIELDS,
    [Constants.RetailUnitType.SHOWROOM]: COMMON_INDUSTRIAL_FIELDS,

    // LAND
    [Constants.LandUnitType.RESIDENTIAL_PLOT]: COMMON_LAND_FIELDS,
    [Constants.LandUnitType.COMMERCIAL_LAND]: COMMON_LAND_FIELDS,
    [Constants.LandUnitType.AGRICULTURE_LAND]: COMMON_LAND_FIELDS,
    [Constants.LandUnitType.INDUSTRIAL_LAND]: COMMON_LAND_FIELDS,
    [Constants.LandUnitType.FARM_HOUSE]: COMMON_LAND_FIELDS,
  } as Record<string, string[]>,
};

// Helpers
const getNestedValue = (object: Record<string, any>, path: string): any =>
  path.split(".").reduce((curr, key) => curr?.[key], object);

const hasValue = (val: any): boolean => {
  if (val === undefined || val === null) return false;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return true;
};

const validateFields = (listing: Record<string, any>, fields: string[], errors: string[]) => {
  for (const field of fields) {
    if (!hasValue(getNestedValue(listing, field))) {
      errors.push(field);
    }
  }
};

/**
 * MAIN SUBMISSION VALIDATION
 * Called before updating listing status to PENDING.
 */
export const validateListingSubmission = (listing: Record<string, any>): string[] => {
  const errors: string[] = [];

  // 1. Validate common fields
  validateFields(listing, REQUIRED_FIELDS.common, errors);

  if (!Array.isArray(listing.key_features) || listing.key_features.length < 5) {
    errors.push("key_features (minimum 5 required)");
  }

  // 2. Validate fields based on listing_type
  const listingTypeFields = REQUIRED_FIELDS.listingType[listing.listing_type];
  if (listingTypeFields) {
    validateFields(listing, listingTypeFields, errors);
  }

  // 3. Validate fields based on unit_type
  const unitType = listing.listing_details?.unit_type;
  if (unitType && REQUIRED_FIELDS.unitType[unitType]) {
    validateFields(listing, REQUIRED_FIELDS.unitType[unitType], errors);
  }

  return [...new Set(errors)];
};