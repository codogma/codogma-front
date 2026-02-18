import { dehydrate } from '@tanstack/react-query';

import { MainPage } from '@/components/MainPage';
import {
  MAIN_PAGE_BOOKMARKS,
  MAIN_PAGE_MY_COMPILATIONS,
} from '@/constants/limits';
import { getArticles, GetArticlesDTO, getViewed } from '@/helpers/articleApi';
import { getCompilations } from '@/helpers/compilationApi';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { auth } from '@/lib/auth';
import { getQueryClient } from '@/lib/react-query';
import { Language } from '@/types';

type PageProps = {
  readonly params: Promise<{ lng: string }>;
};

export default async function Page({ params }: PageProps) {
  const { lng } = await params;
  const lang = lng as Language;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['recentlyArticles'],
    queryFn: () => getArticles(undefined, undefined, 0, 10),
  });

  const recentlyData = queryClient.getQueryData<GetArticlesDTO>([
    'recentlyArticles',
  ]);

  devConsoleInfo('recently articles data: ', recentlyData);

  const session = await auth();
  if (session?.user) {
    await queryClient.prefetchQuery({
      queryKey: ['history'],
      queryFn: () => {
        return getViewed();
      },
    });

    await queryClient.prefetchQuery({
      queryKey: ['bookmarks'],
      queryFn: () =>
        getCompilations(
          undefined,
          undefined,
          undefined,
          true,
          0,
          MAIN_PAGE_BOOKMARKS,
        ),
    });

    const username = session.user.name;
    if (username) {
      await queryClient.prefetchQuery({
        queryKey: ['compilations', username],
        queryFn: () =>
          getCompilations(
            undefined,
            undefined,
            username,
            false,
            0,
            MAIN_PAGE_MY_COMPILATIONS,
          ),
      });
    }
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <MainPage
      dehydratedState={dehydratedState}
      lng={lang}
      initialRecentlyAdded={recentlyData}
    />
  );
}
