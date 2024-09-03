const handelAggregatePagination = async (collectionName, aggregation, query) => {

    const { page = 1, limit = 8 } = query;
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };
    const data = await collectionName.aggregatePaginate(aggregation, options)

    return {
        totalDocs: data.totalDocs,
        totalPages: data.totalPages,
        page: data.page,
        limit: data.limit,
        pageCounter: data.pagingCounter,
        collectionData: data.docs,
    }
}

module.exports = handelAggregatePagination;