import { Toaster } from 'react-hot-toast';
import FlashToast from './FlashToast';

export default function ToastContainer() {
 return (
 <>
 <Toaster
 position="top-right"
 toastOptions={{
 duration: 5000,
 style: {
 background: '#ffffff',
 color: '#1e293b',
 borderRadius: '12px',
 border: '1px solid #e2e8f0',
 },
 success: {
 iconTheme: {
 primary: '#10b981',
 secondary: '#ffffff',
 },
 },
 error: {
 iconTheme: {
 primary: '#ef4444',
 secondary: '#ffffff',
 },
 },
 }}
 />
 <FlashToast />
 </>
 );
}
