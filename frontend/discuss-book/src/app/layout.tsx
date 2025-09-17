import '@/src/styles/index.css';
import StateProvider from '../components/StateProvider';
import DecoratorsMain from '../components/decoratorsMain';
import Header from '../components/header';
import LoadingOverlay from '../components/LoadingOverlay';
import Footer from '../components/footer';
import { Toaster } from 'sonner';
import { CustomSidebarProvider } from '../components/customSidebarProvider';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="overflow-hidden">
				<StateProvider>
					<CustomSidebarProvider>
						<div className="w-full flex flex-col justify-between" style={{ height: '100vh' }}>
							<DecoratorsMain />
							<Header />
							<LoadingOverlay />
							{children}
							<Footer />
						</div>
						<Toaster />
					</CustomSidebarProvider>
				</StateProvider>
			</body>
		</html>
	);
}
