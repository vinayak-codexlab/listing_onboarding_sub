export function formatListingResponse(doc: any): Record<string, any> {
  const raw = doc?.toObject ? doc.toObject() : doc; //normalizer 

  if (!raw) return raw;

  return {
    _id: raw._id,
    listing_type: raw.listing_type,
    listing_details: raw.listing_details,
    commercial_details: raw.commercial_details,
    lastUpdate: raw.lastUpdate,
    broker_and_agent: raw.broker_and_agent,
    key_features: raw.key_features ?? [],
    onboarding_type: raw.onboarding_type,
    property_details: raw.property_details,
    listing_address: raw.listing_address,
    furnishingAmenities: raw.furnishingAmenities ?? [],
    apartmentAmenities: raw.apartmentAmenities ?? [],
    firm_name: raw.firm_name,
    broker_name: raw.broker_name,
    is_personalized: raw.is_personalized,
    vrTour: raw.vrTour,
    coverImageKey: raw.coverImageKey,
    listing_id: raw.listing_id,
    current_step: raw.current_step,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    __v: raw.__v
  };
}