const PaginationComponent = ({
  pagination,
  handlePageChange
}) => {

  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

    const {
    currentPage,
    totalPages,
  } = pagination;

    return (
    <div className="flex w-full bg-primary-hover justify-center items-center gap-2 mt-8">

      {/* Previous */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          px-3 py-2
          border border-gray-300
          rounded-md
          text-sm
          bg-primary
          hover:bg-yellow-300
          disabled:opacity-40
          disabled:cursor-not-allowed
        "
      >
        Previous
      </button>

      {/* Page numbers */}
      {Array.from(
        { length: totalPages },
        (_, index) => index + 1
      ).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`
            w-9 h-9
            border border-gray-300
            rounded-md
            text-sm
            ${
              currentPage === page
                ? "bg-gray-800 text-white"
                : "bg-primary hover:bg-yellow-300"
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          
          px-3 py-2
          border border-gray-300
          rounded-md
          text-sm
          bg-primary
          hover:bg-yellow-300
          disabled:opacity-40
          disabled:cursor-not-allowed
        "
      >
        Next
      </button>

    </div>
  );
};

export default PaginationComponent;