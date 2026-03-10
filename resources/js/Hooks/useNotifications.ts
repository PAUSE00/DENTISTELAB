
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';



export function useNotifications() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    useEffect(() => {
        if (!user) return;
        if (!window.Echo) return; // Echo not initialized (Pusher not configured)

        if ((user.role === 'lab_owner' || user.role === 'lab_tech') && user.lab_id) {
            window.Echo.private(`lab.${user.lab_id}`)
                .listen('.order.submitted', (e: any) => {
                    // Show validation/success toast
                    // You might want to use a toast library here, relying on the one in your Layout
                    // Dispatch a custom event that Layout listens to, or use a context
                    const event = new CustomEvent('notification', {
                        detail: {
                            type: 'info',
                            message: `New Order #${e.id} from ${e.clinic_name}`,
                            duration: 5000
                        }
                    });
                    window.dispatchEvent(event);
                    window.dispatchEvent(new CustomEvent('notification-sound'));
                });
        }

        if ((user.role === 'dentist' || user.role === 'clinic_staff') && user.clinic_id) {
            window.Echo.private(`clinic.${user.clinic_id}`)
                .listen('.order.updated', (e: any) => {
                    const event = new CustomEvent('notification', {
                        detail: {
                            type: 'info',
                            message: `Order #${e.id} Updated: ${e.status_label}`,
                            duration: 5000
                        }
                    });
                    window.dispatchEvent(event);
                    window.dispatchEvent(new CustomEvent('notification-sound'));
                });
        }

        // Listen for new messages globally? 
        // We'll skip global chat notifications unless requested to keep it simple and focused on order status.

        return () => {
            if ((user.role === 'lab_owner' || user.role === 'lab_tech') && user.lab_id) {
                window.Echo.leave(`lab.${user.lab_id}`);
            }
            if ((user.role === 'dentist' || user.role === 'clinic_staff') && user.clinic_id) {
                window.Echo.leave(`clinic.${user.clinic_id}`);
            }
        };
    }, [user]);
}
