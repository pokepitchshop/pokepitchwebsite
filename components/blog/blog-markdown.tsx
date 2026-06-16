import Link from "next/link"
import ReactMarkdown from "react-markdown"

type BlogMarkdownProps = {
  content: string
}

export function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="mb-4 mt-10 text-2xl font-bold text-white">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-3 mt-8 text-xl font-semibold text-white">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mb-4 leading-relaxed text-slate-300">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-4 list-disc space-y-2 pl-6 text-slate-300">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 list-decimal space-y-2 pl-6 text-slate-300">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        a: ({ href, children }) => {
          const isExternal = href?.startsWith("http")
          if (isExternal) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 underline-offset-4 hover:underline"
              >
                {children}
              </a>
            )
          }
          return (
            <Link
              href={href ?? "#"}
              className="text-yellow-400 underline-offset-4 hover:underline"
            >
              {children}
            </Link>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
