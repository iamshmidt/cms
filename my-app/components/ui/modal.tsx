"use client";

import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogDescription } from "./dialog";

interface ModalProps {
    title:string;
    description:string;
    isOpen:boolean;
    onClose:()=>void;
    children:React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({title, description, isOpen, onClose, children}) => {
    const onChange =(open:boolean) => {
        if(!open){
            onClose();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogDescription>{description}</DialogDescription>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div>
                    {children}
                </div>

            </DialogContent>
        </Dialog>
    )
}