import config from '../config';

export default {
    data: () => {
        return {
            appConfig: config.app,
        }
    },
  methods: {
    getResult() {
      return window.RESTQA_RESULT
    },
    decodeHtml(html) {
      let txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    }
  }
};
