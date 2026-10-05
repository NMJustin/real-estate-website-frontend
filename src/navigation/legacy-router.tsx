'use client'

import NextLink from 'next/link'
import { usePathname, useRouter, useSearchParams as useNextSearchParams, useParams as useNextParams } from 'next/navigation'
import { createContext, useContext, useEffect, type AnchorHTMLAttributes, type ReactNode } from 'react'

type RouteParams = Record<string, string | string[]>

const RouteParamsContext = createContext<RouteParams>({})

export function RouteParamsProvider({
  params,
  children,
}: {
  params: RouteParams
  children: ReactNode
}) {
  return <RouteParamsContext.Provider value={params}>{children}</RouteParamsContext.Provider>
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string
  replace?: boolean
}

export function Link({ to, replace, ...props }: LinkProps) {
  return <NextLink href={to} replace={replace} {...props} />
}

type NavLinkProps = Omit<LinkProps, 'className' | 'children'> & {
  className?: string | ((state: { isActive: boolean }) => string)
  children: ReactNode | ((state: { isActive: boolean }) => ReactNode)
  end?: boolean
}

export function NavLink({ to, className, children, end, ...props }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = end
    ? pathname === to
    : pathname === to || pathname.startsWith(`${to.replace(/\/$/, '')}/`)

  return (
    <NextLink
      href={to}
      className={typeof className === 'function' ? className({ isActive }) : className}
      {...props}
    >
      {typeof children === 'function' ? children({ isActive }) : children}
    </NextLink>
  )
}

export function useNavigate() {
  const router = useRouter()
  return (to: string, options?: { replace?: boolean }) => {
    if (options?.replace) router.replace(to)
    else router.push(to)
  }
}

export function useParams<T extends RouteParams = RouteParams>() {
  const routeParams = useContext(RouteParamsContext)
  const nextParams = useNextParams<RouteParams>()
  return { ...nextParams, ...routeParams } as T
}

export function useLocation() {
  const pathname = usePathname()
  const [searchParams] = useSearchParams()

  return {
    pathname,
    search: searchParams.size ? `?${searchParams.toString()}` : '',
    hash: '',
    state: null,
    key: pathname,
  }
}

export function useSearchParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useNextSearchParams()

  const setSearchParams = (
    next: URLSearchParams | ((current: URLSearchParams) => URLSearchParams),
    options?: { replace?: boolean },
  ) => {
    const updated = typeof next === 'function'
      ? next(new URLSearchParams(searchParams.toString()))
      : next
    const query = updated.toString()
    const href = query ? `${pathname}?${query}` : pathname

    if (options?.replace) router.replace(href)
    else router.push(href)
  }

  return [searchParams, setSearchParams] as const
}

export function Navigate({ to, replace = false }: { to: string; replace?: boolean }) {
  const router = useRouter()

  useEffect(() => {
    if (replace) router.replace(to)
    else router.push(to)
  }, [replace, router, to])

  return null
}
