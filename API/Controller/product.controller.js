
const Products = require('../../Models/product')
const Category = require('../../Models/category')


module.exports.index = async (req, res) => {

    const products = await Products.find()

    res.json(products)
}


module.exports.gender = async (req, res) => {

    const gender = req.query.gender;
    console.log("gender:", gender)
    const category = await Category.find({ gender: gender })

    res.json(category)

}

//TH: Hàm này dùng để phân loại sản phẩm
module.exports.category = async (req, res) => {

    const id_category = req.query.id_category
    const id_sortBy = req.query.sortBy

    let products_category
    console.log("req.query:", req.query)
    if (id_category === 'all'){
        if(id_sortBy === 'lowToHight'){
            products_category = await Products.find().sort({price_product: 1})
        } else if(id_sortBy === 'highToLow'){
            products_category = await Products.find().sort({price_product: -1})
        } else{
            products_category = await Products.find()
        }
    }else{
        if(id_sortBy === 'lowToHight'){
            products_category = await Products.find({ id_category: id_category }).sort({price_product: 1})
        } else if(id_sortBy === 'highToLow'){
            products_category = await Products.find({ id_category: id_category }).sort({price_product: -1})
        } else{
            products_category = await Products.find({ id_category: id_category })
        }
    }
    
    res.json(products_category)
}

//TH: Chi Tiết Sản Phẩm
module.exports.detail = async (req, res) => {

    const id = req.params.id

    const product = await Products.findOne({ _id: id })

    res.json(product)

}

module.exports.sortBy = async (req, res) => {
 
    const id_category = req.query.sortBy
    let products_category

    if (id_category === 'lowToHight'){
        products_category = await Products.aggregate([
            {
              $addFields: {
                priceNum: { $toDouble: "$price_product" }
              }
            },
            {
              $sort: { priceNum: 1 }
            }
          ]);
    }else if(id_category === 'highToLow'){
        products_category = await Products.aggregate([
            {
              $addFields: {
                priceNum: { $toDouble: "$price_product" }
              }
            },
            {
              $sort: { priceNum: -1 }
            }
          ]);
    } else{
        products_category = await Products.find();
    }
    
    res.json(products_category)
}


// QT: Tìm kiếm phân loại và phân trang sản phẩm
module.exports.pagination = async (req, res) => {

    //Lấy page từ query
    const page = parseInt(req.query.page) || 1

    //Lấy số lượng từ query
    const numberProduct = parseInt(req.query.count) || 1

    //Lấy key search từ query
    const keyWordSearch = req.query.search

    //Lấy category từ query
    const category = req.query.category

    const id_sortBy = req.query.sortBy

    //Lấy sản phẩm đầu và sẩn phẩm cuối
    var start = (page - 1) * numberProduct
    var end = page * numberProduct

    var products

    //Phân loại điều kiện category từ client gửi lên
    if (category === 'all'){
        if(id_sortBy === 'lowToHight'){
            products = await Products.find().sort({price_product: 1})
        } else if(id_sortBy === 'highToLow'){
            products = await Products.find().sort({price_product: -1})
        } else{
            products = await Products.find()

        }
    }else{
        if(id_sortBy === 'lowToHight'){
            products = await Products.find({ id_category: category }).sort({price_product: 1})
        } else if(id_sortBy === 'highToLow'){
            products = await Products.find({ id_category: category }).sort({price_product: -1})
        } else{
        products = await Products.find({ id_category: category })
        }
    }

    const total = products.length;
    var paginationProducts = products.slice(start, end)


    if (!keyWordSearch){
        
        res.json({data: paginationProducts, total})

    }else{
        var newData = paginationProducts.filter(value => {
            return value.name_product.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1
        })
        console.log("newData:", newData)

        res.json({data: newData, total})
    }

}

// Hàm này dùng để hiện những sản phẩm search theo scoll ở component tìm kiếm bên client
module.exports.scoll = async (req, res) => {

    const page = req.query.page
    
    const count = req.query.count

    const search = req.query.search

    //Lấy sản phẩm đầu và sẩn phẩm cuối
    const start = (page - 1) * count
    const end = page * count   

    const products = await Products.find()

    const newData = products.filter(value => {
        return value.name_product.toUpperCase().indexOf(search.toUpperCase()) !== -1
    })

    const paginationProducts = newData.slice(start, end)

    res.json(paginationProducts)

}
