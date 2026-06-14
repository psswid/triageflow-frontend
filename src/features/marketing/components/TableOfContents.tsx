import { useState, useEffect } from 'react'

interface TocItem {
  id: string
  title: string
}

interface TableOfContentsProps {
  items: TocItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [items])

  return (
    <nav className="hidden lg:block w-56 shrink-0" aria-label="Table of contents">
      <div className="sticky top-24 space-y-1">
        <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-3 tracking-wider">
          On this page
        </p>
        {items.map(({ id, title }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`block text-sm py-1 pl-3 border-l-2 transition-colors ${
              activeId === id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-medium'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {title}
          </a>
        ))}
      </div>
    </nav>
  )
}
