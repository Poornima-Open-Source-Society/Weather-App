var axios =require('axios');
const CancelToken = axios.CancelToken;
var clear = ()=>{
   ids.cityName.value = '';
   document.getElementById("loader").style.display = "none";
};
 class Search {
    constructor(query) {
        this.query = query;
    }
    async getBasicResults() {
       
        var key2 = '3907c6dcd96299a0467c7c3404638c4f';
         var test2=`https://api.openweathermap.org/data/2.5/weather?q=${this.query}&appid=${key2}`;
      // var apiKey = "f810e1f4c0a0b046c1c42fb88130c7c9";
      // var test =`http://api.weatherstack.com/current?access_key=${apiKey}&query=${this.query}`;
        try {
            const response = await axios(test2);
            console.log(response);
            this.result = response;
            return this.result;
            console.log(this.result);
        } catch (error) {
            console.log(error.response);
            if(error.response.data.cod=="404"){
              alert('city not found');
              clear();
            }
        }     
    }
    async getAdvanceResults (){
        //"http://dataservice.accuweather.com/locations/v1/cities/search?apikey=%09xInxGKNLoFjaVAGiZvh17aZZLwIfb0n7&q=jaipur&details=true"
        var key = 'xInxGKNLoFjaVAGiZvh17aZZLwIfb0n7';
         var test=`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=%09${key}&q=${this.query}`;
        try {
            const response = await axios(test);
            this.citykey = response.data[0].Key;
            var res2 =`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${this.citykey}?apikey=${key}&details=true`;      
            const response2 = await axios(res2);
            this.result = response2.data.DailyForecasts;
            return this.result;
        } catch (error) {
            console.log(error);
        }     

    }
}

const ids={
    cityName:document.querySelector("#city-name"),
    city:document.querySelector("#city"),
    myForm:document.querySelector("#myForm"),
    cityLoc:document.querySelector("#city-location"),
    windSpeed:document.querySelector("#wind-speed"),
    windDeg:document.querySelector("#wind-degree"),
    humidity:document.querySelector("#humidity"),
    time:document.querySelector("#time"),
    dayNight:document.querySelector("#day-night"),
    temp:document.querySelector("#temprature"),
    vis:document.querySelector("#visibility"),
    icon:document.querySelector(".icon"),
    desc:document.querySelector("#desc"),
    search:document.querySelector("#search"),
    forecast:document.querySelector("#forecast")
}
const viewResult=(result)=>{
   const main = result.data.main;
   const data = result.data;
   const coords = result.data.coord;
    var t = parseInt(eval(main.temp +'- 273.15'));
   ids.temp.textContent = t.toString()+'°C';
   ids.vis.textContent = 'visibility-'+ data.visibility;
   ids.windSpeed.textContent = 'wind speed-'+ data.wind.speed;
   ids.cityLoc.textContent = 'longitute-'+coords.lon + 'latitude -'+coords.lat;
   ids.humidity.textContent = 'humidity-'+main.humidity;
  ids.icon.setAttribute('src','icons/'+data.weather[0].icon.toString()+'.png');
   ids.desc.textContent =  data.weather[0].description.toUpperCase();
   ids.city.textContent = data.name;
   clear();
}
const viewAdvance=(res)=>{
   ids.forecast.textContent =JSON.stringify(res);
};

async function newResult(e) {
    e.preventDefault();
     document.getElementById("loader").style.display = "block";
    var city = ids.cityName.value;
    if(city==='' || city===null)alert('please enter city name');
    var s = new Search(city);
    var result = await s.getBasicResults();
    viewResult(result);
    var AdvancedResult = await s.getAdvanceResults();
    viewAdvance(AdvancedResult);
    
}
ids.search.addEventListener('click',newResult);
//window.onload = (e)=>{
  // newResult(e);
//}


