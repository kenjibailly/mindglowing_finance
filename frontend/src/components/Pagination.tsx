import { Link } from "react-router-dom";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  link: string;
  linkOptions: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  link,
  linkOptions,
}: PaginationProps) => {
  return (
    <div className="pagination">
      {currentPage > 1 && totalPages > 1 && (
        <Link
          className="previous"
          to={`${link}?page=${currentPage - 1}${linkOptions}`}
          key={`${link}?page=${currentPage - 1}${linkOptions}`}
        >
          Previous
        </Link>
      )}
      {currentPage < totalPages && (
        <Link
          className="next"
          to={`${link}?page=${currentPage + 1}${linkOptions}`}
          key={`${link}?page=${currentPage + 1}${linkOptions}`}
        >
          Next
        </Link>
      )}
    </div>
  );
};

export default Pagination;
