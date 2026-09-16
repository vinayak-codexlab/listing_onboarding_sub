import listingRoute from "./listing.route.js";

const baseUrl = "/v1/listing/onboarding";

const routes=(app:any)=>{
    app.use(`${baseUrl}`, listingRoute);
};

export default routes;
 