import { describe, expect, it } from "vitest";
import { validateListingData } from "../validations/listing.validation.js";

const listingId = "507f1f77bcf86cd799439011";

const validateUpdate = (fields: Record<string, unknown>) =>
  validateListingData({ _id: listingId, ...fields });

describe("validateListingData", () => {
  it("rejects an empty request body", () => {
    expect(() => validateListingData({})).toThrow("Request body cannot be empty");
  });

  it("requires meaningful listing data when creating", () => {
    expect(() =>
      validateListingData({
        listing_type: "home",
        current_step: "essential",
        onboarding_type: "manual",
        key_features: []
      })
    ).toThrow("At least one non-empty listing field is required");
  });

  it("returns trimmed and coerced field values", () => {
    const result = validateUpdate({
      "listing_details.listing_name": "  Apple BKC  ",
      "listing_details.no_of_parkings": "2"
    });

    expect(result["listing_details.listing_name"]).toBe("Apple BKC");
    expect(result["listing_details.no_of_parkings"]).toBe(2);
  });

  it("rejects an invalid listing type and unit type combination", () => {
    expect(() =>
      validateUpdate({
        listing_type: "land",
        "listing_details.unit_type": "independent_house"
      })
    ).toThrow("Invalid unit_type 'independent_house' for listing_type 'land'");
  });

  it("rejects a visit window whose end is not later than its start", () => {
    expect(() =>
      validateUpdate({
        "commercial_details.start_time": "10:00",
        "commercial_details.end_time": "09:00"
      })
    ).toThrow("end_time must be later than start_time");
  });

  it("rejects a unit combined with itself after trimming", () => {
    expect(() =>
      validateUpdate({
        "listing_details.unit_no": " 1001 ",
        "listing_details.combine_unit_no": ["1001"]
      })
    ).toThrow("combine_unit_no cannot include the primary unit_no");
  });

  it("rejects a past availability date for an under-construction listing", () => {
    expect(() =>
      validateUpdate({
        "commercial_details.availability_status": "under_construction",
        "commercial_details.available_from": "2000-01-01T00:00:00Z"
      })
    ).toThrow(
      "available_from must be a future date when availability_status is under_construction"
    );
  });

  it("rejects a protected field", () => {
    expect(() =>
      validateUpdate({
        "listing_details.listing_status": "approved"
      })
    ).toThrow("Field cannot be provided: listing_details.listing_status");
  });
});
