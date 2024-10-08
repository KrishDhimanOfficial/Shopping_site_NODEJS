module.exports = {
    showTags: [
        {
            $lookup: {
                from: 'posts',
                localField: '_id',
                foreignField: 'tags',
                as: 'post'
            }
        },
        { $addFields: { postLength: { $size: "$post" } } },
        { $project: { post: 0 } }
    ],
    getOrderData: [
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $unwind: '$userDetails'
        },
        {
            $lookup: {
                from: "products",
                localField: "items.pid",
                foreignField: "_id",
                as: "product"
            }
        },
        {
            $project: {
                'product.product_title': 1,
                'product.product_image': 1,
                'product.product_discount': 1,
                'userDetails.username': 1,
                shippingAddress: 1,
                contact: 1,
                items: 1,
                quantity: 1,
                order_note: 1,
                status: 1,
                totalAmount: 1,
                razorpay_payment_id: 1,
                razorpay_order_id: 1,
                formattedDate: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                }
            }
        }
    ],
    getCategorizeProduct: [
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'product_parent_category_id',
                as: 'categorizeProduct'
            }
        },
        { $unwind: '$categorizeProduct' },
        {
            $group: {
                _id: '_id',
                product: { $addToSet: '$categorizeProduct' }
            }
        },
        { $unwind: '$product' },
        {
            $lookup: {
                from: 'productcolors',
                localField: 'availableColor',
                foreignField: '_id',
                as: 'colorDetails',
            }
        },
        {
            $lookup: {
                from: 'productsizes',
                localField: 'availableSize',
                foreignField: '_id',
                as: 'sizeDetails',
            }
        },
        {
            $lookup: {
                from: 'parent_categories',
                localField: 'product_parent_category_id',
                foreignField: '_id',
                as: 'parent_category',
            }
        },
        { $unwind: '$parent_category' },
        {
            $lookup: {
                from: 'sub_categories',
                localField: 'product_sub_category_id',
                foreignField: '_id',
                as: 'sub_category',
            }
        },
        { $unwind: '$sub_category' },
        {
            $lookup: {
                from: 'productbrands',
                localField: 'brand_name',
                foreignField: '_id',
                as: 'brand',
            }
        },
        { $unwind: '$brand' },
        {
            $project: {
                product_title: 1, product_price: 1, product_discount: 1, product_image: 1,
                product_stock: 1, shipping: 1, brand: 1, sub_category: 1, sub_Category: 1,
                colorDetails: 1, sizeDetails: 1, parent_category: 1, product_description: 1,
                formattedDate: {
                    $dateToString: {
                        format: "%Y-%m-%d", date: "$date"
                    }
                }
            }
        }
    ],
    getCategoryPostLength: [
        {
            $lookup: {
                from: 'posts',
                localField: '_id',
                foreignField: 'category_id',
                as: 'posts'
            }
        },
        { $unwind: '$posts' },
        {
            $group: {
                _id: '$posts.category_id',
                category_name: { $first: '$category' },
                postarry: { $push: '$posts' },
            }
        },
        {
            $addFields: {
                length: { $size: '$postarry' }
            }
        }
    ],
    featuredPosts: [
        {
            $project: {
                blog_title: 1, blog_image: 1,
                blog_slug: 1,
                formattedDate: {
                    $dateToString: { format: '%d-%m-%Y', date: '$date' }
                }
            }
        }
    ],
    productQuery: [
        {
            $lookup: {
                from: 'productcolors',
                localField: 'availableColor',
                foreignField: '_id',
                as: 'colorDetails',
            }
        },
        {
            $lookup: {
                from: 'productsizes',
                localField: 'availableSize',
                foreignField: '_id',
                as: 'sizeDetails',
            }
        },
        {
            $lookup: {
                from: 'parent_categories',
                localField: 'product_parent_category_id',
                foreignField: '_id',
                as: 'parent_category',
            }
        },
        { $unwind: '$parent_category' },
        {
            $lookup: {
                from: 'sub_categories',
                localField: 'product_sub_category_id',
                foreignField: '_id',
                as: 'sub_category',
            }
        },
        { $unwind: '$sub_category' },
        {
            $lookup: {
                from: 'productbrands',
                localField: 'brand_name',
                foreignField: '_id',
                as: 'brand',
            }
        },
        { $unwind: '$brand' },
        {
            $project: {
                product_title: 1, product_price: 1, product_discount: 1, product_image: 1,
                product_stock: 1, shipping: 1, brand: 1, sub_category: 1, sub_Category: 1,
                colorDetails: 1, sizeDetails: 1, parent_category: 1, product_description: 1,
                product_new: 1, product_on_sales: 1,
                formattedDate: {
                    $dateToString: {
                        format: "%Y-%m-%d", date: "$date"
                    }
                }
            }
        },
    ]

}

