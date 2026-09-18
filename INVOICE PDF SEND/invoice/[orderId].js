import { createRouter } from "next-connect";
import { getInvoice } from "../../../../controllers/authController";
import onError from "../../../../middlewares/error";
import { isAuthenticatedUser } from "../../../../middlewares/auth";

const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .get(getInvoice);

export default router.handler();