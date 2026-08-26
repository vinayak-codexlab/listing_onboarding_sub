import * as Constants from "../constants/index.constant.js";

//Checks whether a field is actually missing.
const isMissing = (value: any): boolean => {
    return value === undefined || value === null || value === "";
};

const validateCommonSubmissionFields = (listing: Record<string, any>, errors: string[]) => {
    const details = listing.listing_details;
    const commercial = listing.commercial_details;
    const address = listing.listing_address;

    // Main Listing
    if (isMissing(listing.listing_type)) errors.push("listing_type");

    // Listing Details - COMMON
    if (isMissing(details?.listing_location)) errors.push("listing_details.listing_location");
    if (isMissing(details?.area)) errors.push("listing_details.area");
    if (isMissing(details?.area_type)) errors.push("listing_details.area_type");
    if (isMissing(details?.listing_name)) errors.push("listing_details.listing_name");
    if (isMissing(details?.entry_direction)) errors.push("listing_details.entry_direction");
    if (isMissing(details?.exit_direction)) errors.push("listing_details.exit_direction");
    if (isMissing(details?.view)) errors.push("listing_details.view");
    if (isMissing(details?.project_type)) errors.push("listing_details.project_type");
    if (isMissing(details?.area_unit_type)) errors.push("listing_details.area_unit_type");
    if (isMissing(details?.property_status)) errors.push("listing_details.property_status");
    if (isMissing(details?.possession_timeline)) errors.push("listing_details.possession_timeline");
    if (isMissing(details?.completion_date)) errors.push("listing_details.completion_date");
    if (isMissing(details?.flooring)) errors.push("listing_details.flooring");
    if (isMissing(details?.flooring_type)) errors.push("listing_details.flooring_type");
    if (isMissing(details?.no_of_passengers_lifts)) errors.push("listing_details.no_of_passengers_lifts");
    if (isMissing(details?.no_of_service_lifts)) errors.push("listing_details.no_of_service_lifts");
    if (isMissing(details?.no_of_parkings)) errors.push("listing_details.no_of_parkings");
    if (isMissing(details?.cross_ventilation)) errors.push("listing_details.cross_ventilation");
    if (isMissing(details?.natural_light)) errors.push("listing_details.natural_light");
    if (isMissing(details?.furnishing)) errors.push("listing_details.furnishing");
    if (isMissing(details?.furnishing_type)) errors.push("listing_details.furnishing_type");
    if (isMissing(details?.ceiling_height)) errors.push("listing_details.ceiling_height");
    if (isMissing(details?.ceiling_height_side)) errors.push("listing_details.ceiling_height_side");
    if (isMissing(details?.vastu_compliant)) errors.push("listing_details.vastu_compliant");
    if (isMissing(details?.pets_allowed)) errors.push("listing_details.pets_allowed");
    if (details?.share === undefined || details?.share === null) errors.push("listing_details.share");

    // Listing Address - COMMON
    if (isMissing(address?.line_1)) errors.push("listing_address.line_1");
    if (isMissing(address?.region)) errors.push("listing_address.region");
    if (isMissing(address?.subregion)) errors.push("listing_address.subregion");
    if (isMissing(address?.locality)) errors.push("listing_address.locality");
    if (isMissing(address?.city)) errors.push("listing_address.city");
    if (isMissing(address?.pincode)) errors.push("listing_address.pincode");

    // Commercial Details - COMMON
    if (isMissing(commercial?.property_purpose)) errors.push("commercial_details.property_purpose");
    if (isMissing(commercial?.availability_status)) errors.push("commercial_details.availability_status");
    // if (isMissing(commercial?.available_from)) errors.push("commercial_details.available_from");
    if (isMissing(commercial?.current_occupation_status)) errors.push("commercial_details.current_occupation_status");
    if (isMissing(commercial?.visit_day)) errors.push("commercial_details.visit_day");
    if (isMissing(commercial?.start_time)) errors.push("commercial_details.start_time");
    if (isMissing(commercial?.end_time)) errors.push("commercial_details.end_time");
    if (isMissing(commercial?.discount_price)) errors.push("commercial_details.discount_price");
    if (isMissing(commercial?.property_price)) errors.push("commercial_details.property_price");
    if (isMissing(commercial?.avg_rate_per_sqft)) errors.push("commercial_details.avg_rate_per_sqft");
    if (isMissing(commercial?.brokerage_charge)) errors.push("commercial_details.brokerage_charge");
    if (isMissing(commercial?.transfer_charges)) errors.push("commercial_details.transfer_charges");
    if (isMissing(commercial?.registration_charges)) errors.push("commercial_details.registration_charges");
    if (isMissing(commercial?.stamp_duty)) errors.push("commercial_details.stamp_duty");
    if (isMissing(commercial?.brokerage_terms)) errors.push("commercial_details.brokerage_terms");
    if (isMissing(commercial?.maintenance_charges)) errors.push("commercial_details.maintenance_charges");
    if (isMissing(commercial?.notice_needed)) errors.push("commercial_details.notice_needed");
    if (isMissing(commercial?.internal_notes)) errors.push("commercial_details.internal_notes");

    // Key Features - COMMON
    if (!Array.isArray(listing.key_features) || listing.key_features.length < 5) {
        errors.push("key_features (minimum 5 required)");
    }
};

// listing and unit type
const validateUnitTypeFields = (listing: Record<string, any>, errors: string[]) => {
    const details = listing.listing_details;
    const commercial = listing.commercial_details;

    if (isMissing(details?.unit_type)) {
        errors.push("listing_details.unit_type");
        return;
    }

    // HOME
    if (listing.listing_type === Constants.ListingType.HOME) {
        switch (details.unit_type) {
            case Constants.HomeUnitType.APARTMENT:
            case Constants.HomeUnitType.DUPLEX:
            case Constants.HomeUnitType.PENTHOUSE:
            case Constants.HomeUnitType.JODI:
            case Constants.HomeUnitType.STUDIO:
            case Constants.HomeUnitType.INDEPENDENT_FLOOR: {
                if (isMissing(details?.project)) errors.push("listing_details.project");
                if (isMissing(details?.tower)) errors.push("listing_details.tower");
                if (isMissing(details?.unit_no)) errors.push("listing_details.unit_no");
                if (isMissing(details?.floor_no)) errors.push("listing_details.floor_no");
                if (isMissing(details?.bhk)) errors.push("listing_details.bhk");
                if (isMissing(details?.bhk_type)) errors.push("listing_details.bhk_type");
                if (isMissing(details?.no_of_bathrooms)) errors.push("listing_details.no_of_bathrooms");
                if (isMissing(details?.no_of_balconies)) errors.push("listing_details.no_of_balconies");
                if (isMissing(commercial?.parking_type)) errors.push("commercial_details.parking_type");
                break;
            }

            case Constants.HomeUnitType.VILLA:
            case Constants.HomeUnitType.INDEPENDENT_HOUSE:
            case Constants.HomeUnitType.HOLIDAY_HOME:
            case Constants.HomeUnitType.ROW_TOWN_HOUSE: {
                if (isMissing(details?.unit_no)) errors.push("listing_details.unit_no");
                if (isMissing(details?.bhk)) errors.push("listing_details.bhk");
                if (isMissing(details?.bhk_type)) errors.push("listing_details.bhk_type");
                if (isMissing(details?.building_status)) errors.push("listing_details.building_status");
                if (isMissing(details?.building_age)) errors.push("listing_details.building_age");
                if (isMissing(details?.structure)) errors.push("listing_details.structure");
                if (isMissing(details?.boundary_wall_type)) errors.push("listing_details.boundary_wall_type");
                if (isMissing(details?.boundary_wall_height)) errors.push("listing_details.boundary_wall_height");
                if (isMissing(details?.boundary_wall_height_side)) errors.push("listing_details.boundary_wall_height_side");
                if (isMissing(details?.gate_type)) errors.push("listing_details.gate_type");
                if (isMissing(details?.gate_height)) errors.push("listing_details.gate_height");
                if (isMissing(details?.gate_height_side)) errors.push("listing_details.gate_height_side");
                if (isMissing(details?.servant_quarters)) errors.push("listing_details.servant_quarters");
                if (isMissing(details?.lawn_area)) errors.push("listing_details.lawn_area");
                if (isMissing(commercial?.parking_type)) errors.push("commercial_details.parking_type");
                break;
            }

            default:
                errors.push(`listing_details.unit_type: unsupported home unit type '${details.unit_type}'`);
                break;
        }
        return;
    }

    // OFFICE
    if (listing.listing_type === Constants.ListingType.OFFICE) {
        switch (details.unit_type) {
            case Constants.OfficeUnitType.INDEPENDENT_HOUSE:
            case Constants.OfficeUnitType.INDEPENDENT_BUILDING: {
                if (isMissing(details?.tower)) errors.push("listing_details.tower");
                if (isMissing(details?.unit_no)) errors.push("listing_details.unit_no");
                if (isMissing(details?.floor_no)) errors.push("listing_details.floor_no");
                if (isMissing(details?.UnitFloorPosition)) errors.push("listing_details.UnitFloorPosition");
                if (isMissing(details?.no_of_seats)) errors.push("listing_details.no_of_seats");
                if (isMissing(details?.no_of_cabins)) errors.push("listing_details.no_of_cabins");
                if (isMissing(details?.no_of_meeting_rooms)) errors.push("listing_details.no_of_meeting_rooms");
                if (isMissing(details?.reception_area)) errors.push("listing_details.reception_area");
                if (isMissing(details?.pantry)) errors.push("listing_details.pantry");
                if (isMissing(details?.no_of_private_washroom)) errors.push("listing_details.no_of_private_washroom");
                if (isMissing(details?.no_of_common_washroom)) errors.push("listing_details.no_of_common_washroom");
                if (isMissing(details?.no_of_private_parkings)) errors.push("listing_details.no_of_private_parkings");
                if (isMissing(commercial?.monthly_rent)) errors.push("commercial_details.monthly_rent");
                if (isMissing(commercial?.security_amount)) errors.push("commercial_details.security_amount");
                if (isMissing(commercial?.cam_charges)) errors.push("commercial_details.cam_charges");
                if (isMissing(commercial?.building_plan_approval)) errors.push("commercial_details.building_plan_approval");
                if (isMissing(commercial?.fire_noc)) errors.push("commercial_details.fire_noc");
                if (isMissing(details?.no_of_conference_rooms)) errors.push("listing_details.no_of_conference_rooms");
                break;
            }

            default:
                errors.push(`listing_details.unit_type: unsupported office unit type '${details.unit_type}'`);
                break;
        }
        return;
    }

    // INDUSTRIAL
    if (listing.listing_type === Constants.ListingType.INDUSTRIAL) {
        switch (details.unit_type) {
            case Constants.IndustrialUnitType.WAREHOUSE:
            case Constants.IndustrialUnitType.DARKSTORE: {
                if (isMissing(details?.plot_area)) errors.push("listing_details.plot_area");
                if (isMissing(details?.plot_area_unit_type)) errors.push("listing_details.plot_area_unit_type");
                break;
            }
            default: {
                errors.push(`listing_details.unit_type: unsupported industrial unit type '${details.unit_type}'`);
                break;
            }
        }
        return;
    }
    // RETAIL
    if (listing.listing_type === Constants.ListingType.RETAIL) {
        switch (details.unit_type) {
            case Constants.RetailUnitType.SHOP:
            case Constants.RetailUnitType.SHOWROOM: {
                // Add retail-specific mandatory fields.
                break;
            }
            default: {
                errors.push(`listing_details.unit_type: unsupported retail unit type '${details.unit_type}'`);
                break;
            }
        }
    }
    // LAND
    if (listing.listing_type === Constants.ListingType.LAND) {
        switch (details.unit_type) {
            case Constants.LandUnitType.RESIDENTIAL_PLOT:
            case Constants.LandUnitType.COMMERCIAL_LAND: {
                // Add land-specific mandatory fields.
                break;
            }
            default: {
                errors.push(`listing_details.unit_type: unsupported land unit type '${details.unit_type}'`);
                break;
            }
        }
        return;
    }   
    // Unsupported listing type
    errors.push(`Unsupported listing_type: ${listing.listing_type}`);
};

//main submission validation
export const validateListingSubmission = (listing: Record<string, any>): string[] => {
    const errors: string[] = [];
    validateCommonSubmissionFields(listing, errors);
    validateUnitTypeFields(listing, errors);
    return [...new Set(errors)];
};
