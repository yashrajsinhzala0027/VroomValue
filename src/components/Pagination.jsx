
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
            <button
                className="btn btn-outline"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                style={{ padding: '8px 16px' }}
            >
                Prev
            </button>

            {pages.map(p => (
                <button
                    key={p}
                    className={`btn ${currentPage === p ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => onPageChange(p)}
                    style={{ width: '40px', padding: '8px' }}
                >
                    {p}
                </button>
            ))}

            <button
                className="btn btn-outline"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                style={{ padding: '8px 16px' }}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
