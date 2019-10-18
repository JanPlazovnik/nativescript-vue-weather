<template>
  <Page @loaded="pageLoaded">

    <ActionBar>
      <StackLayout orientation="horizontal">
        <Label text="Weather" fontSize="20" verticalAlignment="center" color="#ffffff"/>
      </StackLayout>
    </ActionBar>

    <PullToRefresh @refresh="refreshList" class="refresh">
      <ScrollView orientation="vertical">
        <StackLayout class="p-20">

          <SearchBar hint="Search for a city" v-model="cityQuery" @submit="submitCity" @loaded="onSearchBarLoaded($event)"/>

          <Label textWrap="true" class="text-center temperature-view temperatureCityColor">
            <FormattedString v-if="weather.main">
              <Span :text="(weather.main.temp % 1 < 0.5) ? Math.floor(weather.main.temp) : Math.ceil(weather.main.temp)" />
              <Span text=" °C" />
            </FormattedString>
          </Label>

          <Label :text="weather.name" class="h3 text-center temperatureCityColor" />
          <Label :text="lastUpdated" class="h4 text-center lastUpdatedColor" />

          <FlexboxLayout alignItems="flex-start" justifyContent="center" class="mt-50">
            <StackLayout :key="key" v-for="(item, key) in forecast.slice(1,4)" orientation="vertical" width="33%" class="hourlyView">
              <Label :text="item.dt_txt | getHour" class="text-center p-20"
                  @loaded="onLabelLoaded" />
              <Label textWrap="true" class="temperatureCityColor hourly-temperature p-10" height="75" @loaded="onLabelLoaded">
                <FormattedString>
                  <Span :text="(item.main.temp % 1 < 0.5) ? Math.floor(item.main.temp) : Math.ceil(item.main.temp)" />
                  <Span text=" °C" />
                </FormattedString>
              </Label>
              <Label :text="item.weather[0].main" class="text-center p-20"
                  @loaded="onLabelLoaded" />
            </StackLayout>
          </FlexboxLayout>

          <Label text="Extra information" class="h2 temperatureCityColor mt-50" />

          <GridLayout columns="2*, 2*" rows="2*, 2*" height="200px">
            <Label textWrap="true" row="0" col="0" horizontalAlignment="center" verticalAlignment="center" class="temperatureCityColor" v-show="weather.wind">
              <FormattedString>
                <Span text="Wind speed: " fontWeight="bold"/>
                <Span :text="weather.wind.speed" />
                <Span text=" m/s" />
              </FormattedString>
            </Label>          
            <Label textWrap="true" row="0" col="1" horizontalAlignment="center" verticalAlignment="center" class="temperatureCityColor" v-show="weather.main">
              <FormattedString>
                <Span text="Humidity: " fontWeight="bold"/>
                <Span :text="weather.main.humidity" />
                <Span text="%" />
              </FormattedString>
            </Label>          
            <Label textWrap="true" row="1" col="0" horizontalAlignment="center" verticalAlignment="center" class="temperatureCityColor" v-show="weather.main">
              <FormattedString >
                <Span text="Air pressure: " fontWeight="bold"/>
                <Span :text="weather.main.pressure" />
                <Span text=" mb" />
              </FormattedString>
            </Label>          
            <Label textWrap="true" row="1" col="1" horizontalAlignment="center" verticalAlignment="center" class="temperatureCityColor" v-show="weather.visibility">
              <FormattedString>
                <Span text="Visibility: " fontWeight="bold"/>
                <Span :text="weather.visibility / 1000" />
                <Span text=" km" />
              </FormattedString>
            </Label>              
          </GridLayout>

          <DockLayout stretchLastChild="false" height="100%" v-show="!locationSearch">
            <FAB @tap="fabTap()" icon="~/assets/images/geo.png" dock="bottom" rippleColor="#8499f9" class="fab-button"></FAB>
          </DockLayout>        
        </StackLayout>
      </ScrollView>
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
      cityQuery: null,
      locationSearch: true,
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
      },
      forecast: [],
    };
  },
  methods: {
    onLabelLoaded(args) {
      if(args.object.android) {
        args.object.android.setGravity(17);
      }
    },
    onSearchBarLoaded(event) {
      if (event.object.android) {
        setTimeout(() => {
          event.object.dismissSoftInput();
          event.object.android.clearFocus();
        }, 0);
      }
    },
    fabTap() {
      this.getLocation();
      this.cityQuery = "";
    },
    submitCity(args) {
      console.log(this.cityQuery);
      this.locationSearch = false;
      this.fetchWeather(null, this.cityQuery);
      this.fetchForecast(null, this.cityQuery);
    },
    refreshList(args) {
      var pullRefresh = args.object;
      pullRefresh.refreshing = false;
      if(this.locationSearch) 
        this.getLocation();
      else {
        this.fetchWeather(null, this.cityQuery);
        this.fetchForecast(null, this.cityQuery);
      }
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
              this.locationSearch = true;
              this.fetchWeather(loc, null);
              this.fetchForecast(loc, null);
            }
          },
          e => {
            console.log("Error: " + (e.message || e));
            this.getLocation();
          }
        );
    },
    fetchWeather(loc, query) {
      axios
        .get(
          (loc == null) ?
            `https://api.openweathermap.org/data/2.5/weather?q=${query.replace(/\s/g, "+")}&units=metric&appid=806b02f9dab6137941fb03eab18d9984` :
            `https://api.openweathermap.org/data/2.5/weather?lat=${loc.latitude}&lon=${loc.longitude}&units=metric&appid=806b02f9dab6137941fb03eab18d9984`
        )
        .then(res => {
          console.log("success");
          this.weather = res.data;
          this.lastUpdated = `Last updated at ${moment().format('HH:mm:ss')}`;
        })
        .catch(res => {
            console.log(res)
          }
        );    
    },
    fetchForecast(loc, query) { // 3h
      axios
        .get(
          (loc == null) ?
            `https://api.openweathermap.org/data/2.5/forecast?q=${query.replace(/\s/g, "+")}&units=metric&appid=806b02f9dab6137941fb03eab18d9984` :
            `https://api.openweathermap.org/data/2.5/forecast?lat=${loc.latitude}&lon=${loc.longitude}&units=metric&appid=806b02f9dab6137941fb03eab18d9984`
        )
        .then(res => {
          console.log("Forecast fetched");
          this.forecast = res.data.list;
        })
        .catch(res => {
            console.log(res)
          }
        );
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
  },
  filters: {
    getHour(value) {
      return moment(value).format('HH:mm');
    }
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

.hourly-temperature {
  font-size: 30px;
}

.hourlyView {
  margin: 10px;
  background-color: #8499f9;
  border-radius: 20px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.mt-10 {
  margin-top: 10px;
}

.mt-25 {
  margin-top: 25px;
}

.mt-50 {
  margin-top: 50px;
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

.fab-button {
  height: 55;
  width: 55;
  background-color: #5876fc;
  horizontal-align: right;
  vertical-align: bottom;
  box-shadow: none;
  margin: 30px 20px;
}
</style>
