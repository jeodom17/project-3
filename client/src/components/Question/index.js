import React from "react";
import { Link } from "react-router-dom";


export default function Question() {
    return (
      <>
    <div class="container">
      <div class="row">
       <div class="row">
        <div class="col s12 m6">
            <div class="card blue-grey darken-1">
                <div class="card-content white-text">
                    <span class="card-title">Card Title</span>
                    <p>I am a very simple card. I am good at containing small bits of information.
                        I am convenient because I require little markup to use effectively
                    </p>
                </div>
            <div class="card-action">
                <Link href="#">This is a link</Link>
                <Link to="/">Home on card</Link>
            </div>
            </div>
        </div>
       </div>
      </div>
    </div>
      </>
    );
  }