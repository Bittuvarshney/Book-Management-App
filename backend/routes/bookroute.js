const express = require("express")
const {handlebookstorecontroller,handlebooklistcontroller,handledelete,handleupdate} =  require("../controllers/bookcontroller")
const router = express.Router();
const {book} = require("../models/bookmodel")

router.post("/addbook",handlebookstorecontroller )
router.get("/booklists",handlebooklistcontroller )
router.post("/deletebook",handledelete)
router.put("/updatebook",handleupdate)

router.get("/getallbook", async (req, res) => {
  const allbooks = await book.find();
  res.status(200).json({ Success: true, data: allbooks });
});
// Define book routes here

module.exports = router