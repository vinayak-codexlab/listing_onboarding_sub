import request from "supertest";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../utils/apiError.js";

vi.mock("../services/listing.service.js", () => ({
    default: {
        saveListing: vi.fn(),
        getListingById: vi.fn(),
        updateListingStatus: vi.fn()
    }
}));

import app from "../app.js";
import listingService from "../services/listing.service.js";

const service = vi.mocked(listingService);
const listingId = "507f1f77bcf86cd799439011";

const token = jwt.sign(
    {
        sub: "user-123",
        firm_id: "507f1f77bcf86cd799439012"
    },
    process.env.JWT_SECRET!
);

const auth = {
    Authorization: `Bearer ${token}`
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("Listing endpoints", () => {
    describe("POST /v1/user/listing/listing-onboarding", () => {
        it("creates a listing", async () => {
            const listing = {
                _id: listingId,
                listing_type: "home",
                current_step: "essential"
            };

            service.saveListing.mockResolvedValue({
                created: true,
                listing
            });

            const response = await request(app)
                .post("/v1/user/listing/listing-onboarding")
                .set(auth)
                .send({
                    listing_type: "home",
                    current_step: "essential"
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                success: true,
                message: "Listing created successfully.",
                data: listing
            });
            expect(service.saveListing).toHaveBeenCalledWith(
                { listing_type: "home", current_step: "essential" },
                { sub: "user-123", firm_id: "507f1f77bcf86cd799439012" }
            );
        });

        it("updates a listing when _id is supplied", async () => {
            const listing = { _id: listingId, listing_type: "home" };
            service.saveListing.mockResolvedValue({ created: false, listing });

            const response = await request(app)
                .post("/v1/user/listing/listing-onboarding")
                .set(auth)
                .send({ _id: listingId, listing_type: "home" });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Listing updated successfully.");
            expect(response.body.data).toEqual(listing);
        });

        it("rejects an unauthenticated request", async () => {
            const response = await request(app)
                .post("/v1/user/listing/listing-onboarding")
                .send({
                    listing_type: "home",
                    current_step: "essential"
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(service.saveListing).not.toHaveBeenCalled();
        });

        it("rejects an invalid or expired token", async () => {
            const expiredToken = jwt.sign(
                { sub: "user-123", firm_id: "507f1f77bcf86cd799439012" },
                process.env.JWT_SECRET!,
                { expiresIn: -1 }
            );

            const response = await request(app)
                .post("/v1/user/listing/listing-onboarding")
                .set("Authorization", `Bearer ${expiredToken}`)
                .send({ listing_type: "home", current_step: "essential" });

            expect(response.status).toBe(401);
            expect(service.saveListing).not.toHaveBeenCalled();
        });

        it("rejects an invalid listing field", async () => {
            const response = await request(app)
                .post("/v1/user/listing/listing-onboarding")
                .set(auth)
                .send({
                    invalid_field: "value"
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(service.saveListing).not.toHaveBeenCalled();
        });

        it("rejects protected fields before calling the service", async () => {
            const response = await request(app)
                .post("/v1/user/listing/listing-onboarding")
                .set(auth)
                .send({
                    listing_type: "home",
                    "listing_details.listing_status": "approved"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain("cannot be provided");
            expect(service.saveListing).not.toHaveBeenCalled();
        });
    });

    describe("GET /v1/user/listing/listing-onboarding/:id", () => {
        it("returns a listing", async () => {
            const listing = {
                _id: listingId,
                listing_type: "home",
                listing_details: {},
                commercial_details: {},
                broker_and_agent: {},
                key_features: [],
                current_step: "essential"
            };

            service.getListingById.mockResolvedValue(listing);

            const response = await request(app)
                .get(`/v1/user/listing/listing-onboarding/${listingId}`)
                .set(auth);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(listing);

            expect(service.getListingById).toHaveBeenCalledWith(
                listingId,
                {
                    sub: "user-123",
                    firm_id: "507f1f77bcf86cd799439012"
                }
            );
        });

        it("rejects an invalid ObjectId", async () => {
            const response = await request(app)
                .get("/v1/user/listing/listing-onboarding/not-an-object-id")
                .set(auth);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(service.getListingById).not.toHaveBeenCalled();
        });

        it("returns 404 when the listing does not exist", async () => {
            service.getListingById.mockRejectedValue(
                new ApiError(404, "Listing not found")
            );

            const response = await request(app)
                .get(`/v1/user/listing/listing-onboarding/${listingId}`)
                .set(auth);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                success: false,
                message: "Listing not found"
            });
        });

        it("returns 500 for an unexpected service failure", async () => {
            service.getListingById.mockRejectedValue(new Error("Database offline"));

            const response = await request(app)
                .get(`/v1/user/listing/listing-onboarding/${listingId}`)
                .set(auth);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: "Internal server error !"
            });
        });
    });

    describe("PATCH /v1/user/listing/listing-onboarding/:id", () => {
        it("updates the listing status", async () => {
            const listing = {
                _id: listingId,
                listing_details: {
                    listing_status: "delisted"
                }
            };

            service.updateListingStatus.mockResolvedValue(listing);

            const response = await request(app)
                .patch(`/v1/user/listing/listing-onboarding/${listingId}`)
                .set(auth)
                .send({
                    action: "delisted"
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: "Listing status updated successfully.",
                data: listing
            });
        });

        it("rejects an invalid status action", async () => {
            const response = await request(app)
                .patch(`/v1/user/listing/listing-onboarding/${listingId}`)
                .set(auth)
                .send({
                    action: "invalid-status"
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(service.updateListingStatus).not.toHaveBeenCalled();
        });

        it.each([
            "pending",
            "approved",
            "rejected",
            "delisted",
            "relisted",
            "deleted"
        ])("accepts the %s status action", async (action) => {
            const listing = { _id: listingId };
            service.updateListingStatus.mockResolvedValue(listing);

            const response = await request(app)
                .patch(`/v1/user/listing/listing-onboarding/${listingId}`)
                .set(auth)
                .send({ action });

            expect(response.status).toBe(200);
            expect(service.updateListingStatus).toHaveBeenCalledWith(
                listingId,
                action,
                { sub: "user-123", firm_id: "507f1f77bcf86cd799439012" }
            );
        });

        it("returns a service ApiError", async () => {
            service.updateListingStatus.mockRejectedValue(
                new ApiError(403, "Only the listing owner can perform this action !")
            );

            const response = await request(app)
                .patch(`/v1/user/listing/listing-onboarding/${listingId}`)
                .set(auth)
                .send({ action: "approved" });

            expect(response.status).toBe(403);
            expect(response.body.message).toBe(
                "Only the listing owner can perform this action !"
            );
        });

        it("rejects an invalid ObjectId", async () => {
            const response = await request(app)
                .patch("/v1/user/listing/listing-onboarding/not-an-object-id")
                .set(auth)
                .send({ action: "delisted" });

            expect(response.status).toBe(400);
            expect(service.updateListingStatus).not.toHaveBeenCalled();
        });

        it("rejects an unauthenticated request", async () => {
            const response = await request(app)
                .patch(`/v1/user/listing/listing-onboarding/${listingId}`)
                .send({
                    action: "delisted"
                });

            expect(response.status).toBe(401);
        });
    });
});