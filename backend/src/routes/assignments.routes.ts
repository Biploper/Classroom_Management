import { Router } from "express";
import controllers from '../controllers/assignments.controller.js'
const router = Router()

router.post('/', controllers.createAssignment)
router.get('/', controllers.getAllAssignments)

export default router