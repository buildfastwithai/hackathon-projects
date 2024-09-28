import React, { useState } from 'react';

const Community = () => {
  const [view, setView] = useState('options'); // State to manage the current view

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className='text-white p-4'>
      {view === 'options' && (
        <div className='options'>
          <h2>Select an Option</h2>
          <button className='bg-blue-500 text-white p-2 m-2' onClick={() => handleViewChange('communityGroup')}>
            View and Message Community Group
          </button>
          <button className='bg-green-500 text-white p-2 m-2' onClick={() => handleViewChange('popularCommunities')}>
            View Popular Communities
          </button>
        </div>
      )}

      {view === 'communityGroup' && (
        <div className='community-group'>
          <h2>Community Group</h2>
          {/* Here you can add the component to view and message in the community group */}
          <p>This is where you can view and message in a community group.</p>
          <button className='bg-gray-500 text-white p-2 m-2' onClick={() => handleViewChange('options')}>
            Back to Options
          </button>
        </div>
      )}

      {view === 'popularCommunities' && (
        <div className='popular-communities'>
          <h2>Popular Communities</h2>
          {/* Sample grid view of popular communities */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='border p-4 bg-gray-800'>Community 1</div>
            <div className='border p-4 bg-gray-800'>Community 2</div>
            <div className='border p-4 bg-gray-800'>Community 3</div>
            <div className='border p-4 bg-gray-800'>Community 4</div>
          </div>
          <button className='bg-gray-500 text-white p-2 m-2' onClick={() => handleViewChange('options')}>
            Back to Options
          </button>
        </div>
      )}
    </div>
  );
};

export default Community;
