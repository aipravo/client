"use client";
import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
	role: 'USER' | 'ADMIN';
	children: React.ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ role, children }) => {
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const storedRole = localStorage.getItem("role");

		if (!token || storedRole !== role) {
			router.replace("/"); // Используем `replace`, чтобы не засорять историю навигации
		}
	}, [router, role]);

	return <>{children}</>;
};

export default ProtectedRoute;
