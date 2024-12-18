const handleAggregatePagination = async (collectionName, aggregation, query) => {
    try {

        const { page = 1, limit = 2 } = query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        }
        const data = await collectionName.aggregatePaginate(aggregation, options)
        
        return {
            totalDocs: data.totalDocs,
            totalPages: data.totalPages,
            page: data.page,
            limit: data.limit,
            pageCounter: data.pagingCounter,
            collectionData: data.docs,
        }
    } catch (error) {
        console.log('handelAggregatePagination :' + error.message)
    }
}

module.exports = handleAggregatePagination;