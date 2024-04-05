import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { nextAuthOptions } from "@/providers/nextAuthOptionsRenomear";

interface PrivateLayoutProps {
	children: ReactNode
}

export default async function PrivateLayout({ children }: PrivateLayoutProps){
	const session = await getServerSession(nextAuthOptions)
	
	if (session?.checkOnBoarding === false) {
		redirect('/onboarding/page1')
	}
	
	return <>{children}</>
}