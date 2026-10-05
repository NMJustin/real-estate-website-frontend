'use client'

import { CategoryListing } from '../../../components/property/CategoryListing';

export default function NewDevelopments() { return <CategoryListing title="New Property Developments" query={{ isNewDevelopment: 'true' }} />; }
