import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import UpcomingTrip from './components/UpcomingTrips.jsx';


class App extends Component {
    constructor() {
        super();
        this.state = {
            trips: [],
            days: []
        }
        this.addEvent = this.addEvent.bind(this)
        this.openForm = this.openForm.bind(this)
        this.closeForm = this.closeForm.bind(this)
        this.addItinerary = this.addItinerary.bind(this);
        this.deleteTrip = this.deleteTrip.bind(this);
        this.expandTrip = this.expandTrip.bind(this)
        this.addDays = this.addDays.bind(this)
    }

    addEvent(day, timeInput, typeInput, placeInput){
        let time = document.getElementById(timeInput).value;
        const type = document.getElementById(typeInput).value;
        const place = document.getElementById(placeInput).value;
        time = time.split(':')
        let hours = Number(time[0]);
        let minutes = Number(time[1]);
        let timeValue
        if (hours > 0 && hours <= 12) {
            timeValue= "" + hours;
          } else if (hours > 12) {
            timeValue= "" + (hours - 12);
          } else if (hours == 0) {
            timeValue= "12";
          }
        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;
        timeValue += (hours >= 12) ? " pm" : " am";
          console.log(day)
          fetch(`/days/${day}`, {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({time: timeValue, type: type, place: place})
            })
            .then((response) => {
        })
            .then(window.location.reload())


    }

    deleteEvent(day, timeInput, typeInput, placeInput){
        fetch(`/days/deleteFrom/${day}`, {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({time: timeInput, type: typeInput, place: placeInput})
            })
            .then((response) => {
                console.log(response)
            })
            .then(window.location.reload())
    }
    

    openForm(id) {
        document.getElementById(id).style.display = "flex"; 
        document.getElementById(id).style.justifyContent= "space-between";
    }
      
    closeForm(e, id) {
        e.preventDefault()
        document.getElementById(id).style.display = "none";
    }

    addItinerary(){
        const destination = document.getElementById('addDestination').value;
        const startDate = document.getElementById('addStartDate').value
        const endDate = document.getElementById('addEndDate').value
        fetch('/trips', {
            method: 'POST', 
            headers: {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({location: destination, startDate: startDate, endDate: endDate})
            })
            .then((response) => {
        })
            .then(window.location.reload())

    }   

    addDays(){
        const destination = document.getElementById('addDestination').value;
        const startDate = document.getElementById('addStartDate').value
        const endDate = document.getElementById('addEndDate').value
        const dateRange = []
        for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
            dateRange.push(new Date(d).toDateString());
        }
        dateRange.forEach(date => {
            fetch('/days', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({location: destination, date: date})
            })
            .then((response) => {
                console.log(response)
            })
        })
           
       
    }

     async deleteTrip(objectId, location, startDate, endDate){
        const dateRange = []
        for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
            dateRange.push(d.toDateString());
        }
        console.log(dateRange)
       
            for (const date of dateRange) {
                   await fetch('/days', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify({location: location, date: date})
                })
                .then((response) => {
                    console.log(response)
                })
                
            }

        
           
            await fetch(`/trips/${objectId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({objectId: objectId})
            })
            .then((response) => {
                console.log('delete fetch successful')
            })
            
        
        .then(window.location.reload())
    }

    expandTrip(id){
        let x = document.getElementById(id);
        if (x.style.display === 'block'){
            x.style.display = 'none'
        } else {
            x.style.display = 'block'
        }
    }
    addAccommodations(id){
        const accommodations = document.getElementById(`accommodationsTrip${id}`);
        if (accommodations.isContentEditable === false) {
            console.log('should be able to edit now')
            accommodations.contentEditable = true
            accommodations.style.border = "solid 1px black"
        } else {
            const update = accommodations.innerHTML;
            fetch(`/trips/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({update: update})
            })
            .then((response) => console.log(response))
            .then(accommodations.contentEditable = false)
            .then(accommodations.style.border = 'none')
        }
    }

    componentDidMount(){
            fetch('/trips')
            .then(res => res.json())
            .then((trips) => {
                if (!Array.isArray(trips)) trips = [];
                trips.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
                this.setState({trips})
            })

            .catch(err => console.log('Fetch request in App.jsx api fetch: ', err));
            fetch('/days')
            .then(res => res.json())
            .then((days) => {
                if (!Array.isArray(days)) days = [];
                return this.setState({days})
            })
    }

    render () {
        const trips = [];
        for (let i = 0; i < this.state.trips.length; i++){
            trips.push(
                <UpcomingTrip 
                key={`key${i}`}
                id={i} 
                objectId={this.state.trips[i]._id}
                location={this.state.trips[i].location} 
                startDate={ new Date(this.state.trips[i].startDate).toDateString()} 
                endDate={new Date(this.state.trips[i].endDate).toDateString()} 
                accommodations={this.state.trips[i].accommodations}
                days={this.state.days}
                addAccommodations={this.addAccommodations}
                expandTrip={this.expandTrip} 
                deleteTrip={this.deleteTrip}
                openForm={this.openForm}
                closeForm={this.closeForm}
                addEvent={this.addEvent}
                deleteEvent={this.deleteEvent}
                />)

        }
        
        return (
            <div className='router'>
                <h1>Traverse</h1>
                <h2>Your upcoming trips:</h2>
                <div className='tripDashboard'>{trips}</div>
                <h2>Add Itinerary:</h2>
                <form id='itineraryForm' >
                    <div>
                        <label htmlFor="location">Destination: </label>
                        <input className='form' type="text" name="location" id="addDestination"/>
                    </div>
                    <div>
                        <label htmlFor="startDate">Start date: </label>
                        <input className='form' type="datetime-local" name="startDate"  id="addStartDate"/>
                    </div>
                    <div>
                        <label htmlFor="endDate">End date: </label>
                        <input className='form' type="datetime-local" name="endDate"  id="addEndDate"/>
                    </div>
                    <div>
                        <input type="button" className='buttons' value="Submit" onClick={() => {this.addDays(); this.addItinerary();}}/>
                    </div>
                </form>

            
            
            </div>
            


        )
    }

}

export default App;