"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { UserButton } from "@clerk/nextjs";
import { Modal } from '@/components/ui/modal'
import { useStoreModal } from '@/hooks/use-store-modal';
import { useEffect } from 'react';
const SetupPage = () => {
    const onOpen = useStoreModal((state) => state.onOpen);
    const isOpen = useStoreModal((state) => state.isOpen);

    useEffect(() => {
        if(!isOpen){
            onOpen();
        }
    }, [isOpen,onOpen]);
    return (
        <div className='p-4'>
            Root Page 
            {/* <Modal title="Modal title" description="Modal description" isOpen={true} onClose={() => { }}>
                Children
            </Modal>
            <UserButton afterSignOutUrl="/" /> */}
        </div>
    )
}
export default SetupPage;