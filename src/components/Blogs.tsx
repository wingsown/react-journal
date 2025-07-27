import React from "react"
import { Link, useLocation } from "react-router-dom"
import { BlogPost } from "../types/blogData"
import { useSwipeable } from "react-swipeable"

interface BlogsProps {
  blogPosts: BlogPost[]
  currentPage: number
  totalPages: number
  handlePageChange: (page: number) => void
  fadeClass: string
  showPagination?: boolean
}

const Blogs: React.FC<BlogsProps> = ({
  blogPosts,
  currentPage,
  totalPages,
  handlePageChange,
  fadeClass,
  showPagination = true,
}) => {
  const location = useLocation()

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentPage < totalPages) handlePageChange(currentPage + 1)
    },
    onSwipedRight: () => {
      if (currentPage > 1) handlePageChange(currentPage - 1)
    },
    trackMouse: true,
  })

  return (
    <div className="blog-list" {...swipeHandlers}>
      <div className={`blog-entries ${fadeClass}`} key={currentPage}>
        {blogPosts.map((blog) => (
          <div className="blog-preview" key={blog.id}>
            <Link
              to={`/archives/${blog.year}/blogs/${blog.id}`}
              state={{
                from: location.pathname + location.search,
                view: "list",
              }}
            >
              <h2>{blog.title}</h2>
              <p>{blog.summary}</p>
              <div className="blog-meta">
                <p>{blog.countryEmoji}</p>
                <p>{blog.year}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="pagination-wrapper">
          <button
            className="arrow"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ‹
          </button>

          <span className="page-indicator">
            {currentPage} / {totalPages}
          </span>

          <button
            className="arrow"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}

export default Blogs
