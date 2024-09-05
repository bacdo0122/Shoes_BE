const Category = require('../../Models/category')

module.exports.index = async (req, res) => {

    let category;
    if(req.query.gender){
        category = await Category.find({gender: req.query.gender})
    } else{
        category = await Category.find()
        
    }
    console.log("category:", category)

    res.json(category)

}