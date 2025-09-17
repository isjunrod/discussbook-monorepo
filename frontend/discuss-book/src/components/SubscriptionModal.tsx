import React, { useContext } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/dialog";
import { Button } from "@/src/components/button";
import { Check } from "lucide-react";
import { ThemeContext } from '../state/context';
import { useRouter } from 'next/navigation';

const SubscriptionModal = ({ open, setsubscriptionModal }: { open: boolean, setsubscriptionModal: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const { state } = useContext(ThemeContext);
    const router = useRouter();

    const handleProcessSubscription = async () => {

        try {
            const response = await fetch('/api/create-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: state.user.id }),
            })
            const data = await response.json();

            if (response.ok) {
                router.push(data?.init_point);
            }
        } catch (error) {
            console.error('Error processing subscription:', error);
            throw new Error('Failed to process subscription');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setsubscriptionModal}>
            <DialogContent className="sm:max-w-md md:max-w-xl lg:max-w-[60rem] bg-black border border-neutral-800 text-white">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-3xl text-center font-semibold">Choose Your Plan</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free Plan */}
                    <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800 flex flex-col relative justify-between">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold mb-1">Free</h3>
                            <p className="text-3xl font-bold">$0 <span className="text-xl font-normal text-neutral-400">/month</span></p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center">
                                <div className="mr-3 bg-indigo-600 p-1 rounded-full flex-shrink-0">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-xl text-neutral-300">Create basic discussion spaces</p>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3 bg-indigo-600 p-1 rounded-full flex-shrink-0">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-xl text-neutral-300">Limited message history</p>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3 bg-indigo-600 p-1 rounded-full flex-shrink-0">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-xl text-neutral-300">Standard support</p>
                            </div>
                        </div>

                        <Button className="cursor-pointer w-full text-xl bg-neutral-700 hover:bg-neutral-600 text-white">
                            Select Free Plan
                        </Button>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-neutral-900 rounded-lg p-6 border border-indigo-600 relative">
                        <div className="absolute -top-3 right-6 bg-indigo-600 text-[10px] py-1 px-3 rounded-full text-white font-medium">
                            Recommended
                        </div>

                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold mb-1">Premium</h3>
                            <p className="text-3xl font-bold">$9.99 <span className="text-xl font-normal text-neutral-400">/month</span></p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center">
                                <div className="mr-3 bg-indigo-600 p-1 rounded-full flex-shrink-0">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-xl text-neutral-300">Unlimited discussion spaces</p>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3 bg-indigo-600 p-1 rounded-full flex-shrink-0">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-xl text-neutral-300">Complete message history</p>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3 bg-indigo-600 p-1 rounded-full flex-shrink-0">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-xl text-neutral-300">Priority support</p>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3 bg-indigo-600 p-1 rounded-full flex-shrink-0">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-xl text-neutral-300">Advanced customization options</p>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3 bg-indigo-600 p-1 rounded-full flex-shrink-0">
                                    <Check size={12} className="text-white" />
                                </div>
                                <p className="text-xl text-neutral-300">Enhanced privacy features</p>
                            </div>
                        </div>

                        <Button onClick={handleProcessSubscription} className="cursor-pointer text-xl w-full bg-indigo-600 hover:bg-indigo-400 text-white">
                            Get Premium
                        </Button>
                    </div>
                </div>

                <p className="text-lg text-center text-neutral-500 mt-4 ">
                    You can cancel your subscription at any time
                </p>
            </DialogContent>
        </Dialog>
    );
};

export default SubscriptionModal;