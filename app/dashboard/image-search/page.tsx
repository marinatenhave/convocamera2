import { getAuthToken } from '@/app/auth';
import { api } from '@/convex/_generated/api';
import { preloadQuery } from 'convex/nextjs';
import ImageSearchPage from './ais';

const Page = async () => {
  const token = await getAuthToken();
  const preloadedItems = await preloadQuery(
    api.notes.getActionItems,
    {},
    { token },
  );

  return <ImageSearchPage />;
};

export default Page;
