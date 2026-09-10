import { z } from "zod";
import * as Constants from "../constants/index.constant.js";
import { ApiError } from "../utils/apiError.js";

// Reusable Validators
export const objectIdSchema = z.string().trim().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
const optionalString = z.string().trim().min(1, "Field cannot be empty").regex(/^[^<>]*$/, "HTML is not allowed").refine(
    (value) =>!/(?:\b(?:alert|confirm|prompt|eval)\s*\(|javascript\s*:|\bon\w+\s*=)/i.test(value),"Script-like content is not allowed").optional();
const optionalNullableString = z.string().trim().optional().nullable();
const optionalNumber = z.coerce.number().optional();
const nonNegativeNumber = z.coerce.number().min(0).optional();
const optionalBoolean = z.boolean().optional();
const optionalDate = z.coerce.date().optional();
const optionalInches =z.coerce.number().int("Inches must be an integer").min(0, "Inches must be 0-11").max(11, "Inches must be 0-11").optional();
const optionalCeilingHeight = z.coerce.number().int("Ceiling height must be an integer").min(5, "Ceiling height must be between 5 and 25").max(25, "Ceiling height must be between 5 and 25").optional();
const optionalNonNegativeInteger = z.coerce.number().int("Value must be a whole number").min(0, "Value cannot be negative").optional();
const optionalTime24Hour = z.string().trim().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/,"Time must be in valid 24-hour HH:mm format").optional();
const optionalListingName = z
  .string()
  .trim()
  .min(1, "Listing name cannot be empty")
  .max(240, "Listing name cannot exceed 240 characters")
  .regex(/^[^<>]*$/, "HTML is not allowed")
  .refine(
    (value) =>!/(?:\b(?:alert|confirm|prompt|eval)\s*\(|javascript\s*:|\bon\w+\s*=)/i.test(value),"Script-like content is not allowed")
  .optional();
  const optionalFloorNumber = z.preprocess(
  (value) => {
    if (
      typeof value === "string" &&
      value.trim() === ""
    ) {
      return Number.NaN;
    }

    return value;
  },
  z.coerce
    .number()
    .int("Floor number must be a whole number")
    .min(
      -1,
      "Floor number cannot be below -1; use -1 for basement and 0 for ground floor"
    )
    .optional()
);

 const optionalAvailableFrom = z.iso
  .datetime({
    offset: true,
    message: "available_from must be a valid ISO datetime"
  })
  .nullable()
  .optional();

const optionalPincode = z.coerce
  .number()
  .int("Pincode must be a whole number")
  .min(100000, "Pincode must contain exactly 6 digits")
  .max(999999, "Pincode must contain exactly 6 digits")
  .optional();

type ListingData = Record<string, any>;

const PROTECTED_FIELDS = new Set([
  "broker_and_agent.sub",
  "broker_and_agent.firm_id",
  "listing_id",
  "listing_details.listing_status",
  "status",
  "listing_status"
]);

const REQUIRED_CREATE_FIELDS = [
  "listing_type",
  "current_step",
  "onboarding_type"
] as const;

const ALLOWED_LISTING_TYPES_BY_FIELD: Record<string, Constants.ListingType[]> = {
  "listing_details.ceiling_height": [
    Constants.ListingType.HOME,
    Constants.ListingType.OFFICE,
    Constants.ListingType.INDUSTRIAL,
    Constants.ListingType.RETAIL
  ],
  "listing_details.total_floor": [
    Constants.ListingType.HOME,
    Constants.ListingType.OFFICE,
    Constants.ListingType.INDUSTRIAL,
    Constants.ListingType.RETAIL
  ],
  "listing_details.power_in_KA": [Constants.ListingType.INDUSTRIAL],
  "listing_details.truck_access": [Constants.ListingType.INDUSTRIAL],
  "listing_details.lorry_bay_area": [Constants.ListingType.INDUSTRIAL]
};

  // Flat Listing Field Validation
const listingFieldSchemas: Record<string, z.ZodTypeAny> = {
  _id: objectIdSchema.optional(),

  // Listing Root Level
  listing_type: z.nativeEnum(Constants.ListingType),
  current_step: z.nativeEnum(Constants.OnboardingStep),
  listing_id: z.string().trim().length(10, "Listing ID must be exactly 10 characters"),
  onboarding_type: z.string().trim(),
  lastUpdate: z.coerce.date(),
  firm_name: optionalString,
  broker_name: optionalString,
  is_personalized: optionalBoolean,
  vrTour: optionalString,
  coverImageKey: optionalString,

  // Listing Details - Common Fields
  "listing_details.listing_status": z.nativeEnum(Constants.ListingStatus).optional(),
  "listing_details.listing_location": optionalString,
  "listing_details.project": optionalString,
  "listing_details.project_name": optionalString,
  "listing_details.tower": optionalString,
  "listing_details.unit_no": optionalString,
  "listing_details.floor_no": optionalFloorNumber,
  "listing_details.combine_unit_no": z.array(z.string().trim().min(1, "Unit number cannot be empty")).optional(),
  "listing_details.UnitFloorPosition": z.nativeEnum(Constants.UnitFloorPosition).optional(),
  "listing_details.towerHide": optionalBoolean,
  "listing_details.projectHide": optionalBoolean,
  "listing_details.unitHide": optionalBoolean,
  "listing_details.floorHide": optionalBoolean,
  "listing_details.isCustomUnit": optionalBoolean,
  "listing_details.share": optionalBoolean,
  "listing_details.area": z.union([z.coerce.number().positive(), z.string().trim()]).optional(),
  "listing_details.area_type": z.nativeEnum(Constants.AreaType).optional(),
  "listing_details.listing_name": optionalListingName,
  "listing_details.entry_direction": z.nativeEnum(Constants.Direction).optional(),
  "listing_details.exit_direction": z.nativeEnum(Constants.Direction).optional(),
  "listing_details.view": optionalString,
  "listing_details.project_type": z.nativeEnum(Constants.ProjectType).optional(),
  // "listing_details.unit_type": z.nativeEnum(Constants.UnitType).optional(),
  "listing_details.unit_type": z.string().trim().optional(),
  "listing_details.area_unit_type": z.nativeEnum(Constants.AreaUnitType).optional(),
  "listing_details.plot_area_unit_type": z.nativeEnum(Constants.PlotAreaUnitType).optional(),
  "listing_details.plot_area": optionalNullableString,
  "listing_details.property_status": z.nativeEnum(Constants.PropertyStatus).optional(),
  "listing_details.possession_timeline": z.nativeEnum(Constants.PossessionTimeline).optional(),
  "listing_details.completion_date": optionalDate,
  "listing_details.no_of_service_lifts": nonNegativeNumber,
  "listing_details.total_floor": optionalString,
  "listing_details.flooring": z.nativeEnum(Constants.FlooringType).optional(),
  "listing_details.flooring_type": optionalString,
  "listing_details.no_of_balconies": optionalString,
  "listing_details.no_of_bathrooms": optionalString,
  "listing_details.no_of_lifts": optionalString,
  "listing_details.no_of_passengers_lifts": optionalString,
  "listing_details.no_of_parkings": optionalNonNegativeInteger,
  "listing_details.no_of_private_parkings": optionalString,
  "listing_details.cross_ventilation": z.nativeEnum(Constants.CrossVentilation).optional(),
  "listing_details.natural_light": z.nativeEnum(Constants.NaturalLight).optional(),
  "listing_details.furnishing": optionalString,
  "listing_details.furnishing_type": optionalString,
  "listing_details.ceiling_height": optionalCeilingHeight,
  "listing_details.ceiling_height_side": optionalString,
  "listing_details.vastu_compliant": z.nativeEnum(Constants.VastuCompliant).optional(),
  "listing_details.pets_allowed": z.nativeEnum(Constants.PetsAllowed).optional(),
  "listing_details.source_of_water": z.nativeEnum(Constants.SourceOfWater).optional(),

  // Listing Details - Office Specific
  "listing_details.no_of_seats": optionalString,
  "listing_details.no_of_cabins": optionalString,
  "listing_details.no_of_meeting_rooms": optionalString,
  "listing_details.no_of_conference_rooms": optionalString,
  "listing_details.no_of_private_washroom": optionalString,
  "listing_details.no_of_common_washroom": optionalString,
  "listing_details.reception_area": z.nativeEnum(Constants.YesAndNo).optional(),
  "listing_details.pantry": z.nativeEnum(Constants.YesAndNo).optional(),
  "listing_details.lobby": z.nativeEnum(Constants.YesAndNo).optional(),
  "listing_details.refuge": z.nativeEnum(Constants.YesAndNo).optional(),
  "listing_details.food_court_cafeteria": z.nativeEnum(Constants.YesAndNo).optional(),

  // Listing Details - Home Specific
  "listing_details.bhk": z.union([objectIdSchema, z.string().trim(), z.number()]).optional(),
  "listing_details.bhk_type": optionalString,
  "listing_details.building_status": optionalString,
  "listing_details.building_age": nonNegativeNumber,
  "listing_details.structure": optionalString,
  "listing_details.boundary_wall_type": optionalString,
  "listing_details.boundary_wall_height": optionalString,
  "listing_details.boundary_wall_height_side": optionalString,
  "listing_details.gate_type": optionalString,
  "listing_details.gate_height": optionalString,
  "listing_details.gate_height_side": optionalString,
  "listing_details.servant_quarters": z.nativeEnum(Constants.YesAndNo).optional(),
  "listing_details.lawn_area": optionalString,

  // Listing Details - Industrial Specific
  "listing_details.location_type": optionalString,
  "listing_details.ceiling_height_inch": optionalInches,
  "listing_details.ceiling_height_side_inch": optionalString,
  "listing_details.power_in_KA": optionalString,
  "listing_details.office_area": z.nativeEnum(Constants.YesAndNo).optional(),
  "listing_details.truck_access": z.nativeEnum(Constants.YesAndNo).optional(),
  "listing_details.access_road_width": optionalString,
  "listing_details.vehicle_height_restrictions": optionalString,
  "listing_details.loading_area": z.nativeEnum(Constants.YesAndNo).optional(),
  "listing_details.lorry_bay_area": z.nativeEnum(Constants.YesAndNo).optional(),

  // Listing Details - Land Specific
  "listing_details.plot_length": optionalString,
  "listing_details.plot_length_unit_type": optionalString,
  "listing_details.plot_width": optionalString,
  "listing_details.plot_width_unit_type": optionalString,
  "listing_details.land_ownership_type": z.nativeEnum(Constants.LandOwnershipType).optional(),
  "listing_details.plot_shape": z.nativeEnum(Constants.PlotShape).optional(),
  "listing_details.access_road": z.nativeEnum(Constants.AccessRoad).optional(),
  "listing_details.access_road_width_unit_type": optionalString,
  "listing_details.road_type": z.nativeEnum(Constants.RoadType).optional(),
  "listing_details.electricity_connection": optionalBoolean,
  "listing_details.land_tapography": z.nativeEnum(Constants.LandTapography).optional(),
  "listing_details.road_facing_side": z.nativeEnum(Constants.RoadFacingSide).optional(),
  "listing_details.corner_plot": z.nativeEnum(Constants.YesAndNo).optional(),
  "listing_details.no_of_open_sides": z.nativeEnum(Constants.NoOfOpenSides).optional(),
  "listing_details.boundary_wall": optionalBoolean,
  "listing_details.sewage_drainage": z.nativeEnum(Constants.SewageDrainage).optional(),
  "listing_details.gated_community": z.nativeEnum(Constants.YesAndNo).optional(),
  "listing_details.existing_structure": z.nativeEnum(Constants.ExistingStructure).optional(),
  "listing_details.constructed_area": optionalString,
  "listing_details.constructed_area_unit_type": optionalString,

  // Listing Details - Retail Specific
  "listing_details.fit_out_condition": z.nativeEnum(Constants.FitOutCondition).optional(),
  "listing_details.frontage": nonNegativeNumber,
  "listing_details.frontageType": optionalString,
  "listing_details.visibility_from": z.nativeEnum(Constants.VisibilityFrom).optional(),
  "listing_details.signage_rights": optionalBoolean,
  "listing_details.display_area": optionalBoolean,
  "listing_details.mezzanine": optionalBoolean,

  // Commercial Details - Common Fields
  "commercial_details.parking_type": optionalString,
  "commercial_details.property_purpose": z.nativeEnum(Constants.PropertyPurpose).optional(),
  "commercial_details.availability_status": optionalString,
  "commercial_details.availablility_status": optionalString, // Handles payload typo variant
  "commercial_details.priceHide": optionalBoolean,
  // "commercial_details.available_from": z.union([z.coerce.date(), z.string().trim()]).optional().nullable(),
  "commercial_details.available_from":optionalAvailableFrom,
  "commercial_details.current_occupation_status": z.nativeEnum(Constants.CurrentOccupancy).optional(),
  "commercial_details.visit_day": z.nativeEnum(Constants.VisitDay).optional(),
  "commercial_details.particular_day": z.nativeEnum(Constants.Day).optional().nullable(),
  "commercial_details.start_time": optionalTime24Hour,
  "commercial_details.end_time": optionalTime24Hour,
  "commercial_details.discount_price": nonNegativeNumber,
  "commercial_details.security_amount": nonNegativeNumber,
  "commercial_details.property_price": nonNegativeNumber,
  "commercial_details.avg_rate_per_sqft": nonNegativeNumber,
  "commercial_details.brokerage_charge": nonNegativeNumber,
  "commercial_details.tenantsPreferred": optionalString,
  "commercial_details.transfer_charges": nonNegativeNumber,
  "commercial_details.registration_charges": nonNegativeNumber,
  "commercial_details.stamp_duty": nonNegativeNumber,
  "commercial_details.brokerage_terms": z.nativeEnum(Constants.BrokerageTerms).optional(),
  "commercial_details.maintenance_charges": nonNegativeNumber,
  "commercial_details.maintenance_included":  z.nativeEnum(Constants.YesAndNo).optional(),
  "commercial_details.notice_needed": z.nativeEnum(Constants.NoticeNeededDuration).optional(),
  "commercial_details.internal_notes": optionalString,
  "commercial_details.move_in_charges": nonNegativeNumber,
  "commercial_details.cam_charges": nonNegativeNumber,
  "commercial_details.building_plan_approval": z.nativeEnum(Constants.YesAndNo).optional(),
  "commercial_details.fire_noc": z.nativeEnum(Constants.YesAndNo).optional(),

  // Commercial Details - Office Specific
  "commercial_details.monthly_rent": nonNegativeNumber,
  "commercial_details.sale_consideration": nonNegativeNumber,

  // Commercial Details - Land Specific
  "commercial_details.visit_allowed": optionalBoolean,
  "commercial_details.access_notes": optionalString,
  "commercial_details.tax_govt_charges_included": z.nativeEnum(Constants.YesAndNo).optional(),

  // Commercial Details - Retail Specific
  "commercial_details.suitable_for": optionalString,
  "commercial_details.oc": z.nativeEnum(Constants.YesAndNo).optional(),
  "commercial_details.cam_charges_included": z.nativeEnum(Constants.YesAndNo).optional(),
  "commercial_details.keys_occupation": z.nativeEnum(Constants.KeysOccupancy).optional(),

  // Broker & Agent
  "broker_and_agent.sub": z.string().trim().min(1),
  "broker_and_agent.firm_id": objectIdSchema,

  // Key Features
  key_features: z.array(z.string().trim().min(1, "min length should be 1")),

  // Property Details
  "property_details.unit_no": optionalString,
  "property_details.project_name": optionalString,
  "property_details.tower": optionalString,
  "property_details.tower_name": optionalString,
  "property_details.floor_no": optionalString,

  // Listing Address
  "listing_address.line_1": optionalString,
  "listing_address.region": optionalString,
  "listing_address.subregion": optionalString,
  "listing_address.locality": optionalString,
  "listing_address.city": optionalString,
  "listing_address.pincode": optionalPincode,
  "listing_address.district": optionalString,
  "listing_address.taluka": optionalString,
  "listing_address.village": optionalString,
  "listing_address.google_map_link": optionalString,
  "listing_address.google_map_link_hide": optionalBoolean,

  // Amenities
  furnishingAmenities: z.array(z.any()),
  apartmentAmenities: z.array(z.string())
};

const isListingField = (key: string) =>
  key.startsWith("listing_details.") ||
  key.startsWith("commercial_details.") ||
  key.startsWith("property_details.") ||
  key.startsWith("listing_address.") ||
  key === "key_features" ||
  key === "furnishingAmenities" ||
  key === "apartmentAmenities";

const hasMeaningfulValue = (value: unknown) => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

const validateRequestBody: (
  data: unknown
) => asserts data is ListingData = (data) => {
  if (
    data === null ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    Object.keys(data).length === 0
  ) {
    throw new ApiError(400, "Request body cannot be empty");
  }
};

const validateCreateRequirements = (data: ListingData) => {
  for (const field of REQUIRED_CREATE_FIELDS) {
    if (!hasMeaningfulValue(data[field])) {
      throw new ApiError(400, `${field} is required`);
    }
  }

  const hasListingData = Object.entries(data).some(
    ([key, value]) => isListingField(key) && hasMeaningfulValue(value)
  );

  if (!hasListingData) {
    throw new ApiError(400, "At least one non-empty listing field is required");
  }
};

const validateFieldIsAllowed = (key: string, value: unknown) => {
  if (PROTECTED_FIELDS.has(key)) {
    throw new ApiError(400, `Field cannot be provided: ${key}`);
  }

  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    throw new ApiError(400, `Provide '${key}' data in dot notation form`);
  }
};

const validateFields = (data: ListingData): ListingData => {
  const parsedData: ListingData = {};

  for (const [key, value] of Object.entries(data)) {
    validateFieldIsAllowed(key, value);

    const schema = listingFieldSchemas[key];
    if (!schema) {
      throw new ApiError(400, `Invalid field: ${key}`);
    }

    const result = schema.safeParse(value);
    if (!result.success) {
      throw new ApiError(
        400,
        result.error.issues[0]?.message ?? `Invalid value for ${key}`
      );
    }

    parsedData[key] = result.data;
  }

  return parsedData;
};

const validatePricingRules = (data: ListingData) => {
  const propertyPrice = data["commercial_details.property_price"];
  const discountPrice = data["commercial_details.discount_price"];
  const propertyPurpose = data["commercial_details.property_purpose"];
  const securityAmount = data["commercial_details.security_amount"];
  const stampDuty = data["commercial_details.stamp_duty"];
  const monthlyRent = data["commercial_details.monthly_rent"];
  const maintenanceIncluded = data["commercial_details.maintenance_included"];
  const maintenanceCharges = data["commercial_details.maintenance_charges"];

  if (
    propertyPrice !== undefined &&
    discountPrice !== undefined &&
    (discountPrice > propertyPrice || discountPrice < propertyPrice * 0.8)
  ) {
    throw new ApiError(
      400,
      "commercial_details.discount_price must be between 80% and 100% of property_price"
    );
  }

  if (
    propertyPurpose === Constants.PropertyPurpose.SECONDARY_SALE &&
    securityAmount !== undefined
  ) {
    throw new ApiError(400, "security_amount is only allowed for rent/lease listings");
  }

  if (
    propertyPurpose === Constants.PropertyPurpose.RENT_LEASE &&
    stampDuty !== undefined
  ) {
    throw new ApiError(400, "stamp_duty is only allowed for secondary_sale listings");
  }

  if (
    propertyPurpose === Constants.PropertyPurpose.SECONDARY_SALE &&
    monthlyRent !== undefined
  ) {
    throw new ApiError(400, "monthly_rent is only allowed for rent/lease listings");
  }

  if (
    maintenanceIncluded === Constants.YesAndNo.YES &&
    maintenanceCharges !== undefined &&
    maintenanceCharges > 0
  ) {
    throw new ApiError(
      400,
      "maintenance_charges must be zero or omitted when maintenance is included"
    );
  }
};

const validateListingTypeRules = (data: ListingData) => {
  const listingType = data.listing_type;
  const unitType = data["listing_details.unit_type"];

  if (listingType && unitType) {
    const allowedUnitTypes =
      Constants.UNIT_TYPES_BY_LISTING_TYPE[
        listingType as keyof typeof Constants.UNIT_TYPES_BY_LISTING_TYPE
      ];

    if (!allowedUnitTypes?.includes(unitType as never)) {
      throw new ApiError(
        400,
        `Invalid unit_type '${unitType}' for listing_type '${listingType}'`
      );
    }
  }

  if (listingType) {
    for (const [field, allowedTypes] of Object.entries(ALLOWED_LISTING_TYPES_BY_FIELD)) {
      if (data[field] !== undefined && !allowedTypes.includes(listingType)) {
        throw new ApiError(
          400,
          `${field} is not allowed for listing_type '${listingType}'`
        );
      }
    }
  }

  if (
    listingType === Constants.ListingType.LAND &&
    data["listing_details.area_type"] !== undefined
  ) {
    throw new ApiError(400, "invalid area_type");
  }
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours! * 60 + minutes!;
};

const validateVisitRules = (data: ListingData) => {
  const startTime = data["commercial_details.start_time"];
  const endTime = data["commercial_details.end_time"];
  const visitDay = data["commercial_details.visit_day"];
  const particularDay = data["commercial_details.particular_day"];

  if (
    startTime !== undefined &&
    endTime !== undefined &&
    toMinutes(endTime) <= toMinutes(startTime)
  ) {
    throw new ApiError(400, "end_time must be later than start_time");
  }

  if (
    visitDay === Constants.VisitDay.PARTICULAR_DAY &&
    particularDay == null
  ) {
    throw new ApiError(
      400,
      "commercial_details.particular_day is required when visit_day is particular_day"
    );
  }
};

const validatePropertyRules = (data: ListingData) => {
  const unitNo = data["listing_details.unit_no"];
  const combinedUnits = data["listing_details.combine_unit_no"];
  const floorNumber = data["listing_details.floor_no"];
  const totalFloors = data["listing_details.total_floor"];

  if (unitNo !== undefined && combinedUnits?.includes(unitNo)) {
    throw new ApiError(
      400,
      "combine_unit_no cannot include the primary unit_no"
    );
  }

  if (
    floorNumber !== undefined &&
    totalFloors !== undefined &&
    floorNumber > Number(totalFloors)
  ) {
    throw new ApiError(400, "floor_no cannot be greater than total_floor");
  }
};

const validateAmenityRules = (data: ListingData) => {
  const listingType = data.listing_type;

  if (
    listingType === Constants.ListingType.LAND &&
    data.furnishingAmenities !== undefined
  ) {
    throw new ApiError(400, "furnishingAmenities is not allowed for land listings");
  }

  if (
    data.apartmentAmenities !== undefined &&
    listingType !== Constants.ListingType.HOME
  ) {
    throw new ApiError(400, "apartmentAmenities is only allowed for home listings");
  }
};

const validateAvailabilityRules = (data: ListingData) => {
  const availabilityStatus = data["commercial_details.availability_status"];
  const availableFrom = data["commercial_details.available_from"];

  if (
    availabilityStatus === "under_construction" &&
    typeof availableFrom === "string" &&
    new Date(availableFrom).getTime() < Date.now()
  ) {
    throw new ApiError(
      400,
      "available_from must be a future date when availability_status is under_construction"
    );
  }
};

export const validateListingBusinessRules = (data: ListingData) => {
  validatePricingRules(data);
  validateListingTypeRules(data);
  validateVisitRules(data);
  validatePropertyRules(data);
  validateAmenityRules(data);
  validateAvailabilityRules(data);
};

export const validateListingData = (input: unknown) => {
  validateRequestBody(input);

  if (input._id === undefined) {
    validateCreateRequirements(input);
  }

  const parsedData = validateFields(input);
  validateListingBusinessRules(parsedData);

  return parsedData;
};

// Status Action Validator
export const listingActionSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({ action: z.nativeEnum(Constants.ListingStatus) })
});
