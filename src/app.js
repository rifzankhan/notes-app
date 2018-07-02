import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import '../public/style.css';
import NoteCard from './notesCard'

// Initialize Firebase
const config = {
apiKey: "AIzaSyB9BtrdxjftmWxc2ab8x7emwaJFlrEWpnM",
authDomain: "notes-app-cc285.firebaseapp.com",
databaseURL: "https://notes-app-cc285.firebaseio.com",
projectId: "notes-app-cc285",
storageBucket: "",
messagingSenderId: "199590744901"
};
firebase.initializeApp(config);


  class App extends Component {
    constructor() {
      super();
      this.state = {
        notes: []
      }
      this.showSidebar = this.showSidebar.bind(this);
      this.addNote = this.addNote.bind(this);
      this.showCreate = this.showCreate.bind(this);
      this.createUser = this.createUser.bind(this);
    }

    componentDidMount () {
      firebase.database().ref().on('value', (res) => {
        const userData = res.val();
        const dataArray = [];
        for(let objKey in userData) {
          userData[objKey].key = objKey;
          dataArray.push(userData[objKey])
        }
        this.setState({
        	notes: dataArray
        })
      });
    }

    showSidebar (e) {
      e.preventDefault();
      this.sidebar.classList.toggle("show");
    }

    addNote (e) {
      e.preventDefault();
      const note = {
        title: this.noteTitle.value,
        text: this.noteText.value
      };

      const dbRef = firebase.database().ref();

      dbRef.push(note);

      this.noteTitle.value = "";
      this.noteText.value = "";
      this.showSidebar(e);
    }

    removeNote (noteId) {
    	const dbRef = firebase.database().ref(noteId);
    	dbRef.remove();
    }

    showCreate(e) {
    	e.preventDefault;
    	this.overlay.classList.toggle("show");
    	this.createUserModal.classList.toggle('show');
    }

    createUser(e) {
    	e.preventDefault;
    	const email = this.createEmail.value;
    	const password = this.createPassword.value;
    	const confirm = this.confirmPassword.value;
    	if(password === confirm) {
    		firebase.auth()
    			.createUserWithEmailAndPassword(email,password)
    			.then((res) =>{
    				this.showCreate(e);
    			})
    			.catch((err) => {
    				alert(err.message)
    			})
    	} else {
    		alert("wrong")
    	}
    }

    render() {
      return (
        <div>
        	<header className="mainHeader">
        		<h1>Noted</h1>
        		<nav>
        			<a href="" onClick={this.showSidebar}>Add New Note</a>
        			<a href="" onClick={this.showCreate}>Create Account</a>
        		</nav>
        	</header> 
        	<div className="overlay" ref={ref => this.overlay = ref}></div>
        	<section className="notes">
            	{this.state.notes.map((note,i) => {
              return (
                  <NoteCard 
                  note={note} 
                  key={`note-${i}`}
                  removeNote={this.removeNote}
                   />
                );
            }).reverse()}
        	</section>
        	<aside className="sidebar" ref={ref => this.sidebar = ref}>
        		<form onSubmit={this.addNote}>
              <h3>Add New Note</h3>
              <div className="close-btn" onClick={this.showSidebar}>
                <i className="fa fa-times"></i>
              </div>
        			<label htmlFor="note-title">Title</label>
        			<input type="text" name="note-title" ref={ref => this.noteTitle = ref}/>
        			<label htmlFor="note-text">Text:</label>
        			<textarea name="note-text" ref={ref => this.noteText = ref}></textarea>
        			<input type="submit" value="Add New Note"/> 
        		</form>
        	</aside>
        	<div className="createUserModal modal" ref={ref => this.createUserModal = ref}>
        		<div className="close">
        			<i className="fa fa-times"></i>
        		</div>
        		<form action="" onSubmit={this.createUser}>
        			<div>
        				<label htmlFor="createEmail">Email:</label>
        				<input type="text" name="createEmail" ref={ref => this.createEmail = ref}/>
        			</div>
        			<div>
        				<label htmlFor="createPassword">Password:</label>
        				<input type="password" name="createPassword" ref={ref => this.createPassword = ref}/>
        			</div>
        			<div>
        				<label htmlFor="comfirmPassword">Comfirm Password:</label>
        				<input type="password" name="comfirmPassword" ref={ref => this.comfirmPassword = ref}/>	
        			</div>
        			<div>
        				<input type="submit" value="Create" />
        			</div>
        		</form>
        	</div>
        </div>
      );
    }
  }

ReactDOM.render(<App />,document.getElementById('app'));