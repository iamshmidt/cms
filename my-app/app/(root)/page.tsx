"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { UserButton } from "@clerk/nextjs";
import { Modal } from '@/components/ui/modal'
const SetupPage = () => {
    return (
        <div className='p-4'>
            this is a protected route
            <Modal title="Modal title" description="Modal description" isOpen={true} onClose={() => { }}>
                Children
            </Modal>
            <UserButton afterSignOutUrl="/" />
        </div>
    )
}
export default SetupPage;