'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import { Editor } from '@/components/editor/Editor';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';

import { SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs';
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense';

import ActiveCollaborators from './ActiveCollaborators';
import { currentUser } from '@clerk/nextjs/server';
import { updateDocument } from '@/lib/actions/room.actions';
import Loader from './Loader';
import ShareModal from './ShareModal';


const CollaborativeRoom = ({ roomId, roomMetadata, users, currentUserType } : CollaborativeRoomProps) => {

  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);


  const updateTitleHandler = async (e : React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setLoading(true);

      try {
        if(documentTitle !== roomMetadata.title) {
          const updatedDocument = await updateDocument(roomId, documentTitle);


          if(!updatedDocument) {
            setEditing(false);
          }
        }

      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }
  };


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditing(false);
        updateDocument(roomId, documentTitle);
      }

    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [roomId, documentTitle]);


  useEffect(() => {
    if(editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);
  






  return (
    <RoomProvider id={roomId}>
     <ClientSideSuspense fallback={<Loader />}>
      <div className='collaborative-room'>

      <Header>
        <div className='flex w-fit items-center justify-center gap-2' ref={containerRef}>
         { editing && !loading ? (
          <Input 
            type='text'
            value={documentTitle}
            ref={inputRef}
            placeholder='Enter title'
            onChange={(e : any) => setDocumentTitle(e.target.value)}
            onKeyDown={updateTitleHandler}
            disabled={!editing}
            className='document-title-input'
          />
         ) : (
          <>
           <p className='document-title'> {documentTitle} </p>
          </>
         )}

         {currentUserType === 'editor' && !editing && (
          <Image 
           src='/assets/icons/edit.svg'
           alt='edit'
           width={24}
           height={24}
           onClick={() => setEditing(true)}
           className='pointer'
          />
         )}

         {currentUserType !== 'editor' && !editing && (
          <p className='view-only-tag'> View only</p>
         )}

         {loading && (
          <p className='text-sm text-gray-400'>
            saving...
          </p>
         )}
         

        </div>

        <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
          <ActiveCollaborators />

          <ShareModal 
            roomId={roomId}
            collaborators={users}
            creatorId={roomMetadata.creatorId}
            currentUserType={currentUserType}
          />

          <SignedOut>
          <SignInButton />
          </SignedOut>

          <SignedIn>
          <UserButton />
          </SignedIn>
        </div>   
       </Header>

        <Editor roomId={roomId} currentUserType={currentUserType} />

      </div>
     </ClientSideSuspense>
    </RoomProvider>
  )
}

export default CollaborativeRoom;