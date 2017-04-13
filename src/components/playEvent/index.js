import React from 'react';
import PlayEvent from './playEvent';
import requireAuthentication from '../Authentication/requireAuthentication';

function PlayEventPage(props, context) {
    console.log('props!!!', props);
  return (
    <PlayEvent eventName={props.params.name} />
  );
}

PlayEventPage.propTypes = {};
export default requireAuthentication(PlayEventPage);
