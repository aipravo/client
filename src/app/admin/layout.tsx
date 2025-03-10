
import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../globals.css";
import { ReactNode } from 'react';
import ProtectedRoute from '@/hoc/ProtectedRoute';
import { AdminProvider } from '@/context/AdminContext';
import AsideAdmin from '@/components/AsideAdmin/AsideAdmin';

export const metadata: Metadata = {
	title: "AIПраво",
	description: "ИИ ассистент в юридической сфере",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {

	return (
		<ProtectedRoute role='ADMIN'>
			<AdminProvider>
				<main className='container-fluid h-100 overflow-y-auto'>
					<article className=' row h-100 overflow-y-auto'>
						<aside className=' col-12 col-xl-2 col-md-3 pe-4 pe-md-0 py-3 pb-3 h100vh aside'>
							<AsideAdmin />
						</aside>
						<section className=' col-12 col-xl-10 col-md-9 p-3 h100vh dashboard'>
							{children}
						</section>
					</article>
				</main>
			</AdminProvider>
		</ProtectedRoute>
	);
}
