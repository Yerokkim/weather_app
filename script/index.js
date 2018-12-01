//*****************UI MODULE*****************//

const UI = (function(){

    let menu =document.querySelector("#menu-container");
    const showApp =()=> {
        document.querySelector("#app-loader").classList.
        add('display-none');
        document.querySelector("main").removeAttribute('hidden');
    };

      const loadApp = () => {
          document.querySelector("#app-loader").classList.remove('display-none');
          document.querySelector("main").setAttribute('hidden', 'true');
      };

    const _showMenu=()=> menu.style.right =0;


    const _hideMenu =()=> menu.style.right='-65%';

    const _toggleHourlyWeather=()=>{
        let houlryWeather =document.querySelector("#hourly-weather-wrapper"),
        arrow=document.querySelector('#toggle-hourly-weather').children[0],
        visible= houlryWeather.getAttribute('visible'),
        dailyWeather=document.querySelector("#daily-weather-wrapper");

            if(visible =='false'){
                houlryWeather.setAttribute('visible','true');
                houlryWeather.style.bottom=0;
                arrow.style.transform="rotate(180deg)";
                dailyWeather.style.opacity=0;
            } else if (visible == 'true'){
                houlryWeather.setAttribute('visible', 'false');
                houlryWeather.style.bottom = '-100%';
                arrow.style.transform = "rotate(0deg)";
                dailyWeather.style.opacity = 1;
            } else console.log("error");
    };


    const drawWeatherData = (data,location)=> {
        console.log(data)
        console.log(location)

        let currentlyData =data.currently,
            dailyData= data.daily.data,
            hourlyData= data.hourly.data,
            weekDays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            dailyWeatherWrapper=document.querySelector('#daily-weather-wrapper'),
            dailyWeatherModel,
            day,
            maxMinTemp,
            dailyIcon,
            houlryWeatherWrapper =document.querySelector('#hourly-weather-wrapper'),
            houlryWeatherModel,
            hourlyIcon;
            

        //====set current location=======//
        
        document.querySelectorAll(".location-label").forEach ((e)=>{
            e.innerHTML=location;
        });

        //===set the background=========//
        document.querySelector('main').style.backgroundImage=`url("./assets/images/bg-images/${currentlyData.icon}.jpg")`;

        //===set the icon======================//

         document.querySelector('#currentlyIcon').setAttribute('src',`./assets/images/summary-icons/${currentlyData.icon}-white.png`);


        //=====set summary========================//

        document.querySelector("#summary-label").innerHTML=currentlyData.summary;

        //=========set temperature======//

        document.querySelector('#degrees-label').innerHTML= Math.round((
            currentlyData.temperature -32)*5/9)+ '&#176;'
    
        //=========set humidty============================//
        document.querySelector("#humidity-label").innerHTML=Math.round(
            currentlyData.humidity *100)+'%';

        //========set wind=======================================//
        document.querySelector("#wind-speed-label").innerHTML=
        (currentlyData.windSpeed * 1.6093).toFixed(1)+'kph'

        //==============set daily weather=======================/

        while (dailyWeatherWrapper.children[1]) {
            dailyWeatherWrapper.removeChild(dailyWeatherWrapper.children[1])
        }

        for (let i = 0; i <= 6; i++) {
            // clone the node and remove display none close
            dailyWeatherModel = dailyWeatherWrapper.children[0].cloneNode(true);
            dailyWeatherModel.classList.remove('display-none');
            // set the day
            day = weekDays[new Date(dailyData[i].time * 1000).getDay()]
            dailyWeatherModel.children[0].children[0].innerHTML = day;
            // set min/max temperature for the next days in Celcius
            maxMinTemp = Math.round((dailyData[i].temperatureMax - 32) * 5 / 9) + '&#176;' + '/' + Math.round((dailyData[i].temperatureMin - 32) * 5 / 9) + '&#176;';
            dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;
            // set daily icon
            dailyIcon = dailyData[i].icon;
            dailyWeatherModel.children[1].children[1].children[0].setAttribute('src', `./assets/images/summary-icons/${dailyIcon}-white.png`);
            // append the model
            dailyWeatherWrapper.appendChild(dailyWeatherModel);

        }
        dailyWeatherWrapper.children[1].classList.add('current-day-of-the-week');

        //set hourly weather
        //=====

        while (houlryWeatherWrapper.children[1]){
            houlryWeatherWrapper.removeChild(houlryWeatherWrapper.children[1])
        }
        
        for(let i=0; i<=24; i++){
            houlryWeatherModel=houlryWeatherWrapper.children[0].cloneNode(true);
            houlryWeatherModel.classList.remove('display-none');

            //set hours(getHours function)

            new Date(hourlyData[i].time *1000).getHours()+ ":00";
        }

        UI.showApp();



    };

//menu
    document.querySelector('#open-menu-btn').
    addEventListener('click',_showMenu);

    document.querySelector('#close-menu-btn').
        addEventListener('click', _hideMenu);

        //houly-weather wrapper event
    document.querySelector('#toggle-hourly-weather').addEventListener('click',_toggleHourlyWeather);
//export
    return {
        showApp,
        loadApp,
        drawWeatherData
    }
})();

//*********************GET LOCATION********************** */

const GETLOCATION=(function (){

    let location;
    const locationInput = document.querySelector("#location-input"),
    addCityBtn =document.querySelector("#add-city-btn");

    const _addCity=()=>{
        location =locationInput.value;
        locationInput.value="";
        addCityBtn.removeAttribute('disabled', true);
        addCityBtn.classList.add('disabled');

        
        WEATHER.getWeather(location);
        

    }

    locationInput.addEventListener('input',function(){
        let inputText= this.value.trim();
        
        if(inputText !=''){
            addCityBtn.removeAttribute('disabled');
            addCityBtn.classList.remove('disabled');
        }else{
            addCityBtn.removeAttribute('disabled',true);
            addCityBtn.classList.add('disabled');
        }
    })

    addCityBtn.addEventListener('click',_addCity);

})();

/************GET WEATHER DATA***************/

const WEATHER= (function(){
    const darkSkyKey = "2016f8076927ed5e38c4f915c10f4968",
        geocoderKey ="0109c7f2c595406296b4050d2d23599d";

    const _getGeocodeURL = (location) => `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${geocoderKey}`;

    const _getDarkSkyURL = (lat, lng) => `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${lat},${lng}`;
    

   const _getDarkSkyData = (url,location) => {
       axios.get(url)
           .then((res) => {
               console.log(res);
               UI.drawWeatherData(res.data,location)
           })
           .catch((err) => {
               console.error(err);
           })
   };

        const getWeather = (location) => {
            UI.loadApp();

            let geocodeURL = _getGeocodeURL(location);

            axios.get(geocodeURL)
                .then((res) => {
                    console.log()
                    let lat = res.data.results[0].geometry.lat,
                        lng = res.data.results[0].geometry.lng;

                    let darkskyURL= _getDarkSkyURL(lat,lng);
                      _getDarkSkyData(darkskyURL,location);

                })
                .catch((err) => {
                    console.err(err)
                })
        };

        return {
            getWeather
        }
        })();
        



//*****************Init********************//

window.onload =function (){
    UI.showApp();
}


