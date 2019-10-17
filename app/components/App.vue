<template>
  <Page @loaded="pageLoaded">
    <ActionBar>
      <StackLayout orientation="horizontal">
        <Label text="Weather" fontSize="20" verticalAlignment="center" color="#ffffff"/>
      </StackLayout>
    </ActionBar>
    <PullToRefresh @refresh="refreshList" class="refresh">
      <StackLayout class="p-20">
        <Label textWrap="true" class="text-center temperature-view temperatureCityColor">
          <FormattedString v-if="weather.main">
            <Span :text="(weather.main.temp % 1 < 0.5) ? Math.floor(weather.main.temp) : Math.ceil(weather.main.temp)" />
            <Span text=" °C" />
          </FormattedString>
        </Label>
        <Label :text="weather.name" class="h3 text-center temperatureCityColor" />
        <Label :text="lastUpdated" class="h4 text-center lastUpdatedColor" />


        <SegmentedBar>
          <SegmentedBarItem title="Today" />
          <SegmentedBarItem title="Tomorrow" />
          <SegmentedBarItem title="Other" />
        </SegmentedBar>

        <Label text="Extra information" class="h2 temperatureCityColor" />
        <GridLayout columns="2*, 2*" rows="2*, 2*" height="200px">
          <Label textWrap="true" row="0" col="0" horizontalAlignment="center" verticalAlignment="center" class="temperatureCityColor">
            <FormattedString v-if="weather.wind">
              <Span text="Wind speed: " fontWeight="bold"/>
              <Span :text="weather.wind.speed" />
              <Span text=" m/s" />
            </FormattedString>
          </Label>          
          <Label textWrap="true" row="0" col="1" horizontalAlignment="center" verticalAlignment="center" class="temperatureCityColor">
            <FormattedString v-if="weather.main">
              <Span text="Humidity: " fontWeight="bold"/>
              <Span :text="weather.main.humidity" />
              <Span text="%" />
            </FormattedString>
          </Label>          
          <Label textWrap="true" row="1" col="0" horizontalAlignment="center" verticalAlignment="center" class="temperatureCityColor">
            <FormattedString v-if="weather.main">
              <Span text="Air pressure: " fontWeight="bold"/>
              <Span :text="weather.main.pressure" />
              <Span text=" mb" />
            </FormattedString>
          </Label>          
          <Label textWrap="true" row="1" col="1" horizontalAlignment="center" verticalAlignment="center" class="temperatureCityColor">
            <FormattedString v-if="weather.visibility">
              <Span text="Visibility: " fontWeight="bold"/>
              <Span :text="weather.visibility / 1000" />
              <Span text=" km" />
            </FormattedString>
          </Label>              
        </GridLayout>
      </StackLayout>
    </PullToRefresh>
    
  </Page>
</template>

<script >
import * as app from "tns-core-modules/application";
import * as platform from "tns-core-modules/platform";
import * as color from "tns-core-modules/color";
import * as axios from "axios";
import * as moment from "moment";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
export default {
  data() {
    return {
      currentViewIndex: 1,
      lastUpdated: null,
      weather: {
        weather: {
          0: {
            main: "",
            description: ""
          }
        },
        main: {
          temp: 0,
          pressure: 0,
          humidity: 0,
          temp_min: 0,
          temp_max: 0
        },
        visibility: 0,
        wind: {
          speed: 0,
          deg: 0
        },
        name: ""
      }
    };
  },
  methods: {
    refreshList(args) {
      var pullRefresh = args.object;
      pullRefresh.refreshing = false;
      this.getLocation();
    },
    getLocation() {
      geolocation
        .getCurrentLocation({
          desiredAccuracy: Accuracy.high,
          maximumAge: 5000,
          timeout: 10000
        })
        .then(
          loc => {
            if (loc) {
              this.fetchWeather(loc);
            }
          },
          e => {
            console.log("Error: " + (e.message || e));
            this.getLocation();
          }
        );
    },
    fetchWeather(loc) {
      axios
        .get(
          // `https://api.openweathermap.org/data/2.5/forecast?lat=${loc.latitude}&lon=${loc.longitude}&units=metric&appid=806b02f9dab6137941fb03eab18d9984`
          `https://api.openweathermap.org/data/2.5/weather?lat=${loc.latitude}&lon=${loc.longitude}&units=metric&appid=806b02f9dab6137941fb03eab18d9984`
        )
        .then(res => {
          this.weather = res.data;
          this.lastUpdated = `Last updated at ${moment(loc.timestamp).format('h:mm:ss a')}`;
        })
        .catch(res => console.log(res));    
    },
    pageLoaded() {
      if (app.android && platform.device.sdkVersion >= "21") {
        const window = app.android.foregroundActivity.getWindow();
        window.setStatusBarColor(new color.Color("#5876fc").android);
      }
    }
  },
  mounted() {
    this.getLocation();
  }
};
</script>

<style scoped>
ActionBar {
  background-color: #5876fc;
  color: #ffffff;
}
Page {
  background-color: #ffffff;
}

Label {
  color: #000;
}

.temperatureCityColor {
  color: #4e598c;
}

.lastUpdatedColor {
  color: #7783b8;
}

.temperature-view {
  font-size: 75px;
}

.hourlyView {
  margin: 10px;
}

.stackViewFirstChild {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.stackViewLastChild {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.viewSwitchButton {
  background-color: #8499f9;
  /* border-bottom: 1px solid #8499f9; */
  border-radius: 10px;
  margin: 10px;
  outline: none;
}
.refresh {
  color: #4e598c;
}
</style>
