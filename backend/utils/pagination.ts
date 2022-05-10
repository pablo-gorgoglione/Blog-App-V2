import mongoose from 'mongoose';
import { Request } from 'express';

interface NextPrevious {
  page: number;
  limit: number;
}

interface PaginationResult<Model> {
  results: Array<Model>;
  next: NextPrevious;
  previous?: NextPrevious;
}

async function paginatePosts<ModelType>(
  model: mongoose.Model<ModelType>,
  req: Request
): Promise<PaginationResult<ModelType>> {
  let paginatedResults: PaginationResult<ModelType> = {
    results: [],
    next: { limit: 5, page: 1 },
    previous: { limit: 5, page: 1 },
  };
  const page = req.query.page ? +req.query.page : 1;
  const limit = req.query.limit ? +req.query.limit : 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  if (endIndex < (await model.countDocuments().exec())) {
    paginatedResults.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    paginatedResults.previous = {
      page: page - 1,
      limit: limit,
    };
  } else {
    delete paginatedResults.previous;
  }
  paginatedResults.results = await model
    .find({ isPublished: true })
    .sort({
      createdAt: 'desc',
    })
    .limit(limit)
    .skip(startIndex)
    .exec();
  return paginatedResults;
}

export { paginatePosts };
