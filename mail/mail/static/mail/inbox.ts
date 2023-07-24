document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox')?.addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent')?.addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived')?.addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose')?.addEventListener('click', compose_email);
  document.querySelector('#compose_submit')?.addEventListener('click', () => send_email());
  // By default, load the inbox
  load_mailbox('inbox');
});         

  
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  var emails_view = document.querySelector('#emails-view');
  emails_view.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
 
  
  fetch('/emails/'+ mailbox)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);
    
    emails_view.innerHTML += `<div class="row border" id="email_header">`;
    let email_header = document.querySelector('#email_header');

    if(mailbox != 'sent'){ 
      email_header.innerHTML += `<div class="col-4"><h5>Sender</h5></div>`; 
    }
    else{ 
      email_header.innerHTML += `<div class="col-4"><h5>Recipient</h5></div>`; 
    }

    email_header.innerHTML += `<div class="col-4">Subject</div>`;
    email_header.innerHTML += `<div class="col-4">Time</div>`;
    emails_view.innerHTML += `</div>`;

   
    for(let i = 0; i < emails.length; i++){


      if(emails[i].read === true){
        emails_view.innerHTML += `<div class="row border read open" onclick="open_email(${emails[i].id}, '${mailbox}')"  id="email${i}">`;
        let email = document.querySelector('#email' + i);
        if(mailbox != 'sent'){
          email.innerHTML += `<div class="col-4"><h5>${emails[i].sender}</h5></div>`;
        }
        else{
          email.innerHTML += `<div class="col-4"><h5>${emails[i].recipients}<br></h5></div>`
        }
        email.innerHTML += `<div class="col-4">${emails[i].subject}</div>`;
        email.innerHTML += `<div class="col-4">${emails[i].timestamp}</div>`;
        emails_view.innerHTML += `</div>`; 
        
      }

      else{
        emails_view.innerHTML += `<div class="row border open" onclick="open_email(${emails[i].id}, '${mailbox}')"  id="email${i}">`;
        let email = document.querySelector('#email' + i);
        if(mailbox != 'sent'){
          email.innerHTML += `<div class="col-4"><h5>${emails[i].sender}</h5></div>`;
        }
        else{
          email.innerHTML += `<div class="col-4"><h5>${emails[i].recipients}<br></h5></div>`
        }
        email.innerHTML += `<div class="col-4">${emails[i].subject}</div>`;
        email.innerHTML += `<div class="col-4">${emails[i].timestamp}</div>`;
        emails_view.innerHTML += `</div>`;

      }
    }

  });

}

function send_email(){
    const compose_recipients = document.querySelector('#compose-recipients')?.value;
    const compose_subject = document.querySelector('#compose-subject')?.value;
    const compose_body = document.querySelector('#compose-body')?.value;
    
  
  
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: compose_recipients,
        subject: compose_subject,
        body: compose_body,
      })
    })
  
    load_mailbox('sent');
}

function open_email(email_id, mailbox){

  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';

  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email =>{

    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    });
     
    if(mailbox === 'inbox'){
      // Show the email title name
      var emails_view = document.querySelector('#emails-view');
      emails_view.innerHTML = `<h3>${email.subject.charAt(0).toUpperCase() + email.subject.slice(1)}</h3>`;

      // Show the contents of the email
      emails_view.innerHTML += `<div class="row button-row">`;
      let button_row = document.querySelector('.button-row');
      button_row.innerHTML += `<div class="col-6"><button class="btn btn-block btn-outline-primary return-button">Return</button><br></div>`;
      button_row.innerHTML += `<div class="col-6"><button class="btn btn-block btn-outline-primary archive-button">Archive</button></div>`;
      emails_view.innerHTML += `</div><br>`;

      emails_view.innerHTML += `<form id="email-form">`;
      let email_form = document.querySelector("#email-form");
      email_form.innerHTML +=  `From: <input disabled id="compose-recipients" class="form-control" value="${email.recipients}">`;
      email_form.innerHTML +=  `</div>`;
      email_form.innerHTML +=  `<div class="form-group">`;
      email_form.innerHTML +=  `<input disabled class="form-control" id="compose-subject" value="${email.subject}">`;
      email_form.innerHTML +=  `</div><br>`;
      email_form.innerHTML +=  `<textarea disabled class="form-control" id="compose-body">${email.body}</textarea><br>`;
      emails_view.innerHTML += `</form><br><button class="btn btn-block btn-primary rounded shadow-sm reply-button">Reply</button>`;

      document.querySelector('.reply-button')?.addEventListener('click', () => reply_email(email_id, mailbox));
      document.querySelector('.return-button')?.addEventListener('click', () => load_mailbox('inbox'));
      document.querySelector('.archive-button')?.addEventListener('click', () => archive_email(email_id, mailbox));
    }
    if(mailbox === 'sent'){
      var emails_view = document.querySelector('#emails-view');
      emails_view.innerHTML = `<h3>${email.subject.charAt(0).toUpperCase() + email.subject.slice(1)}</h3>`;

      // Show the contents of the email
      emails_view.innerHTML += `<div class="row button-row">`;
      let button_row = document.querySelector('.button-row');
      button_row.innerHTML += `<div class="col-6"><button class="btn btn-block btn-outline-primary return-button">Return</button><br></div>`;
      button_row.innerHTML += `<div class="col-6"><button class="btn btn-block btn-outline-primary archive-button">Archive</button></div>`;
      emails_view.innerHTML += `</div><br>`;

      emails_view.innerHTML += `<form id="email-form">`;
      let email_form = document.querySelector("#email-form");
      email_form.innerHTML +=  `To: <input disabled id="compose-recipients" class="form-control" value="${email.recipients}">`;
      email_form.innerHTML +=  `</div>`;
      email_form.innerHTML +=  `<div class="form-group">`;
      email_form.innerHTML +=  `<input disabled class="form-control" id="compose-subject" value="${email.subject}">`;
      email_form.innerHTML +=  `</div><br>`;
      email_form.innerHTML +=  `<textarea disabled class="form-control" id="compose-body">${email.body}</textarea><br>`;
      emails_view.innerHTML += `</form><br><button class="btn btn-block btn-primary rounded shadow-sm reply-button" id="open-email">Reply</button>`;

      document.querySelector('.reply-button')?.addEventListener('click', () => this.reply_email(email_id, mailbox));
      document.querySelector('.return-button')?.addEventListener('click', () => load_mailbox('sent'));
      document.querySelector('.archive-button')?.addEventListener('click', () => archive_email(email_id, mailbox));
    }

    if(mailbox === 'archive'){
      var emails_view = document.querySelector('#emails-view');
      emails_view.innerHTML = `<h3>${email.subject.charAt(0).toUpperCase() + email.subject.slice(1)}</h3>`;

      // Show the contents of the email
       emails_view.innerHTML += `<div class="row button-row">`;
      let button_row = document.querySelector('.button-row');
      button_row.innerHTML += `<div class="col-6"><button class="btn btn-block btn-outline-primary return-button">Return</button><br></div>`;
      button_row.innerHTML += `<div class="col-6"><button class="btn btn-block btn-outline-primary archive-button">Remove Archive</button></div>`;
      emails_view.innerHTML += `</div><br>`;

      emails_view.innerHTML += `<form id="email-form">`;
      let email_form = document.querySelector("#email-form");
      email_form.innerHTML +=  `To: <input disabled id="compose-recipients" class="form-control" value="${email.recipients}">`;
      email_form.innerHTML +=  `</div>`;
      email_form.innerHTML +=  `<div class="form-group">`;
      email_form.innerHTML +=  `<input disabled class="form-control" id="compose-subject" value="${email.subject}">`;
      email_form.innerHTML +=  `</div><br>`;
      email_form.innerHTML +=  `<textarea disabled class="form-control" id="compose-body">${email.body}</textarea><br>`;
      emails_view.innerHTML += `</form><br>`;

      document.querySelector('.return-button')?.addEventListener('click', () => load_mailbox('sent'));
      document.querySelector('.archive-button')?.addEventListener('click', () => archive_email(email_id, mailbox));
    }
  });
}

function reply_email(email_id, mailbox){

  console.log('hello');
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email =>{
     // Show the email title name

    if(mailbox === 'inbox'){
    let emails_view = document.querySelector('#emails-view');
    emails_view.innerHTML = `<h3> ${email.subject.charAt(0).toUpperCase() + email.subject.slice(1)}</h3>`;

    // Show the contents of the email plus the ability to enter the content for the new email
    emails_view.innerHTML += `<button class="btn btn-danger return-button" onclick="load_mailbox('${mailbox}')">Return</button><br>`;
    emails_view.innerHTML += `<form id="email-form">`;
    let email_form = document.querySelector("#email-form");
    email_form.innerHTML +=  `<div class="form-group">`;
    email_form.innerHTML +=  `To: <input disabled id="compose-recipients" class="form-control" value="${email.sender}">`;
    email_form.innerHTML +=  `</div>`;
    email_form.innerHTML +=  `<div class="form-group">`;
    
    if(email.subject.includes('Re:')){ 
      email_form.innerHTML +=  `Subject: <input disabled class="form-control" id="compose-subject" value="${email.subject}">`; 
    }

    else{
      email_form.innerHTML +=  `Subject: <input disabled class="form-control" id="compose-subject" value="Re: ${email.subject}">`;
    }

    email_form.innerHTML +=  `</div><br>`;
    email_form.innerHTML +=  `<textarea class="form-control" id="compose-body">"On ${email.timestamp} ${email.sender} wrote" ${email.body}</textarea><br>`;
    email_form.innerHTML +=  ``;
    emails_view.innerHTML += `</form><br><button class="btn btn-block btn-primary rounded shadow-sm replied-button">Send</button>`;
    document.querySelector('.replied-button')?.addEventListener('click', () => this.send_email());
    }

    if(mailbox === 'sent'){
      let emails_view = document.querySelector('#emails-view');
      emails_view.innerHTML = `<h3> ${email.subject.charAt(0).toUpperCase() + email.subject.slice(1)}</h3>`;

      // Show the contents of the email plus the ability to enter the content for the new email
      emails_view.innerHTML += `<button class="btn btn-danger return-button" onclick="load_mailbox('${mailbox}')">Return</button><br>`;
      emails_view.innerHTML += `<form id="email-form">`;
      let email_form = document.querySelector("#email-form");
      email_form.innerHTML +=  `<div class="form-group">`;
      email_form.innerHTML +=  `To: <input disabled id="compose-recipients" class="form-control" value="${email.recipients}">`;
      email_form.innerHTML +=  `</div>`;
      email_form.innerHTML +=  `<div class="form-group">`;

      if(email.subject.includes('Re:')){ 
        email_form.innerHTML +=  `Subject: <input disabled class="form-control" id="compose-subject" value="${email.subject}">`; 
      }

      else{
        email_form.innerHTML +=  `Subject: <input disabled class="form-control" id="compose-subject" value="Re: ${email.subject}">`;
      }
      email_form.innerHTML +=  `</div><br>`;
      email_form.innerHTML +=  `<textarea class="form-control" id="compose-body">"On ${email.timestamp} ${email.sender} wrote" ${email.body}</textarea><br>`;
      email_form.innerHTML +=  ``;
      emails_view.innerHTML += `</form><br><button class="btn btn-block btn-primary rounded shadow-sm replied-button">Send</button>`;
      document.querySelector('.replied-button')?.addEventListener('click', () => this.send_email());

    }

  });
}

function archive_email(email_id, mailbox){
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email =>{

    if(mailbox === 'inbox' || mailbox === 'sent'){
      fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: true
        })
      });
    }

    if(mailbox === 'archive'){
      fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: false
        })
      });
    }

    load_mailbox('inbox');
  });
}
