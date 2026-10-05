'use client'

import { CategoryListing } from '../../../components/property/CategoryListing';

export default function Commercial() { return <CategoryListing title="Commercial Properties" query={{ propertyType: 'COMMERCIAL' }} />; }
