<template>
  <Page>
    <ActionBar title="Weather" />

    <StackLayout class="p-20">
      <!-- <Label v-if="weather.main" :text="weather.main.temp" class="text-center temperature-view" /> -->
      <Label textWrap="true" class="text-center temperature-view">
        <FormattedString>
          <Span v-if="weather.main" :text="weather.main.temp"/>
          <Span text=" °C"/>
        </FormattedString>
      </Label>
      <Label :text="weather.name" class="h2 text-center" />
      
      <FlexboxLayout alignItems="center" justifyContent="space-around" style="margin-top: 30px; margin-bottom: 30px;">
        <Button width="33%" text="Today" @tap="onButtonTap(1)" />
        <Button width="33%" text="Tomorrow" @tap="onButtonTap(2)" />
        <Button width="33%" text="Other" @tap="onButtonTap(3)" />
      </FlexboxLayout>

      <FlexboxLayout v-if="currentViewIndex==1" alignItems="center" justifyContent="space-around">
        <Label text="val1" width="33%" height="200" backgroundColor="#488c53" class="text-center hourly-view" />
        <Label text="val2" width="33%" height="200" backgroundColor="#488c53" class="text-center hourly-view" />
        <Label text="val3" width="33%" height="200" backgroundColor="#488c53" class="text-center hourly-view" />
      </FlexboxLayout>      
      <FlexboxLayout v-if="currentViewIndex==2" alignItems="center" justifyContent="space-around">
        <Label text="val4" width="33%" height="200" backgroundColor="#488c53" class="text-center hourly-view" />
        <Label text="val5" width="33%" height="200" backgroundColor="#488c53" class="text-center hourly-view" />
        <Label text="val6" width="33%" height="200" backgroundColor="#488c53" class="text-center hourly-view" />
      </FlexboxLayout>      
      <FlexboxLayout v-if="currentViewIndex==3" alignItems="center" justifyContent="space-around">
        <Label text="val7" width="33%" height="200" backgroundColor="#488c53" class="text-center hourly-view" />
        <Label text="val8" width="33%" height="200" backgroundColor="#488c53" class="text-center hourly-view" />
        <Label text="val9" width="33%" height="200" backgroundColor="#488c53" class="text-center hourly-view" />
      </FlexboxLayout>      

    </StackLayout>
  </Page>
</template>

<script >
import * as axios from "axios";
export default {
  data() {
    return {
      temperature: "x °C",
      area: "Foo, Bar",
      currentViewIndex: 1,
      weather: {}
    };
  },
  methods: {
    onButtonTap(args) {
      this.currentViewIndex = args;
      // action(`${this.weather.main.temp}`, "OK")
      //   .then(result => {
      //     console.log(result);
      //   });
      this.area = this.weather.main.temp;
      console.log(this.weather.main.temp);
      console.log("view index changed to: " + args);
    }
  },
  mounted() {
    axios
      .get('https://api.openweathermap.org/data/2.5/weather?lat=46.36174779999999&lon=15.113785&units=metric&appid=1025f8b1bb1e5b77c94a6f233ed1849f')
      .then(res => {console.log("success"); this.weather = res.data});
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
