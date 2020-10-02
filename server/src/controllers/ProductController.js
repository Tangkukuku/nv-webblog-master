const {Product} = require('../models')

module.exports = {
    // indx with serach Product
    async index (req, res) {
        try {
            let products = null
            const search = req.query.search
            // console.log('search key: ' + search)
            if (search) {
                products = await Product.findAll({
                    where: {
                        $or: [
                            'title', 'content', 'category'
                        ].map(key => ({
                            [key]: {
                                $like: `%${search}%`,
                            }
                        })),
                    },
                    order: [['createdAt', 'DESC']]
                })
            } else {
                products = await Product.findAll({
                    order: [['createdAt', 'DESC']]
                })
            }
                res.send(products)
            } catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the products'
            })
        }
    },
    // create Product
    async create (req, res) {
        // res.send(JSON.stringify(req.body))
        try {
            const product = await Product.create(req.body)
            res.send(product.toJSON())
        } catch (err) {
            res.status(500).send({
                error: 'Create Product incorrect'
            })
        }
    },
    // edit Product, suspend, active
    async put (req, res) {
        try {
            await Product.update(req.body, {
                where: {
                    id: req.params.productId
                }
            })
        res.send(req.body)
        } catch (err) {
            req.status(500).send({
                error: 'Update Product incorrect'
            })
        }
    },
        // delete Product
    async remove (req, res) {
        try {
            const product = await Product.findOne({
                where: {
                id: req.params.productId
                }
            })
            if(!product){
                return res.status(403).send({
                    error: 'The Product information was incorrect'
                })
            }
            await product.destroy()
            res.send(product)
        } catch (err) {
            req.status(500).send({
                error: 'The Product information was incorrect'
            })
        }
    },
        // get Product by id
    async show (req, res) {
        try {
            const product = await Product.findById(req.params.productId)
            res.send(product)
        } catch (err) {
            req.status(500).send({
                error: 'The Product information was incorrect'
            })
        }
    },
    async frontIndex (req, res) {
        try {
            let products = null
            const search = req.query.search
            console.log('----------> search key: ' + search)
            if (search) {
                products = await Product.findAll({
                    where: {
                        $or: [
                            'title', 'content', 'category'
                        ].map(key => ({
                            [key]: {
                                $like: `%${search}%`,
                            }
                        })),
                        $and: [
                            {
                                status:
                                {
                                    $eq: "published"
                                }
                            },
                        ]
                    },
                    order: [['createdAt', 'DESC']]
                })
            } else {
                products = await Product.findAll({
                where: {
                    'status': 'published'
                },
                    order: [['createdAt', 'DESC']]
                })
            }
            res.send(products)
        }catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the products'
            })
        }
    },

}