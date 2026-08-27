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

    // Common Address Fields
    if (isMissing(address?.line_1)) errors.push("listing_address.line_1");
    if (isMissing(address?.region)) errors.push("listing_address.region");
    if (isMissing(address?.subregion)) errors.push("listing_address.subregion");
    if (isMissing(address?.pincode)) errors.push("listing_address.pincode");

    // Common Listing Details
    if (isMissing(details?.listing_name)) errors.push("listing_details.listing_name");
    if (isMissing(details?.area)) errors.push("listing_details.area");

    // Common Commercial Details
    if (isMissing(commercial?.property_purpose)) errors.push("commercial_details.property_purpose");

    // Financials: Check price based on purpose (Sale vs Rent)
    if (commercial?.property_purpose === "rent/lease") {
        if (isMissing(commercial?.monthly_rent)) errors.push("commercial_details.monthly_rent");
        if (isMissing(commercial?.security_amount)) errors.push("commercial_details.security_amount");
    } else {
        if (isMissing(commercial?.property_price)) errors.push("commercial_details.property_price");
    }

    // Key Features - COMMON
    if (!Array.isArray(listing.key_features) || listing.key_features.length < 5) {
        errors.push("key_features (minimum 5 required)");
    }
};

// listing and unit type
const validateUnitTypeFields = (listing: Record<string, any>, errors: string[]) => {
    const details = listing.listing_details;
    const commercial = listing.commercial_details;
    const address = listing.listing_address;

    if (isMissing(details?.unit_type)) {
        errors.push("listing_details.unit_type");
        return;
    }

    // HOME
    if (listing.listing_type === Constants.ListingType.HOME) {
        // Common across all HOME types
        if (isMissing(address?.locality)) errors.push("listing_address.locality");
        if (isMissing(details?.project)) errors.push("listing_details.project");
        if (isMissing(details?.property_status)) errors.push("listing_details.property_status");
        if (isMissing(details?.project_type)) errors.push("listing_details.project_type");
        if (isMissing(details?.area_unit_type)) errors.push("listing_details.area_unit_type");
        if (isMissing(details?.bhk_type)) errors.push("listing_details.bhk_type");
        if (isMissing(details?.unit_type)) errors.push("listing_details.unit_type");
        if (isMissing(details?.no_of_bathrooms)) errors.push("listing_details.no_of_bathrooms");
        if (isMissing(details?.vastu_compliant)) errors.push("listing_details.vastu_compliant");
        
        if (isMissing(commercial?.availability_status)) errors.push("commercial_details.availability_status");
        if (isMissing(commercial?.available_from)) errors.push("commercial_details.available_from");
        if (isMissing(commercial?.parking_type)) errors.push("commercial_details.parking_type");
        if (isMissing(commercial?.visit_day)) errors.push("commercial_details.visit_day");
        if (isMissing(commercial?.start_time)) errors.push("commercial_details.start_time");
        if (isMissing(commercial?.end_time)) errors.push("commercial_details.end_time");
        if (isMissing(commercial?.current_occupation_status)) errors.push("commercial_details.current_occupation_status");
        if (isMissing(commercial?.brokerage_terms)) errors.push("commercial_details.brokerage_terms");

        switch (details.unit_type) {
            case Constants.HomeUnitType.APARTMENT:
            case Constants.HomeUnitType.DUPLEX:
            case Constants.HomeUnitType.PENTHOUSE:
            case Constants.HomeUnitType.JODI:
            case Constants.HomeUnitType.STUDIO:
            case Constants.HomeUnitType.INDEPENDENT_FLOOR: {
                if (isMissing(details?.tower)) errors.push("listing_details.tower");
                if (isMissing(details?.unit_no)) errors.push("listing_details.unit_no");
                if (isMissing(details?.floor_no)) errors.push("listing_details.floor_no");
                if (isMissing(details?.UnitFloorPosition)) errors.push("listing_details.UnitFloorPosition");
                if (isMissing(details?.no_of_balconies)) errors.push("listing_details.no_of_balconies");
                if (isMissing(details?.furnishing)) errors.push("listing_details.furnishing");
                if (isMissing(details?.flooring_type)) errors.push("listing_details.flooring_type");
                if (isMissing(details?.ceiling_height)) errors.push("listing_details.ceiling_height");
                if (isMissing(details?.ceiling_height_side)) errors.push("listing_details.ceiling_height_side");
                if (isMissing(details?.view)) errors.push("listing_details.view");
                if (isMissing(details?.entry_direction)) errors.push("listing_details.entry_direction");
                if (isMissing(details?.exit_direction)) errors.push("listing_details.exit_direction");
                if (isMissing(details?.cross_ventilation)) errors.push("listing_details.cross_ventilation");
                if (isMissing(details?.natural_light)) errors.push("listing_details.natural_light");
                if (isMissing(details?.no_of_parkings)) errors.push("listing_details.no_of_parkings");
                break;
            }

            case Constants.HomeUnitType.VILLA:
            case Constants.HomeUnitType.INDEPENDENT_HOUSE:
            case Constants.HomeUnitType.HOLIDAY_HOME:
            case Constants.HomeUnitType.ROW_TOWN_HOUSE: {
                if (isMissing(details?.share)) errors.push("listing_details.share");
                if (isMissing(details?.unit_no)) errors.push("listing_details.unit_no");
                if (isMissing(details?.structure)) errors.push("listing_details.structure");
                if (isMissing(details?.furnishing)) errors.push("listing_details.furnishing");
                if (isMissing(details?.exit_direction)) errors.push("listing_details.exit_direction");
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
        if (isMissing(address?.locality)) errors.push("listing_address.locality");
        if (isMissing(details?.project)) errors.push("listing_details.project");
        if (isMissing(details?.property_status)) errors.push("listing_details.property_status");
        if (isMissing(details?.tower)) errors.push("listing_details.tower");
        if (isMissing(details?.floor_no)) errors.push("listing_details.floor_no");
        if (isMissing(details?.UnitFloorPosition)) errors.push("listing_details.UnitFloorPosition");
        // if (isMissing(details?.locationHub)) errors.push("listing_details.locationHub");
        if (isMissing(details?.unit_no)) errors.push("listing_details.unit_no");
        if (isMissing(details?.unit_type)) errors.push("listing_details.unit_type");
        if (isMissing(details?.area_unit_type)) errors.push("listing_details.area_unit_type");
        if (isMissing(details?.no_of_seats)) errors.push("listing_details.no_of_seats");
        if (isMissing(details?.no_of_conference_rooms)) errors.push("listing_details.no_of_conference_rooms");
        if (isMissing(details?.pantry)) errors.push("listing_details.pantry");

        if (isMissing(commercial?.availability_status)) errors.push("commercial_details.availability_status");
        if (isMissing(commercial?.available_from)) errors.push("commercial_details.available_from");
        if (isMissing(commercial?.visit_day)) errors.push("commercial_details.visit_day");
        if (isMissing(commercial?.start_time)) errors.push("commercial_details.start_time");
        if (isMissing(commercial?.end_time)) errors.push("commercial_details.end_time");
        if (isMissing(commercial?.current_occupation_status)) errors.push("commercial_details.current_occupation_status");
        if (isMissing(commercial?.brokerage_terms)) errors.push("commercial_details.brokerage_terms");
        return;
    }

    // INDUSTRIAL
    if (listing.listing_type === Constants.ListingType.INDUSTRIAL) {
        if (isMissing(details?.unit_on_floor)) errors.push("listing_details.unit_on_floor");
        if (isMissing(details?.area_unit_type)) errors.push("listing_details.area_unit_type");

        // // Conditional location checks based on region type
        // if (address?.region_type === "URBAN") {
        //     if (isMissing(details?.unit_no)) errors.push("listing_details.unit_no");
        // } else if (address?.region_type === "RURAL") {
        //     if (isMissing(address?.district)) errors.push("listing_address.district");
        // }
        return;
    }
    // RETAIL
    if (listing.listing_type === Constants.ListingType.RETAIL) {
        if (isMissing(details?.building_name)) errors.push("listing_details.building_name");
        if (isMissing(details?.unit_no)) errors.push("listing_details.unit_no");
        if (isMissing(details?.unit_on_floor)) errors.push("listing_details.unit_on_floor");
        if (isMissing(details?.building_status)) errors.push("listing_details.building_status");
        if (isMissing(details?.building_type)) errors.push("listing_details.building_type");
        if (isMissing(details?.unit_type)) errors.push("listing_details.unit_type");
        if (isMissing(details?.area_unit_type)) errors.push("listing_details.area_unit_type");
        return;
    }
    // LAND
    if (listing.listing_type === Constants.ListingType.LAND) {
        if (isMissing(details?.plot_survey_no)) errors.push("listing_details.plot_survey_no");
        if (isMissing(details?.area_unit_type)) errors.push("listing_details.area_unit_type");

        // if (address?.region_type === "RURAL") {
        //     if (isMissing(address?.district)) errors.push("listing_address.district");
        // }
        return;
    }   
    // Unsupported listing type
    errors.push(`Unsupported listing_type: ${listing.listing_type}`);
};

//main submission validation for action
export const validateListingSubmission = (listing: Record<string, any>): string[] => {
    const errors: string[] = [];
    validateCommonSubmissionFields(listing, errors);
    validateUnitTypeFields(listing, errors);
    return [...new Set(errors)];
};
