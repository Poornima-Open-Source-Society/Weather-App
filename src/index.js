var axios =require('axios');
import ids from './ids';
var dayval=1;
const showLoader = ()=>{
  ids.loader.style.display = "inline-block";
}
const clearLoader = ()=>{
  ids.loader.style.display = "none";
}
class Search {
    constructor(query) {
        this.query = query;
    }
    async getAdvanceResults (){
        var key = 'xInxGKNLoFjaVAGiZvh17aZZLwIfb0n7';
         var test=`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=%09${key}&q=${this.query}`;
        try {
            const response = await axios(test);
            this.citykey = response.data[0].Key;
            var res2 =`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${this.citykey}?apikey=${key}&details=true`; 
           // axios.defaults.baseURL = 'http://localhost:8080/' ||;
            axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
            axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';     
            const response2 = await axios(res2);
            this.result = response2.data;
            return this.result;
        } catch (error) {
            console.log(error);
        }     

    }
}
const clearBack=(s)=>{
  if(s)ids.prev.style.display = "none";
  else ids.prev.style.display = "";
};
const viewAdvance=(res,daynum,bigRes)=>{
  ids.datacard.style.display = "";
  if(daynum ===1 || daynum<1)clearBack(true);
  else clearBack(false);
  ids.title.textContent = res[daynum].Day.ShortPhrase;
  ids.date.textContent = res[daynum].Date.split("T")[0];
  if(daynum===1){
    ids.day.textContent = "";
    ids.night.textContent = "";
    ids.day.insertAdjacentHTML('beforeend',JSON.stringify(res[daynum-1].Day)); 
    ids.night.insertAdjacentHTML('beforeend',JSON.stringify(res[daynum-1].Night));}
    else if(daynum > 1) {
      ids.day.textContent = JSON.stringify(res[daynum-1].Day);
      ids.night.textContent = JSON.stringify(res[daynum-1].Night);
    }
    var icono;
    if(res[daynum-1].Day.Icon <=9)icono = '0'+res[daynum-1].Day.Icon;
    else icono = res[daynum-1].Day.Icon;
    ids.dicon.setAttribute("src",`https://developer.accuweather.com/sites/default/files/${icono}-s.png`);
    ids.nicon.setAttribute("src",`https://developer.accuweather.com/sites/default/files/${res[daynum-1].Night.Icon}-s.png`);
    $( document ).ready(function() {
      $("#title-day").text(`${res[daynum-1].Day.IconPhrase}`);
      $("#title-night").text(`${res[daynum-1].Night.IconPhrase}`);
      $(".headline").text(bigRes.Headline.Text);

      console.log( "ready!" );
     });
     
   


    clearLoader();  

};

async function newResult(e) {
    e.preventDefault();
    showLoader();
    var city = ids.city.value;
    console.log(city);
    if(city==='' || city===null)alert('please enter city name');
    doFurther(city);
}

const doFurther = async (city)=>{
  var s = new Search(city);
    var AdvancedResult = await s.getAdvanceResults();
    viewAdvance(AdvancedResult.DailyForecasts,1,AdvancedResult);
    console.log(AdvancedResult);
    ids.next.addEventListener('click',()=>{
      dayval=(dayval+1)%5;
      if(dayval===0) dayval++;
      console.log(dayval);
      return viewAdvance(AdvancedResult.DailyForecasts,dayval,AdvancedResult);
    });
    ids.prev.addEventListener('click',()=>{
      dayval=(dayval-1)%5;
      if(dayval===0) dayval++;
      console.log(dayval);
       return viewAdvance(AdvancedResult.DailyForecasts,dayval,AdvancedResult);
    });
}
window.onload = ()=>{
  showLoader();
$.ajax({
  url: "https://geolocation-db.com/jsonp",
  jsonpCallback: "callback",
  dataType: "jsonp",
  success: function(location) {
    doFurther(location.city);
  }
});
}

ids.search.addEventListener('click',newResult);





