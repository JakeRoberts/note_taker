let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  //whatever elem passed through will add none to display property
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
// fetching to own api, expect to get json back.
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
//fetching own api, posting json. post for sending data
  fetch('/api/notes', {
    method: 'POST',
    //specifies content type and sends data which is then formatted into json
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
// returns the promise of a fetch, allows you to later on do deletenote then something else.
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    //not sending any data
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    // setting attributes on the html element itself. Usually put on form elements that are disabled so you cant type into them anymore.
    //setAttribute is a javascript function that adds attribute. two arguments. first is name of attribute. sencond is value of attribute
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    // default for returning undefined
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  //newNote block scope. only exists in this function.
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
// e is event object
const handleNoteDelete = (e) => {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  //element that will experience the event
  //finding out which trash button was clicked
  const note = e.target;
  // note.parentELement, note is trash button, parent el is li, then reading custom attr data note, then parses into object using json parse, then reads id property of that obj.  
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  // once found note to delete will delete. api call removes it from the backend
  if (activeNote.id === noteId) {
    //removes front end
    activeNote = {};
  }

  //removes backend
  //deleteNote calls fetch
  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};


const handleRenderSaveBtn = () => {
  //validating user input. needs atleast one real character typed into it.
  // notetilte is element, value is whatever the user types into it, trim removes the whitespace in the beginning andd the end.
  //! reverses the boolean value. falsey becomest true, truthy becomes false. Empty string is falsey
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  //expecting json document in return. await= syntatic way of handling javascript promises. forcing async javascript to preform sync
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  //function within a function. calls every note. creates html for each not in note list
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.innerText = text;
    //when click on name of note will render in different view
    spanEl.addEventListener('click', handleNoteView);
    //appends span
    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      //font awseome. gets trash icon
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  //of no notes will not have a trashcan 
  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }
// otherwise for every note create li
  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });
  
  //appends each li to the list
  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
//calls get notes then called rendernotelist. called after the fetch. pssed in will be result of the fetch,
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
