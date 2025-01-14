import { nextAuthOptions } from '@/providers/nextAuthOptionsRenomear';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface PrivateLayoutProps {
    children: ReactNode;
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
    const session = await getServerSession(nextAuthOptions);

    if (session?.checkOnBoarding === false) {
        redirect('/onboarding/page1');
    }

    return <>{children}</>;
}
