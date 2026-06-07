import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPrevious, onNext }) {
  return (
    <div className="pagination">
      <button type="button" onClick={onPrevious} disabled={currentPage === 1}>
        Anterior
      </button>

      <span>
        Página {currentPage} de {totalPages}
      </span>

      <button type="button" onClick={onNext} disabled={currentPage === totalPages}>
        Próxima
      </button>
    </div>
  );
}

export default Pagination;
