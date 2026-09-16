import { beforeEach, describe, expect, it, vi } from "vitest";

const listingModel = vi.hoisted(() => ({
  findOne: vi.fn(),
  findOneAndUpdate: vi.fn(),
  create: vi.fn(),
  deleteOne: vi.fn()
}));

vi.mock("../models/listing.model.js", () => ({
  default: listingModel
}));

import listingService from "../services/listing.service.js";

const listingId = "507f1f77bcf86cd799439011";
const auth = {
  sub: "user-123",
  firm_id: "507f1f77bcf86cd799439012"
};

describe("ListingService partial-update validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects a listing-type change that leaves an incompatible existing unit type", async () => {
    listingModel.findOne.mockResolvedValue({
      _id: listingId,
      listing_type: "office",
      listing_details: {
        unit_type: "independent_house"
      }
    });

    await expect(
      listingService.saveListing(
        {
          _id: listingId,
          listing_type: "land"
        },
        auth
      )
    ).rejects.toThrow(
      "unit_type 'independent_house' is not valid for listing_type 'land'"
    );

    expect(listingModel.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it("accepts a type change when a compatible unit type is supplied", async () => {
    listingModel.findOne.mockResolvedValue({
      _id: listingId,
      listing_type: "office",
      listing_details: {
        unit_type: "independent_house"
      }
    });

    listingModel.findOneAndUpdate.mockResolvedValue({
      _id: listingId,
      listing_type: "land",
      listing_details: {
        unit_type: "residential_plot"
      }
    });

    await expect(
      listingService.saveListing(
        {
          _id: listingId,
          listing_type: "land",
          "listing_details.unit_type": "residential_plot"
        },
        auth
      )
    ).resolves.toMatchObject({ created: false });

    expect(listingModel.findOneAndUpdate).toHaveBeenCalledOnce();
  });
});
