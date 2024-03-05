import React, {useEffect} from 'react';
import { useInput } from '../../common/hooks';
import CommentsSection from './commentsSection';


export default function CommentsDialog({ currentPostID, submitComment = () => {} }) {

  const [commentBox, commentBoxInput] = useInput({ type: 'text', label: 'Type new comment', id: 'commentInput', hideIcon: false, activeIcon: 'send', inactiveIcon: 'send', onClickFunc: submitComment});

  useEffect(() => {
    const commentsDialog = document.getElementById('commentsDialog');

    const handleDialogClosed = () => {
      document.getElementById('commentInput').value = '';
    };

    // Add the event listener to the md-dialog element
    commentsDialog.addEventListener('closed', handleDialogClosed);

    // Cleanup the event listener when the component is unmounted
    return () => {
      commentsDialog.removeEventListener('closed', handleDialogClosed);
    };
  }, []); // Empty dependency array ensures the effect runs once on mount

  return (
    <md-dialog id={'commentsDialog'} style={{ height: '100%', width: '100%' }}>
      <span className='d-flex justify-content-center' slot='headline'>
        Comments section
      </span>
      <form method='dialog' slot='content'>
        <CommentsSection currentPostID={currentPostID} />
      </form>
      <div className='d-flex justify-content-center' slot='actions'>
        {commentBoxInput}
      </div>
    </md-dialog>
  );
};
