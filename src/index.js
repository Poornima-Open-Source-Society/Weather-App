var axios =require('axios');
 class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
      // const link = `api.openweathermap.org/data/2.5/weather?q=${this.query}&appid=`;
       var apiKey = "f810e1f4c0a0b046c1c42fb88130c7c9";
       var test =`http://api.weatherstack.com/current?access_key=${apiKey}&query=${this.query}`;
        try {
            const response = await axios(test);
            this.result = response;
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
    vis:document.querySelector("#visibility")
}
const viewResult=(result)=>{
    var r = result;
    const request =r.data.request;
    const location = r.data.location;
    const current = r.data.current;
    ids.city.textContent =request.query;
    ids.cityLoc.textContent=location.country+' '+location.region+' lat-'+location.lat+' lon-'+location.lon;
    ids.windSpeed.textContent = 'wind speed-'+current.wind_speed; 
    ids.windDeg.textContent = 'wind degree-'+current.wind_degree;
    ids.time.textContent = 'time -'+current.observation_time;
    ids.humidity.textContent ='humidity -'+current.humidity;
    ids.temp.textContent = 'temprature -'+current.temperature+'deg C';
    var day ;
    if(current.is_day==true)day="day";
    else day = "night";
    ids.dayNight.textContent = day;
    ids.vis.textContent = 'visibility-'+current.visibility;
    console.log(r.data.location);
}

async function newResult(e) {
    e.preventDefault();
    var city = ids.cityName.value;
    var s = new Search(city);
    var result = await s.getResults();
    console.log(result);
    viewResult(result);
   
}
ids.myForm.addEventListener('submit',newResult);


