import { CategoryListing } from '../../../components/property/CategoryListing';

export default function ForSale() { return <CategoryListing title="Properties for Sale" query={{ transactionType: 'SALE' }} />; }
