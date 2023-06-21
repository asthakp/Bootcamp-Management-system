export const filteredResults = (Model) => async (req, res, next) => {
  try {
    const query = { ...req.query }; //copy all the items in query
    const removeQuery = ["select", "sort", "page", "limit"];
    removeQuery.forEach((params) => delete query[params]);
    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|eq|ne|in)\b/,
      (match) => `$$(match)`
    ); //replace gt=>$gt
    queryStr = JSON.parse(queryStr);
    let filteredQuery = Model.find(queryStr);

    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      filteredQuery = filteredQuery.select(fields);
    }

    if (req.query.sort) {
      const fields = req.query.sort.split(",").join(" ");
      filteredQuery = filteredQuery.sort(fields);
    }

    //pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skipData = (page - 1) * limit;
    const endIndex = page * limit; //total no of data at any specific page
    const total = await Model.countDocuments();

    filteredQuery = filteredQuery.skip(skipData).limit(limit);

    const Models = await filteredQuery;

    const pagination = {};
    if (endIndex < total) {
      // = only in last page
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (skipData > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    if (Models.length > 0) {
      res.filteredResult = {
        status: true,
        data: Models,
        pagination,
        total,
      };
      next();
    } else {
      return res.status(400).json({
        status: false,
        message: `no data found`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
