import { db } from "../db/client.js"
import { assignments } from "../db/schemas/assignment_schema.js"
const createAssignment = async (req, res) => {
    try {
        const {title, description, due_date} = req.body;

        const assignment = await  db.insert(assignments).values({
             title, description, due_date: due_date ? new Date(due_date) : null, 
        }).returning()

         return res.status(201).json({ success: true, message: "Assignment Created Successfully", data: assignment })
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
  }
    
}

const getAllAssignments = async (_req, res) => {
    try {
        const allAssignments = await db.select().from(assignments)
         return res.status(200).json({ 
            success: true, 
            results: allAssignments.length,
            data: allAssignments 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }

}

export default {
    createAssignment,
    getAllAssignments
}