import { Router } from "express";
import controllers from "../controllers/assignments.controller.js";

const router = Router();

router.get("/", controllers.getAllAssignments);
router.get("/stats", controllers.getAssignmentStats); // must be before "/:id"
router.get("/:id", controllers.getAssignmentById);
router.post("/", controllers.createAssignment); // was "/create"
router.patch("/:id", controllers.updateAssignment);
router.delete("/:id", controllers.deleteAssignment);

export default router;