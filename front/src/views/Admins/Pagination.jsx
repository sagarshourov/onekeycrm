import { Lucide } from "@/base-components";

const Pagination = (props) => {
  const { total, numRows } = props;

  let numpage = Math.ceil(total / numRows);



  return (
    <nav className="w-full sm:w-auto sm:mr-auto">
      <ul className="pagination">
        <li className="page-item">
          <a className="page-link" href="#">
            <Lucide icon="ChevronsLeft" className="w-4 h-4" />
          </a>
        </li>
        <li className="page-item">
          <a className="page-link" href="#">
            <Lucide icon="ChevronLeft" className="w-4 h-4" />
          </a>
        </li>
        <li className="page-item">
          <a className="page-link" href="#">
            1
          </a>
        </li>

        <li className="page-item">
          <a className="page-link" href="#">
            <Lucide icon="ChevronRight" className="w-4 h-4" />
          </a>
        </li>
        <li className="page-item">
          <a className="page-link" href="#">
            <Lucide icon="ChevronsRight" className="w-4 h-4" />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
