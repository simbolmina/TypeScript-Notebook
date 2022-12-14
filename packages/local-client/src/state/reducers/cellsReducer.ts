import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

interface CellState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SAVE_CELLS_ERROR:
      state.error = action.payload;
      return state;
    case ActionType.FETCH_CELLS:
      state.loading = true;
      state.error = null;
      return state;
    case ActionType.FETCH_CELLS_COMPLETE:
      //get cells in correct order
      state.order = action.payload.map((cell) => cell.id);
      //
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellState["data"]);
      return state;
    case ActionType.FETCH_CELLS_ERROR:
      state.loading = false;
      state.error = action.payload;
      return state;
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      //without immer(produce) we have to return following object as state for redux but immer updates our state auto without breaking the code.

      // return {
      //   ...state,
      //   data: {
      //     ...state.data,
      //     [id]: {
      //       ...state.data[id],
      //       content,
      //     },
      //   },
      // };

      state.data[id].content = content;
      return state;
    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);
      return state;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      // check if targetIndex is out of boundry
      if (targetIndex < 0 || targetIndex >= state.order.length - 1) {
        return state;
      }

      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;

      return state;
    case ActionType.INSERT_CELL_AFTER:
      //define cell
      const cell: Cell = {
        id: Math.random().toString(36).substring(2, 5),
        content: "",
        type: action.payload.type,
      };
      //create a new cell in state.data
      state.data[cell.id] = cell;
      //
      const foundIndex = state.order.findIndex(
        (id) => id === action.payload.id
      );
      if (foundIndex < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id);
      }
      return state;
    default:
      return state;
  }
}, initialState);

export default reducer;
