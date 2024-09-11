module.exports ={
     productQuery : [
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
        },
    ]
    
}

