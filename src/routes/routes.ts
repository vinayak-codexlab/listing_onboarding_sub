import listingRoute from "./listing.route.js";

const baseUrl = "/v1/user/listing-onboarding";

const routes=(app:any)=>{
    app.use(`${baseUrl}`, listingRoute);
};

export default routes;
