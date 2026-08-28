export enum Direction{
  NORTH = "N",
  SOUTH = "S",
  EAST = "E",
  WEST = "W",
  NORTH_EAST = "NE",
  NORTH_WEST = "NW",
  SOUTH_EAST = "SE",
  SOUTH_WEST = "SW",
  NA = "NA",
}
export enum AreaUnitType {
  SQFT = "sqft",
  SQM = "sqm",
}
export enum CrossVentilation {
  YES = "yes",
  NO = "no",
}
export enum NaturalLight {
  YES = "yes",
  NO = "no",
}
export enum VastuCompliant {
  YES = "yes",
  NO = "no",
}
export enum PetsAllowed {
  YES = "yes",
  NO = "no",
}
export enum FurnishingType{
  BARE_SHELL = "bare_shell",
  BUILDER_CONDITION = "builder_condition",
  UNFURNISHED = "unfurnished",
  SEMI_FURNISHED = "semi_furnished",
  FULL_FURNISHED = "fully_furnished",
}
export enum ParkingType {
  COVERED = "covered",
  OPEN = "open",
  LIFT = "lift",
  NOT_DEFINED = "not_defined",
  STACK = "stack",
  TANDEM = "tandem",
}
export enum VisitDay {
  EVERYDAY = "everyday",
  WEEKDAY = "weekday",
  WEEKEND = "weekend",
  PARTICULAR_DAY = "particular_day",
}
export enum Day {
  SUNDAY = "sunday",
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
}
export enum BrokerageTerms{
  SIDE_BY_SIDE = "side_by_side",
  PLUS_ONE = "plus_1",
  DISCUSS = "discuss",
}
export enum NoticeNeededDuration{
  NONE = "none",
  ONE_HOUR = "1_hour",
  TWO_HOURS = "2_hours",
  SAME_DAY = "same_day",
  ONE_DAY = "1_day",
  NO="no",
  TWO_DAYS="2_days",
  THREE_DAYS="3_days",

}
export enum CurrentOccupancy{
  OWNER_OCCUPIED = "owner_occupied",
  TENANT_OCCUPIED = "tenant_occupied",
  VACANT_WITH_KEYS = "vacant_with_keys",
  VACANT_WITHOUT_KEYS = "vacant_without_keys",
  UNDER_CONSTRUCTION = "under_construction",
}
export enum AreaType{
  USABLE_CARPET = "usable_carpet",
  RERA_CARPET = "rera_carpet",
  MOFA_CARPET = "mofa_carpet",
  BUILT_UP = "built_up",
  TOTAL_SELLABLE = "total_sellable"
}

//land type enums data
export enum LandOwnershipType{
  FREEHOLD = "freehold",
  LEASEHOLD = "leasehold",
  POWER_OF_ATTORNEY = "power_of_attorney",
  PAGDI = "pagdi",
  OTHER = "other",
}

export enum PlotShape{
  REGULAR = "regular",
  IRREGULAR = "irregular",
  L_SHAPED = "l_shaped",
  TRIANGULAR = "triangular",
  OTHER = "other",
}

export enum LandTapography{
  FLAT = "flat",
  SLOPED = "sloped",
  UNDULATING = "undulating",
  HILLY = "hilly",
}

export enum NoOfOpenSides{
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
}

export enum AccessRoad{
  SINGLE_ROAD = "single_road",
  DOUBLE_ROAD = "double_road",
  TRIPLE_ROAD = "triple_road",
  NO_DIRECT_ROAD_ACCESS = "no_direct_road_access",
}

export enum RoadType{
  TAR = "tar",
  CONCRETE = "concrete",
  GRAVEL = "gravel",
  KACHCHA = "kachcha",
  NH = "nh",
  SH = "sh"
}

export enum RoadFacingSide{
  NORTH = "north",
  SOUTH = "south",
  EAST = "east",
  WEST = "west",
  NORTH_EAST = "north_east",
  NORTH_WEST = "north_west",
  SOUTH_EAST = "south_east",
  SOUTH_WEST = "south_west",
}

export enum SourceOfWater{
  MUNICIPAL = "municipal",
  BOREWELL = "borewell",
  WELL = "well",
  CANAL = "canal",

  NONE = "none",
  TANKER = "tanker",
  OTHER = "other",
}

export enum SewageDrainage{
  MUNCIPAL = "municipal",
  SEPTIC="septic",
  OPEN="open",
  NONE="none",
}

export enum ExistingStructure{
  Vacant = "vacant",
  DEMOLISHED_STRUCTURE = "demolished_structure",
  OLD_STUCTURE_STANDING = "old_structure_standing",
}

export enum ElectricityConnection{
  YES = "yes",
  NO = "no",
  NEARBY_AVAILABLE = "nearby_available",
}

//retail
export enum FitOutCondition{
  BARE_SHELL = "bare_shell",
  WARM_SHELL = "warm_shell",
  FURNISHED = "furnished",
  SEMI_FURNISHED = "semi_furnished",
  UNFURNISHED = "unfurnished",
}

export enum FlooringType{
  VITRIFIED_TILE = "vitrified_tile",
  MARBLE = "marble",
  WOODEN = "wooden",
  BARE_SHELL = "bare_shell",
  NOT_DEFINED = "not_defined",
}

export enum VisibilityFrom {
  MAIN_ROAD = "main_road",
  INTERNAL_ROAD = "internal_road",
  MARKET="market",
  MALL_ATRIUM="mall_atrium",
  CORNER="corner",
  OTHER="other",
}

export enum KeysOccupancy {
  WITH_OWNER = "with_owner",
  WITH_BROKER = "with_broker",
  WITH_SECURITY = "with_security",
  TENANT_OCCUPIED = "tenant_occupied",
  VACANT="vacant",
}