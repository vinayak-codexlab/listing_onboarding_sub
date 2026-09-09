import { Router, type Request, type Response } from "express";
import { getListingById, listingOnboarding,updateListingStatus} from "../controllers/listing.controller.js";
import { Protect } from "../middlewares/authCheck.js";

const router = Router();
router.use(Protect);

const methodNotAllowed = (req: Request, res: Response) => {
  res.set("Allow", "POST");

  return res.status(405).json({
    success: false,
    message: `${req.method} is not allowed on this endpoint`
  });
};

router.route("/").post(listingOnboarding).all(methodNotAllowed);
router.route("/:id")
    .get(getListingById)
    .patch(updateListingStatus)
    

export default router;
