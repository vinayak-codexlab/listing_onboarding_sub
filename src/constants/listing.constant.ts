export enum ListingType {
  HOME = "home",
  OFFICE = "office",
  INDUSTRIAL = "industrial",
  RETAIL = "retail",
  LAND = "land",
}
// listing sub types...
export enum HomeUnitType {
  STUDIO = "studio",
  APARTMENT = "apartment",
  DUPLEX = "duplex",
  PENTHOUSE = "penthouse",
  JODI = "jodi",
  INDEPENDENT_FLOOR = "independent_floor",
  INDEPENDENT_HOUSE = "independent_house",
  VILLA = "villa",
  HOLIDAY_HOME = "holiday_home",
  ROW_TOWN_HOUSE = "row/town_house",
}
export enum OfficeUnitType {
    INDEPENDENT_HOUSE = "independent_house",
    INDEPENDENT_BUILDING = "independent_building",
}
export enum IndustrialUnitType {
    WAREHOUSE = "warehouse",
    DARKSTORE = "darkstore",
    SHED = "shed",
    GODOWN = "godown",
    IN_BUILDING = "inbuilding",
}
export enum RetailUnitType{
    SHOP = "shop",
    SHOWROOM = "showroom",
}
export enum LandUnitType{
    RESIDENTIAL_PLOT = "residential_plot",
    COMMERCIAL_LAND = "commercial_land",
    AGRICULTURE_LAND = "agriculture_land",
    INDUSTRIAL_LAND = "industrial_land",
    FARM_HOUSE = "farm_house",
}

// listing status
export enum ListingStatus{
    WORK_IN_PROGRESS = "work_in_progress",
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    DELISTED = "delisted",
    RELISTED = "relisted",
    DELETED = "deleted",
}
export enum OnboardingStep {
    ESSENTIAL = "essential",
    DETAILS = "details",
    KEY_FEATURES = "key_features",
    IMAGES = "images",
    VIDEOS = "videos",
    AMENITIES = "amenities"
}

//-----common usages enums--------
export enum YesAndNo{
    YES = "yes",
    NO = "no",
}

//==========
export const UNIT_TYPES_BY_LISTING_TYPE = {
    [ListingType.HOME]: Object.values(HomeUnitType),
    [ListingType.OFFICE]: Object.values(OfficeUnitType),
    [ListingType.INDUSTRIAL]: Object.values(IndustrialUnitType),
    [ListingType.RETAIL]: Object.values(RetailUnitType),
    [ListingType.LAND]: Object.values(LandUnitType),
} as const;
