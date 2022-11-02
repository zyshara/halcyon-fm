import React, { Component } from 'react';

import "./Contact.css";
import "./Loading.css";

let dootCounter = 0;
setInterval(() => {
  let e = document.getElementsByClassName("splash-loading-box")[0];
  if (e) {
    let eDoot = document.createElement("div");

    if (dootCounter > 14) {
      e.innerHTML = '';
      dootCounter = 0;
    }

    eDoot.classList.add("splash-loading-doot");
    e.appendChild(eDoot);
    dootCounter++;
  }

}, 300);



class BaseFormInput extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }
}

class TextFormInput extends BaseFormInput {
  render() {
    return(
      <label>
        <p>{ this.props.name.charAt(0).toUpperCase() + this.props.name.slice(1) }</p>
        <div className="input-bg">
          <input type="text" name={this.props.name} value={this.state.value} onChange={this.handleChange}/>
        </div>
      </label>
    )
  }
}

class MessageFormInput extends BaseFormInput {
  constructor(props) {
    super(props);
    this.state = {value: ""};
  }

  render() {
    return (
      <label>
        <p>Message</p>
        <div className="input-bg">
          <textarea value={this.state.value} onChange={this.handleChange} placeholder="Type your message here"/>
        </div>
      </label>
    )
  }
}

class SelectFormInput extends BaseFormInput {
  constructor(props) {
    super(props);
    this.state = {value: "general"};
    this.values = ["general", "demos"];
  }
  
  render() {
    return (
      <label>
        <p>Subject</p>
        <div className="input-bg">
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="general">General Inquiries</option>
            <option value="demos">Demos</option>
          </select>
        </div>
      </label>
    )
  }
}

class Contact extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.messageFade = this.messageFade.bind(this);
  }

  componentDidMount() {
    let root = document.getElementById("root");
    root.classList = "ios";

    let content = document.getElementsByClassName("content")[0];
    content.classList = "content contact";

    let footer = document.getElementsByTagName("footer")[0];
    footer.classList = "contact";

    this.fuckTheDOM();
    window.onresize = this.fuckTheDOM;
  }

  fuckTheDOM() {
    let submit = document.getElementById("submit");
    if (!submit) { return; }

    if (window.innerWidth <= 920) {
      let parentSubmit = submit.parentElement;
      let right = document.getElementsByClassName("contact-column-right")[0];
      right.appendChild(parentSubmit);
    }
    else {
      let parentSubmit = submit.parentElement;
      let left = document.getElementsByClassName("contact-column-left")[0];
      left.appendChild(parentSubmit);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const loading = document.getElementsByClassName("loading")[0];
    loading.classList = "loading show";
    this.refs.submit.disabled = true;
    this.refs.submit.value = "Sending...";

    const left = document.getElementsByClassName("contact-column-left")[0];
    const right = document.getElementsByClassName("contact-column-right")[0];
    left.classList = "contact-column-left disable";
    right.classList = "contact-column-right disable";

    const data = {
      subject: this.refs.subject.state.value,
      name: this.refs.name.state.value,
      email: this.refs.email.state.value,
      message: this.refs.message.state.value,
    };

    const request = {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(data),
    };

    const sleej = delay => new Promise(resolve => setTimeout(resolve, delay));

    await sleej(1000);
    const response = await fetch("/contact", request);
    if (response.status == 200) {
      const message = document.getElementsByClassName("message-message")[0];
      message.innerHTML = "Your message has been sent, we'll get back to you shortly!~";

      const resp = document.getElementsByClassName("response")[0];
      resp.classList = "response enable";

      this.refs.submit.value = "Sent!";
    }
    else {
      const body = await response.json()

      const message = document.getElementsByClassName("message-message")[0];
      message.classList = "message-message enable";
      message.innerHTML = `Your message could not be sent, please try again
        <br>
        <div class='error'>${body.errors[0].msg}</div>`;

      const resp = document.getElementsByClassName("response")[0];
      resp.classList = "response enable";

      this.refs.submit.value = "Submit";
    }
  }

  messageFade(e) {
    e.preventDefault();
    const resp = document.getElementsByClassName("response")[0];
    resp.classList = "response";
    this.refs.submit.disabled = false;
    const left = document.getElementsByClassName("contact-column-left")[0];
    const right = document.getElementsByClassName("contact-column-right")[0];
    const loading = document.getElementsByClassName("loading")[0];
    left.classList = "contact-column-left enable";
    right.classList = "contact-column-right enable";
    loading.classList = "loading";
  }

  render() {
    return (
      <form className="contact-contain">
        <div className="loading">
          <div className="splash-loading-text">
            SENDING
          </div>
          <div className="splash-loading-box-container">
            <div className="splash-loading-box"/>
          </div>
        </div>
        <div className="response">
          <div className="message-contain">
            <div className="input-bg">
              <div className="message">
              <div className="message-message"/>
              <button type="button" onClick={this.messageFade} className="message-button">OK</button>
              </div>
            </div>
          </div>
        </div>
        <div className="contact-column-left">
          <SelectFormInput ref="subject" name="subject"/>
          <TextFormInput ref="name" name="name"/>
          <TextFormInput ref="email" name="email"/>
          <div className="input-bg">
            <input onClick={this.handleSubmit} ref="submit" id="submit" type="submit" value="Submit"/>
          </div>
        </div>
        <div className="contact-column-right">
          <MessageFormInput ref="message" name="message"/>
        </div>
      </form>
    )
  }

  componentWillUnmount() {
    window.onresize = null;
  }
}

export default Contact;