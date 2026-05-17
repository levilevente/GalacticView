import Pagination from 'react-bootstrap/Pagination';

import style from './PaginationEpic.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
}

function PaginationEpic(props: PaginationProps) {
    const { currentPage, goToPage, totalPages } = props;
    const { start, end } = getRangeArray(currentPage, totalPages);

    return (
        <Pagination className={`pagination-black ${style.paginationContainer}`}>
            {}
            <Pagination.First
                onClick={() => {
                    goToPage(1);
                }}
            />
            <Pagination.Prev
                onClick={() => {
                    goToPage(currentPage - 1);
                }}
            />
            {Array.from({ length: end - start + 1 }, (_, index) => {
                const pageNumber = start + index;
                return (
                    <Pagination.Item
                        key={pageNumber}
                        active={pageNumber === currentPage}
                        onClick={() => {
                            goToPage(pageNumber);
                        }}
                        disabled={pageNumber === currentPage}
                    >
                        {pageNumber}
                    </Pagination.Item>
                );
            })}
            <Pagination.Next
                onClick={() => {
                    goToPage(currentPage + 1);
                }}
            />
            <Pagination.Last
                onClick={() => {
                    goToPage(totalPages);
                }}
            />
        </Pagination>
    );
}

interface RangeType {
    start: number;
    end: number;
}

function getRangeArray(currentPage: number, totalPages: number): RangeType {
    let start = currentPage - 2;
    let end = currentPage + 2;

    if (start < 1) {
        start = 1;
        end = Math.min(5, totalPages);
    }

    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, totalPages - 4);
    }

    return { start, end };
}

export default PaginationEpic;
