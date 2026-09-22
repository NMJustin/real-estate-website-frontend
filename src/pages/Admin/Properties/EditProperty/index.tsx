import { Navigate, useParams } from 'react-router-dom';
import PropertyForm from '../PropertyForm';

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  return id ? <PropertyForm propertyId={id} /> : <Navigate to="/admin/properties" replace />;
}
