'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


// let map, mapEvent;

class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords, distance, duration) {

        this.coords = coords; // [lat, lng]
        this.distance = distance; // in km
        this.duration = duration; // in min
    }
}

class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
    }

    calcPace() {
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace
    }
}

class Cycling extends Workout {
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }

    calcSpeed() {
        // km/h
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycling1);

// ////////////////////////////////////////////
// Application Architecture
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
    #map;
    #mapEvent;

    constructor() {
        this._getPosition();

        form.addEventListener('submit', this._newWorkout.bind(this))
    
    
    inputType.addEventListener('change', this._toggleElevationField)
    }

    _getPosition() {
        if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
             function() {
            alert('Could not get your Position')
        })
    }

    _loadMap(position) {
            const { latitude } = position.coords;
            const { longitude } = position.coords;
            console.log(`https://www.google.com/maps/@${latitude},${longitude}`)
        
            const coords = [latitude, longitude]

            console.log(this);
            this.#map = L.map('map').setView(coords, 13);
        
            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);


            // Handling clicks on map
            this.#map.on('click', this._showForm.bind(this) 
            //{
                
                // console.log(mapEvent)
                // const { lat, lng } = mapEvent.latlng
        
        
                // L.marker([lat, lng]).addTo(map)
                // .bindPopup(L.popup({
                //     maxWidth: 250,
                //     minWidth: 100,
                //     autoClose: false,
                //     closeOnClick: false,
                // }))
                // .setPopupContent('Workout')
                // .openPopup();
            //}
            )
        
        }

    _showForm(mapE) {
        this.#mapEvent = mapE;
                form.classList.remove('hidden');
                inputDistance.focus();
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }

    _newWorkout(e) {
        const validInputs = (...inputs) => 
            inputs.every(inp => Number.isFinite(inp))
        e.preventDefault();

            // Get Data from form
            const type = inputType.value;
            const distance = +inputDistance.value;
            const duration = +inputDuration.value;


            // If workout running, create running object
            if(type === 'running') {
                const cadence = +inputCadence.value;
                // Check if Data is valid
                if(
                    // !Number.isFinite(distance) ||
                    // !Number.isFinite(duration) ||
                    // !Number.isFinite(cadence)
                    !validInputs(distance, duration, cadence)
                ) return alert("Inputs have to be positive numbers!")
            }

            // If workout cycling, create cycling object
            if(type === 'cycling') {
                const elevation = +inputElevation.value;
                // Check if dat is Valid
                if(!validInputs(distance, duration, cadence)
                ) 
                    return alert("Inputs have to be positive numbers!");
            }

            // Add new object to workout array

            // Render Workout on map as marker
            console.log(this.#mapEvent)
            const { lat, lng } = this.#mapEvent.latlng
    
    
            L.marker([lat, lng]).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
            }))
            .setPopupContent('Workout')
            .openPopup();

            // Render Workout on List

            // Hide form + clear input fields
            inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
                
    }

}

const app = new App();
app._getPosition();



