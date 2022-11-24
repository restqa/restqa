import Result from "@/services/result";

const mutations = {
  history(state, id) {
    state.result = new Result(id);
  },
};

export default mutations;
