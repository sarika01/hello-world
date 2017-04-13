import React from 'react';
import EventDetails from './eventDetails';
import requireAuthentication from '../Authentication/requireAuthentication';

function EventDetailsPage(props, context) {
    console.log('props!!!', props);
  return (
    <EventDetails eventName={props.params.name} />
  );
}

EventDetailsPage.propTypes = {};
export default requireAuthentication(EventDetailsPage);
