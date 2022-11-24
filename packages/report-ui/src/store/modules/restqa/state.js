import Result from "@/services/result";
import History from "@/services/history";

History.add(window.OUTPUT);

const state = {
  result: new Result(),
};
export default state;
