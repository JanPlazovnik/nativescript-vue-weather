<template>
  <Page>
    <ActionBar title="Weather" />

    <StackLayout class="p-20">
      <Label :text="temperature" class="text-center temperature-view" />
      <Label :text="area" class="h2 text-center" />
      
      <FlexboxLayout alignItems="center" justifyContent="space-around" style="margin-top: 30px; margin-bottom: 30px;">
        <Button width="33%" text="Today" @tap="onButtonTap(1)" />
        <Button width="33%" text="Tomorrow" @tap="onButtonTap(2)" />
        <Button width="33%" text="Other" @tap="onButtonTap(3)" />
      </FlexboxLayout>

      <FlexboxLayout v-if="currentViewIndex==1" alignItems="center" justifyContent="space-around">
        <Label text="abtfxjfsadsa" width="33%" height="200" backgroundColor="#ff0000" class="text-center hourly-view" />
        <Label text="atdsjfzjfbc" width="33%" height="200" backgroundColor="#ff0000" class="text-center hourly-view" />
        <Label text="jrzt" width="33%" height="200" backgroundColor="#ff0000" class="text-center hourly-view" />
      </FlexboxLayout>      
      <FlexboxLayout v-if="currentViewIndex==2" alignItems="center" justifyContent="space-around">
        <Label text="jhgg" width="33%" height="200" backgroundColor="#ff0000" class="text-center hourly-view" />
        <Label text="sdhgf" width="33%" height="200" backgroundColor="#ff0000" class="text-center hourly-view" />
        <Label text="dgfdgdf" width="33%" height="200" backgroundColor="#ff0000" class="text-center hourly-view" />
      </FlexboxLayout>      
      <FlexboxLayout v-if="currentViewIndex==3" alignItems="center" justifyContent="space-around">
        <Label text="absadsa" width="33%" height="200" backgroundColor="#ff0000" class="text-center hourly-view" />
        <Label text="asdas" width="33%" height="200" backgroundColor="#ff0000" class="text-center hourly-view" />
        <Label text="asdas" width="33%" height="200" backgroundColor="#ff0000" class="text-center hourly-view" />
      </FlexboxLayout>      

    </StackLayout>
  </Page>
</template>

<script >
export default {
  data() {
    return {
      temperature: "- °C",
      area: "Foo, Bar",
      currentViewIndex: 1,
    };
  },
  methods: {
    onButtonTap(args) {
      this.currentViewIndex = args;
      console.log("view index changed to: " + args);
    }
  }
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

label {
  color: #000;
}

.temperature-view {
  font-size: 55px;
}

.hourly-view {
  border-radius: 30px;
  margin: 10px;
}
</style>
