import React from 'react';
import RenderGlimpse from '../../renderComponentParts/RenderGlimpse';

export default function ProfileFollows({ id, header, profiles, noFollows, alternativeNoFollows, myProfile }) {
  return (
    <md-dialog id={id} style={{ height: '100%', width: '100%' }}>
      <span className='d-flex justify-content-center' slot='headline'>{header}</span>
      <form slot='content' method='dialog'>
        {profiles.length !== 0 ? 
          <RenderGlimpse profiles={profiles} />
         : 
          <span className='d-flex justify-content-center'>
            {myProfile ? noFollows : alternativeNoFollows}
          </span>
        }
      </form>
    </md-dialog>
  );
}
