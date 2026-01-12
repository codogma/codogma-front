import type {
  CreateResult,
  DataProvider,
  DeleteManyResult,
  DeleteResult,
  GetListParams,
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
import { UserRole } from '@/types';

type UsersListFilter = {
  categoryId?: number;
  targetUsername?: string;
  role?: UserRole;
  tag?: string;
  info?: string;
  isSubscriptions?: boolean;
  isSubscribers?: boolean;
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const isUserRole = (v: unknown): v is UserRole => {
  if (typeof v !== 'string') return false;
  return (Object.values(UserRole) as string[]).includes(v);
};

const normalizeUsersFilter = (input: unknown): UsersListFilter => {
  if (!isRecord(input)) return {};

  return {
    categoryId:
      typeof input.categoryId === 'number' ? input.categoryId : undefined,
    targetUsername:
      typeof input.targetUsername === 'string'
        ? input.targetUsername
        : undefined,
    role: isUserRole(input.role) ? input.role : undefined,
    tag: typeof input.tag === 'string' ? input.tag : undefined,
    info: typeof input.info === 'string' ? input.info : undefined,
    isSubscriptions:
      typeof input.isSubscriptions === 'boolean'
        ? input.isSubscriptions
        : undefined,
    isSubscribers:
      typeof input.isSubscribers === 'boolean'
        ? input.isSubscribers
        : undefined,
  };
};

const transformSort = (sort: SortPayload | undefined) => ({
  sort: sort?.field,
  order: sort?.order ? sort.order.toLowerCase() : undefined,
});

const transformPagination = (pagination: PaginationPayload | undefined) => ({
  // API 0-based, react-admin 1-based
  page: Math.max(0, (pagination?.page ?? 1) - 1),
  size: pagination?.perPage,
});

export const dataProvider: DataProvider = {
  getList: async (
    resource: string,
    params: GetListParams,
  ): Promise<GetListResult> => {
    if (resource !== 'users') {
      throw new Error(`Unsupported resource: ${resource}`);
    }

    // react-admin типизирует filter как any, поэтому делаем безопасную нормализацию
    const filters = normalizeUsersFilter(params.filter as unknown);

    const { page, size } = transformPagination(params.pagination);
    const { sort, order } = transformSort(params.sort);

    const response = await getUsers(
      filters.categoryId,
      filters.targetUsername,
      filters.role,
      filters.tag,
      filters.info,
      filters.isSubscriptions,
      filters.isSubscribers,
      page,
      size,
      sort,
      order,
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
