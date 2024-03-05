import React from 'react'
import noUserImage from '../../../common/noUser.jpg';
import { transformTime } from '../../../common/commonFuncs';


export default function ChatsGlimpse({ profiles = [], onClickFunc, defaultSecondLine = true }) {

  return (
    profiles?.map((chat, index) => (
      <React.Fragment key={index}>
        <section
          className='position-relative rounded-4 py-2' 
          role='button'
          onClick={() => {onClickFunc(chat)}}
        >
          <md-ripple></md-ripple>
          <div className='row'>
            <div className='col'>
              <div className='row'>
                <div className='col-sm-2 col-4 text-center'>
                  <img
                    style={{ width: '60px', height: '60px', borderRadius: '150px'  }}
                    src={chat.profile_picture ? chat.profile_picture : noUserImage}
                    alt='Glimpse profile'
                  />
                </div>

                <span className='col d-flex align-items-center fs-5 text-break' tabIndex={0}>{chat.username}</span>

              </div>

              <span className='offset-2 my-2'>
                {defaultSecondLine
                  ? chat.profile_description
                  : <>{chat.last_message.substring(0, 50)} &#9702; {transformTime(chat.last_updated)}</>
                }
              </span>

            </div>
          </div>
        </section>
        <md-divider inset></md-divider>
        </React.Fragment>
      ))
  )
}
