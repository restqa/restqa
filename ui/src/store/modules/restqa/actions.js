const actions = {
  history(context, id) {
    context.commit("history", id);
  },
};

export default actions;
