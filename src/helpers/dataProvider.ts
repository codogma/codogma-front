import {
  CreateResult,
  DataProvider,
  DeleteManyResult,
  DeleteResult,
  GetListResult,
  GetManyReferenceResult,
  GetManyResult,
  GetOneResult,
  PaginationPayload,
  SortPayload,
  UpdateManyResult,
  UpdateResult,
} from 'react-admin';

import { getUsers } from '@/helpers/userApi';

const transformSort = (sort: SortPayload | undefined) => ({
  sort: sort?.field,
  order: sort?.order.toLowerCase(),
});

const transformPagination = (pagination: PaginationPayload | undefined) => ({
  page: Number(pagination?.page) - 1, // Ваш API использует 0-based индексацию
  size: pagination?.perPage,
});

export const dataProvider: DataProvider = {
  getList: async (resource, params): Promise<GetListResult> => {
    if (resource !== 'users') {
      throw new Error(`Unsupported resource: ${resource}`);
    }

    const filters = params.filter;

    // Вызываем вашу функцию getUsers
    const response = await getUsers(
      // Здесь можно передать конкретные параметры в зависимости от фильтров:
      filters?.categoryId,
      filters?.role,
      filters?.tag,
      filters?.info,
      filters?.isSubscriptions,
      filters?.isSubscribers,
      transformPagination(params.pagination).page,
      transformPagination(params.pagination).size,
      transformSort(params.sort).sort,
      transformSort(params.sort).order,
    );

    return {
      data: response.content,
      total: response.totalElements,
    };
  },
  create: async (): Promise<CreateResult> => {
    throw new Error('Метод create не реализован');
  },
  delete: async (): Promise<DeleteResult> => {
    throw new Error('Метод delete не реализован');
  },
  deleteMany: async (): Promise<DeleteManyResult> => {
    throw new Error('Метод deleteMany не реализован');
  },
  getMany: async (): Promise<GetManyResult> => {
    throw new Error('Метод getMany не реализован');
  },
  getManyReference: async (): Promise<GetManyReferenceResult> => {
    throw new Error('Метод getManyReference не реализован');
  },
  getOne: async (): Promise<GetOneResult> => {
    throw new Error('Метод getOne не реализован');
  },
  update: async (): Promise<UpdateResult> => {
    throw new Error('Метод update не реализован');
  },
  updateMany: async (): Promise<UpdateManyResult> => {
    throw new Error('Метод updateMany не реализован');
  },
};
