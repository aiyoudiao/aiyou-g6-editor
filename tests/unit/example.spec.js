import { shallowMount } from "@vue/test-utils";
import Topology from "@/components/Topology/index.vue";

describe("Topology.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(Topology, {
      propsData: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
