import { describe, expect, it } from "vitest";
import { validateListingData } from "../validations/listing.validation.js";
import { validateListingSubmission } from "../validations/submit.validation.js";

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

  describe("numeric boundaries", () => {
    it.each(["-1", "12", "1.5"])(
      "rejects invalid ceiling-height inches: %s",
      (value) => {
        expect(() =>
          validateUpdate({ "listing_details.ceiling_height_inch": value })
        ).toThrow();
      }
    );

    it.each(["0", "11"])(
      "accepts valid ceiling-height inches: %s",
      (value) => {
        const result = validateUpdate({
          "listing_details.ceiling_height_inch": value
        });
        expect(result["listing_details.ceiling_height_inch"]).toBe(Number(value));
      }
    );

    it.each(["0", "4", "26"])(
      "rejects an invalid ceiling height: %s",
      (value) => {
        expect(() =>
          validateUpdate({ "listing_details.ceiling_height": value })
        ).toThrow();
      }
    );

    it.each(["5", "25"])("accepts a valid ceiling height: %s", (value) => {
      const result = validateUpdate({ "listing_details.ceiling_height": value });
      expect(result["listing_details.ceiling_height"]).toBe(Number(value));
    });

    it.each(["-1", "1.5"])("rejects an invalid parking count: %s", (value) => {
      expect(() =>
        validateUpdate({ "listing_details.no_of_parkings": value })
      ).toThrow();
    });

    it.each([40110, 4011070, -401107, 40110.5])(
      "rejects invalid pincode: %s",
      (value) => {
        expect(() =>
          validateUpdate({ "listing_address.pincode": value })
        ).toThrow();
      }
    );

    it("accepts a six-digit pincode", () => {
      const result = validateUpdate({ "listing_address.pincode": 401107 });
      expect(result["listing_address.pincode"]).toBe(401107);
    });

    it("rejects a negative property price", () => {
      expect(() =>
        validateUpdate({ "commercial_details.property_price": -50000 })
      ).toThrow();
    });

    it("accepts discount prices at the 80% and 100% boundaries", () => {
      expect(() =>
        validateUpdate({
          "commercial_details.property_price": 100000,
          "commercial_details.discount_price": 80000
        })
      ).not.toThrow();

      expect(() =>
        validateUpdate({
          "commercial_details.property_price": 100000,
          "commercial_details.discount_price": 100000
        })
      ).not.toThrow();
    });

    it.each([79999, 100001])("rejects discount price outside bounds: %s", (value) => {
      expect(() =>
        validateUpdate({
          "commercial_details.property_price": 100000,
          "commercial_details.discount_price": value
        })
      ).toThrow(
        "commercial_details.discount_price must be between 80% and 100% of property_price"
      );
    });
  });

  describe("text safety", () => {
    it("rejects a whitespace-only listing name", () => {
      expect(() =>
        validateUpdate({ "listing_details.listing_name": "   " })
      ).toThrow("Listing name cannot be empty");
    });

    it("rejects a listing name over 240 characters", () => {
      expect(() =>
        validateUpdate({ "listing_details.listing_name": "a".repeat(241) })
      ).toThrow("Listing name cannot exceed 240 characters");
    });

    it.each(["<b>Apple</b>", "<script>alert(1)</script>"])(
      "rejects HTML in listing name: %s",
      (value) => {
        expect(() =>
          validateUpdate({ "listing_details.listing_name": value })
        ).toThrow("HTML is not allowed");
      }
    );

    it.each(["alert('xss')", "javascript:alert(1)", "onclick=alert(1)"])(
      "rejects script-like listing name: %s",
      (value) => {
        expect(() =>
          validateUpdate({ "listing_details.listing_name": value })
        ).toThrow("Script-like content is not allowed");
      }
    );
  });

  describe("date and visit rules", () => {
    it.each(["2026-13-45T00:00:00Z", 0, "0"])(
      "rejects invalid available_from: %s",
      (value) => {
        expect(() =>
          validateUpdate({ "commercial_details.available_from": value })
        ).toThrow();
      }
    );

    it("accepts a valid future ISO availability date", () => {
      expect(() =>
        validateUpdate({
          "commercial_details.availability_status": "under_construction",
          "commercial_details.available_from": "2099-01-01T00:00:00Z"
        })
      ).not.toThrow();
    });

    it.each(["25:00", "12:60", "9:00"])(
      "rejects invalid 24-hour time: %s",
      (value) => {
        expect(() =>
          validateUpdate({ "commercial_details.start_time": value })
        ).toThrow("Time must be in valid 24-hour HH:mm format");
      }
    );

    it("rejects a zero-length visit window", () => {
      expect(() =>
        validateUpdate({
          "commercial_details.start_time": "10:00",
          "commercial_details.end_time": "10:00"
        })
      ).toThrow("end_time must be later than start_time");
    });

    it("requires particular_day for a particular-day visit", () => {
      expect(() =>
        validateUpdate({
          "commercial_details.visit_day": "particular_day",
          "commercial_details.particular_day": null
        })
      ).toThrow("commercial_details.particular_day is required");
    });
  });

  describe("listing-type and commercial business rules", () => {
    it("rejects furnishing amenities for land", () => {
      expect(() =>
        validateUpdate({
          listing_type: "land",
          furnishingAmenities: ["Sofa"]
        })
      ).toThrow("furnishingAmenities is not allowed for land listings");
    });

    it("rejects apartment amenities outside home listings", () => {
      expect(() =>
        validateUpdate({
          listing_type: "office",
          apartmentAmenities: ["Swimming pool"]
        })
      ).toThrow("apartmentAmenities is only allowed for home listings");
    });

    it.each([
      "listing_details.ceiling_height",
      "listing_details.total_floor"
    ])("rejects %s for land listings", (field) => {
      expect(() => validateUpdate({ listing_type: "land", [field]: "13" })).toThrow(
        `${field} is not allowed for listing_type 'land'`
      );
    });

    it.each([
      "listing_details.power_in_KA",
      "listing_details.truck_access",
      "listing_details.lorry_bay_area"
    ])("rejects industrial-only field %s for home", (field) => {
      const value = field === "listing_details.power_in_KA" ? "100" : "yes";
      expect(() => validateUpdate({ listing_type: "home", [field]: value })).toThrow(
        `${field} is not allowed for listing_type 'home'`
      );
    });

    it("rejects area_type for land", () => {
      expect(() =>
        validateUpdate({
          listing_type: "land",
          "listing_details.area_type": "rera_carpet"
        })
      ).toThrow("invalid area_type");
    });

    it("rejects unsupported listing types", () => {
      expect(() => validateUpdate({ listing_type: "commercial" })).toThrow();
    });

    it("rejects security amount for a secondary sale", () => {
      expect(() =>
        validateUpdate({
          "commercial_details.property_purpose": "secondary_sale",
          "commercial_details.security_amount": 50000
        })
      ).toThrow("security_amount is only allowed for rent/lease listings");
    });

    it("rejects monthly rent for a secondary sale", () => {
      expect(() =>
        validateUpdate({
          "commercial_details.property_purpose": "secondary_sale",
          "commercial_details.monthly_rent": 50000
        })
      ).toThrow("monthly_rent is only allowed for rent/lease listings");
    });

    it("rejects stamp duty for rent/lease", () => {
      expect(() =>
        validateUpdate({
          "commercial_details.property_purpose": "rent/lease",
          "commercial_details.stamp_duty": 100000
        })
      ).toThrow("stamp_duty is only allowed for secondary_sale listings");
    });

    it("rejects non-zero charges when maintenance is included", () => {
      expect(() =>
        validateUpdate({
          "commercial_details.maintenance_included": "yes",
          "commercial_details.maintenance_charges": 5000
        })
      ).toThrow("maintenance_charges must be zero or omitted");
    });
  });

  describe("floor validation", () => {
    it("rejects floor numbers below basement level", () => {
      expect(() => validateUpdate({ "listing_details.floor_no": "-2" })).toThrow(
        "Floor number cannot be below -1"
      );
    });

    it.each(["-1", "0", "1"])("accepts supported floor number: %s", (value) => {
      const result = validateUpdate({ "listing_details.floor_no": value });
      expect(result["listing_details.floor_no"]).toBe(Number(value));
    });

    it("rejects floor number greater than total floors", () => {
      expect(() =>
        validateUpdate({
          "listing_details.floor_no": "21",
          "listing_details.total_floor": "20"
        })
      ).toThrow("floor_no cannot be greater than total_floor");
    });
  });
});

describe("validateListingSubmission", () => {
  const submissionWithKeyFeatures = (count: number) => ({
    key_features: Array.from({ length: count }, (_, index) => `Feature ${index + 1}`),
    listing_details: {},
    commercial_details: {},
    listing_address: {}
  });

  it.each([0, 4, 11])("reports invalid key-feature count: %s", (count) => {
    const errors = validateListingSubmission(submissionWithKeyFeatures(count));
    expect(errors.some((error) => error.startsWith("key_features"))).toBe(true);
  });

  it.each([5, 10])("accepts key-feature boundary count: %s", (count) => {
    const errors = validateListingSubmission(submissionWithKeyFeatures(count));
    expect(errors.some((error) => error.startsWith("key_features"))).toBe(false);
  });
});
