import { CategoryListing } from '../../../components/property/CategoryListing';

export default function ForRent() { return <CategoryListing title="Properties for Rent" query={{ transactionType: 'RENT' }} />; }
