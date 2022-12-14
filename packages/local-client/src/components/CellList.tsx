import "./CellList.css";
import { useTypedSelector } from "../hooks/useTypedSelector";
import CellListItem from "./CellListItem";
import AddCell from "./AddCell";
import { useEffect, Fragment } from "react";
import { useActions } from "../hooks/useActions";

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    //order is in the order array, we check id in the order and return data from data object. so we ensure we are getting data in the right order;
    return order.map((id) => data[id]);
  });

  const { fetchCells } = useActions();

  useEffect(() => {
    fetchCells();
  }, []);

  // useEffect(() => {
  //   saveCells();
  // }, [JSON.stringify(cells)]);

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));
  return (
    <div className="cell-list">
      {/* <div className={cells.length === 0 ? "force-visible" : ""}> */}
      <AddCell previousCellId={null} forceVisible={cells.length === 0} />
      {/* </div> */}
      {renderedCells}
    </div>
  );
};

export default CellList;
