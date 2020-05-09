var axios =require('axios');
import ids from './ids';
var dayval=1;

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
            const response2 = await axios(res2);
            this.result = response2.data.DailyForecasts;
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
const viewAdvance=(res,daynum)=>{
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
    if(res[daynum-1].Day.Icon <=9)var icono = '0'+res[daynum-1].Day.Icon.toString();
    ids.dicon.setAttribute("src",`https://developer.accuweather.com/sites/default/files/${icono}-s.png`);
    ids.nicon.setAttribute("src",`https://developer.accuweather.com/sites/default/files/${res[daynum-1].Night.Icon}-s.png`);  

};

async function newResult(e) {
    e.preventDefault();
    var city = ids.city.value;
    console.log(city);
    if(city==='' || city===null)alert('please enter city name');
    var s = new Search(city);
    var AdvancedResult = await s.getAdvanceResults();
    viewAdvance(AdvancedResult,1);
    console.log(AdvancedResult);
    ids.next.addEventListener('click',()=>{
      dayval=(dayval+1)%5;
      if(dayval===0) dayval++;
      console.log(dayval);
      return viewAdvance(AdvancedResult,dayval);
    });
    ids.prev.addEventListener('click',()=>{
      dayval=(dayval-1)%5;
      if(dayval===0) dayval++;
      console.log(dayval);
       return viewAdvance(AdvancedResult,dayval);
    });
}


ids.search.addEventListener('click',newResult);





