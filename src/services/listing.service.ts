import Listings from "../models/listing.model.js";
import { ListingStatus, OnboardingStep } from "../constants/index.constant.js";
import { ApiError } from "../utils/apiError.js";
import { validateListingSubmission } from "../validations/submit.validation.js";
import { formatListingResponse } from "../utils/responseFormatter.js";

type AuthContext = {
    sub: string;
    firm_id: string;
};
class ListingService {
    private generateListingId(): string {
        return `LST${Math.floor(
            1000000 + Math.random() * 9000000
        )}`;
    }
    async saveListing(data: Record<string, any>, auth: AuthContext) {
        const {_id, images, videos, listing_id, status, ...listingData } = data;

        const restrictedFields = ['listing_status', 'sub', 'firm_id', 'listing_id'];
        const forbiddenKey = Object.keys(data).find(key => 
            restrictedFields.some(field => key === field || key.endsWith(`.${field}`))
        );
        const hasForbiddenNested = 
            restrictedFields.some(field => data?.listing_details?.[field]) ||
            restrictedFields.some(field => data?.broker_and_agent?.[field]);

        if (forbiddenKey || hasForbiddenNested) {
            throw new ApiError(400, `Invalid update payload: Modifying restricted authentication or status fields is not allowed.`);
        }
        if (_id) {
            const listing = await Listings.findOneAndUpdate(
                {
                    _id,
                    "broker_and_agent.sub": auth.sub,
                    "broker_and_agent.firm_id": auth.firm_id
                },
                { $set:listingData },
                {
                    new: true,
                    runValidators: true
                }
            );
            if (!listing) {
                throw new ApiError(404, "Listing not found");
            }
            return {
                created: false,
                listing: formatListingResponse(listing)
            };
        }
        const listing = await Listings.create({
            ...listingData,
            broker_and_agent: {
                sub: auth.sub,
                firm_id: auth.firm_id
            },
            listing_id: this.generateListingId(),
            current_step:
                data.current_step ?? OnboardingStep.ESSENTIAL,
            listing_details: {
                ...listingData.listing_details,
                listing_status: ListingStatus.WORK_IN_PROGRESS
            }
        });
        return {
            created: true,
            listing : formatListingResponse(listing)
        };
    }
    async getListingById(id: string, auth: AuthContext) {
        const listing = await Listings.findOne({_id:id, "broker_and_agent.sub": auth.sub, "broker_and_agent.firm_id": auth.firm_id}).lean();
        if (!listing) {
            throw new ApiError(404, "Listing not found");
        }
        //media services
        // const media = await Media.findOne({ listing_id: listing._id}).lean();
        // return {
        //     ...listing.toObject(),
        //     images: media?.images ?? {
        //         apartment: [],
        //         ext_view_day: [],
        //         ext_view_night: [],
        //         amenities: [],
        //         plans: []
        //     },
        //     videos: media?.videos ?? []
        // };
        return formatListingResponse(listing);
    }
    async updateListingStatus(id: string, status: ListingStatus, auth: AuthContext) {
        const listing = await Listings.findOne({_id:id,"broker_and_agent.sub":auth.sub,"broker_and_agent.firm_id":auth.firm_id});
        if(!listing){
            throw new ApiError(404,"Listing data not found !");
        }
        switch(status){
            case ListingStatus.PENDING:{
                // throw new ApiError(400,"Cannot perform this action !");
                if(
                    listing.current_step !== OnboardingStep.AMENITIES && 
                    listing.current_step !== OnboardingStep.KEY_FEATURES
                ){
                    throw new ApiError(400, "Please complete all onboarding steps before submitting the listing !");
                }
                const missingFields = validateListingSubmission(listing.toObject());
                if (missingFields.length > 0){
                    throw new ApiError(400, `Please complete the following fields: ${missingFields.join(", ")}`);
                }
                listing.set("listing_details.listing_status",ListingStatus.PENDING);
                await listing.save();
                return formatListingResponse(listing);
            }
            case ListingStatus.APPROVED:
            case ListingStatus.REJECTED:{
                throw new ApiError(403,"Only the listing owner can perform this action !");
            }
            case ListingStatus.DELISTED:{
                listing.set("listing_details.listing_status", ListingStatus.DELISTED);
                await listing.save();
                return formatListingResponse(listing);
            }
            case ListingStatus.RELISTED:{
                if (listing.listing_details?.listing_status !== ListingStatus.DELISTED) {
                    throw new ApiError(400, "Only a delisted listing can be relisted");
                }
                const {_id,__v, createdAt, updatedAt, ...listingData} = listing.toObject();
                listingData.listing_id = this.generateListingId();

                //new listing status
                if(listingData.listing_details) {
                    listingData.listing_details.listing_status = ListingStatus.WORK_IN_PROGRESS;
                }
                // new listing creation
                const newListing = await Listings.create(listingData);
                // const media = await Media.findOne({listing_id:listing._id}).lean();
                // if(media){
                //     const {
                //         _id:mediaId, 
                //         __v:mediaVersion, 
                //         createdAt:mediaCreatedAt, 
                //         updatedAt:mediaUpdatedAt, 
                //         ...mediaData
                //     } = media;
                //     await Media.create({...mediaData,listing_id:newListing._id});
                // }
                return newListing;
            }
            case ListingStatus.DELETED:{
                // await Media.deleteMany({listing_id:listing._id});
                await Listings.deleteOne({_id:id, "broker_and_agent.sub":auth.sub, "broker_and_agent.firm_id":auth.firm_id});
                return {_id:id, deleted:true};
            }
            default:{
                throw new ApiError(400, `Unsupported listing status: ${status}`);
            }
        }
    }
}
const listingService = new ListingService();
export default listingService;

