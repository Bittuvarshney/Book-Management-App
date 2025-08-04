const {book} = require("../models/bookmodel")

const handlebookstorecontroller = async (req,res)=>{
     try{
        const body = req.body;
        if(!body. BookName || !body.Tittle || !body.Author || !body.SellingPrice){
            return res.status(400).json({Message:"All field's are required", Success:false})
        }

        const addbook = await book.insertOne(body)

        if(addbook){
            return res.status(201).json({Message:"data inserted successfully " , Success:true,Id:addbook?._id })
        }

     }catch(err){
        res.status(500).json({Message:err.message, Success:false})

     }
}

const handlebooklistcontroller = async (req,res)=>{
    try{
        const allbooks = await book.find({})
        if(allbooks){
            return res.status(200).json({Message:"All books fetch successfully", Success:true, TotalCount:allbooks.length, BookList:allbooks})
        }
    }catch(err){
        res.status(500).json({Message:err.message, Success:false})
    }
}

const handledelete = async (req, res) => {
  const body = req.body;
  try {
    const deleted = await book.deleteOne({ _id: body.id });
    if (deleted.acknowledged) {
      return res.json({ Message: "Book deleted successfully", Success: true });
    }
  } catch (error) {
    return res.status(500).json({ Message: error.message, Success: false });
  }
};

const handleupdate = async (req,res)=>{
    try {
         const body = req.body;
        
        const updating = await book.updateOne({_id:body?.Id},{$set:body})
         if (updating.acknowledged) {
      return res.json({ Message: "Book update successfully", Success: true });
    }
    } catch (error) {
        return res.status(500).json({ Message: error.message, Success: false });
    }
  }


module.exports = {handlebookstorecontroller,handlebooklistcontroller,handledelete,handleupdate}