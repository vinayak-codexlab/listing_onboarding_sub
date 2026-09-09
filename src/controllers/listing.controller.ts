import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {validateListingData, listingActionSchema} from "../validations/index.validation.js";
import {objectIdSchema} from "../validations/index.validation.js";
import listingService from "../services/listing.service.js";

const getAuth = (req: Request) => ({
    sub: req.user!.sub,
    firm_id: req.user!.firm_id
});
export const listingOnboarding = asyncHandler(async(req:Request, res:Response) => {
    if (!req.user) {
        res.status(401).json({success: false, message: "Unauthorized access"});
        return;
    }
    const result = await listingService.saveListing(validateListingData(req.body),getAuth(req));
    res.status(result.created ? 201 : 200).json({
        success: true,
        message: result.created
            ? "Listing created successfully."
            : "Listing updated successfully.",
        data: result.listing
    });
});
export const getListingById = asyncHandler(async (req:Request, res:Response) => {
    if (!req.user) {
        res.status(401).json({success: false, message: "Unauthorized access"});
        return;
    }
    const id = objectIdSchema.parse(req.params.id);
    const listing = await listingService.getListingById(id, getAuth(req));
    res.status(200).json({
        success: true,
        data: listing
    });
});
export const updateListingStatus = asyncHandler(async (req:Request, res:Response) => {
    if (!req.user) {
        res.status(401).json({success: false, message: "Unauthorized access"});
        return;
    }
    const data = listingActionSchema.parse({params: req.params, body: req.body});
    const listing = await listingService.updateListingStatus(
        data.params.id,
        data.body.action,
        getAuth(req)
    );
    res.status(200).json({
        success: true,
        message: "Listing status updated successfully.",
        data: listing
    });
});
