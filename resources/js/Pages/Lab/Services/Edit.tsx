import { EditService } from './ServiceForm';

interface Service {
    id: number; name: string; description: string | null;
    price: string; production_days: number; is_active: boolean;
    category: string; image_url: string | null;
}

interface Props { service: Service; categories: string[]; }

export default function Edit({ service, categories }: Props) {
    return <EditService service={service} categories={categories} />;
}
