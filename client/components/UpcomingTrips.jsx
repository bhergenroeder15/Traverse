import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import TripDetails from './TripDetails.jsx';

class UpcomingTrip extends Component {
    render(){
        return (
            <div className='upcomingTrip'>
                <div className='tripThumbnail'>
                    <h3>{this.props.location}: {this.props.startDate} - {this.props.endDate}</h3>
                    <input className='buttons' type="button" value="Delete trip" onClick={() => {this.props.deleteTrip(this.props.objectId, this.props.location, this.props.startDate, this.props.endDate)}}/>
                </div>
                
                <div id={`trip${this.props.id}`} 
                style={{display:"none"}}
                ><TripDetails 
                    location={this.props.location}
                    objectId={this.props.objectId} 
                    startDate={this.props.startDate} 
                    endDate={this.props.endDate} 
                    days={this.props.days}
                    accommodations={this.props.accommodations}
                    addAccommodations={this.props.addAccommodations}
                    openForm={this.props.openForm}
                    closeForm={this.props.closeForm}
                    addEvent={this.props.addEvent}
                    deleteEvent={this.props.deleteEvent}


    
                /></div>
                <button className='expandButton' onClick={() => {this.props.expandTrip(`trip${this.props.id}`)}}>Expand/Collapse details</button>
            </div>
        )
    }
}

export default UpcomingTrip