'use client';
import Loader from '@/components/Loader';
import { LiveblocksProvider, ClientSideSuspense } from '@liveblocks/react/suspense';

import { useUser } from '@clerk/nextjs';
import { getClerkUsers, getDocumentUsers } from '../lib/actions/user.actions';

const Provider = ({ children } : { children : React.ReactNode}) => {
  const { user : clerkUser } = useUser();
  return (
    <LiveblocksProvider 
      authEndpoint='/api/liveblocks-auth'
      resolveUsers={async ({ userIds } : any) => {
        const users = await getClerkUsers({ userIds });
        
        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId } : { text : any, roomId : any}) => {
        const roomUsers = await getDocumentUsers({
          roomId,
          currentUser : clerkUser?.emailAddresses[0].emailAddress!,
          text,
        });

        return roomUsers;
      }}
    >
     <ClientSideSuspense fallback={<Loader />}>
        {children}
     </ClientSideSuspense>
    </LiveblocksProvider>
  )
}

export default Provider;


// publicApiKey={"pk_dev_h8jHYpnBYT847K-jMoAaTXIlBCuCUSF78TCr_bvaoIWeSWzv0o2s8rbnSXx0dLNI"}





