import Link from 'next/link';

export interface CategoryProps {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string;
  propertyCount?: number;
  propertyType?: string;
  isNewDevelopment?: boolean;
}

export function CategoryCard({ category }: { category: CategoryProps }) {
  const href = category.isNewDevelopment
    ? '/properties?isNewDevelopment=true'
    : category.propertyType
      ? `/properties?propertyType=${encodeURIComponent(category.propertyType)}`
      : `/properties?category=${encodeURIComponent(category.slug)}`;

  return (
    <Link
      href={href}
      aria-label={`Browse ${category.name} properties`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={category.imageUrl || '/images/OIP (1).webp'}
          alt={`${category.name} property`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl font-bold text-white">{category.name}</h3>
          {category.propertyCount !== undefined && (
            <p className="mt-1 text-sm text-white/85">
              {category.propertyCount} {category.propertyCount === 1 ? 'listing' : 'listings'}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-between gap-4 p-5">
        <p className="text-sm leading-6 text-slate-600">
          {category.description || 'Explore properties in this category'}
        </p>
        <span className="shrink-0 text-sm font-semibold text-emerald-700 group-hover:text-emerald-800">
          Explore
        </span>
      </div>
    </Link>
  );
}

export default CategoryCard;