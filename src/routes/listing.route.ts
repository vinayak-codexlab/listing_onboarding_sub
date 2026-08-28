import { Router } from "express";
import { getListingById, listingOnboarding,updateListingStatus} from "../controllers/listing.controller.js";
import { Protect } from "../middlewares/authCheck.js";

const router = Router();
router.use(Protect);

router.route("/").post(listingOnboarding);
router.route("/:id")
    .get(getListingById)
    .patch(updateListingStatus);

export default router;
