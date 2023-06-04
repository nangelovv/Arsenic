import React from 'react'


export default function StartButtons() {

    function show_stack_card(card1, card2) {
        const element1 = document.getElementById(card1)
        const element2 = document.getElementById(card2)
        if (element1.classList.contains("d-none")) {
            element1.classList.remove("d-none");
            element2.classList.add("d-none");
            element1.scrollIntoView()
        }
        else {
            element1.classList.add("d-none");
            element2.classList.add("d-none");
        }
      }

  return (
    <div className="container-fluid">
        <div className="row justify-content-between">
            <div className="col-3">
                <button className="m-4 p-3 h4 rounded-4 tertiary-color borders-color overButton" onClick={() => show_stack_card('RegisterForm', 'LoginForm')}>Register</button>
            </div>
            <div className="col-6" id="SignContainer"> </div>
            <div className="col-3 text-end">
                <button className="m-4 p-3 h4 rounded-4 tertiary-color borders-color overButton" onClick={() => show_stack_card('LoginForm', 'RegisterForm')}>Login</button>
            </div>
        </div>
    </div>
  )
}
