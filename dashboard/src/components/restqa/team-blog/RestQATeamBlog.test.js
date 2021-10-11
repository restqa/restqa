import {mount} from "@vue/test-utils";
import {createStore} from "vuex";
import RestQATeamBlog from "./RestQATeamBlog.vue";
import ElementPlus from "element-plus";

describe("RestQATeamBlog", () => {
  let store;
  let mockTeam;
  let actions = {};

  beforeEach(() => {
    store = createStore({
      modules: {
        restqa: {
          state: {},
          actions,
          getters: {
            info: () => {
              return {
                team: mockTeam
              };
            }
          }
        }
      }
    });
  });

  afterEach(() => {
    mockTeam = null;
  });

  test("renders a team blog article", async () => {
    mockTeam = {
      blog: {
        url: "https://medium.com/restqa-super",
        last: {
          title: "We are doing TDD!",
          date: "2012-12-12 00:00:00",
          image: "https://example.com/img.png",
          author: {
            username: "@Olivierodo",
            avatar: "https://exampple.com/avatar.png"
          },
          url: "https://medium.com/my-article"
        }
      }
    };

    const options = {
      global: {
        plugins: [store, ElementPlus]
      }
    };

    const component = mount(RestQATeamBlog, options);

    expect(component.exists()).toBeTruthy();

    expect(component.find(".team-blog").isVisible()).toBeTruthy();
    expect(component.find(".article .title").text()).toEqual(
      "We are doing TDD!"
    );
    expect(component.find(".article .date").text()).toEqual("December 12, 2012");
    expect(component.find(".article img").attributes("src")).toEqual(
      "https://example.com/img.png"
    );
    expect(component.find(".article a").attributes("href")).toEqual(
      "https://medium.com/my-article"
    );
    expect(component.find(".article a").attributes("target")).toEqual("_blank");
    expect(component.find(".author img").attributes("src")).toEqual(
      "https://exampple.com/avatar.png"
    );
    expect(component.find(".blog a").attributes("href")).toEqual(
      "https://medium.com/restqa-super"
    );
    expect(component.find(".blog a").attributes("target")).toEqual("_blank");
  });
});
