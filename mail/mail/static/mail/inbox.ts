document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox')?.addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent')?.addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived')?.addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose')?.addEventListener('click', compose_email);
  document.querySelector('#compose_submit')?.addEventListener('click', () => send_email());
  document.querySelector('#email-view')?.addEventListener('click', () => open_email(22))

  
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
  emails_view.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3><br>`;
 
  
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

      emails_view.innerHTML += `<div class="row border" onclick="open_email(${emails[i].id})"  id="email${i}">`;
      let email = document.querySelector('#email' + i);
      if(mailbox != 'sent'){
        email.innerHTML += `<div class="col-4"><h5>${emails[i].sender}</h5></div>`;
      }
      else{
        email.innerHTML += `<div class="col-4"><h5>${emails[i].recipients}</h5></div>`
      }
      email.innerHTML += `<div class="col-4">${emails[i].subject}</div>`;
      email.innerHTML += `<div class="col-4">${emails[i].timestamp}</div>`;
      emails_view.innerHTML += `</div>`;  
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
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);
  });

  load_mailbox('sent');
}

function open_email(email_id){

  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
 

  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email =>{
     // Show the email title name
    var emails_view = document.querySelector('#emails-view');
    emails_view.innerHTML = `<h3>${email.subject.charAt(0).toUpperCase() + email.subject.slice(1)}</h3><br>`;
    emails_view.innerHTML += `<form id="email-form">`;
    let email_form = document.querySelector("#email-form");
    email_form.innerHTML +=  `To: <input disabled id="compose-recipients" class="form-control" value="${email.recipients}">`;
    email_form.innerHTML +=  `</div>`;
    email_form.innerHTML +=  `<div class="form-group">`;
    email_form.innerHTML +=  `<input disabled class="form-control" id="compose-subject" value="${email.subject}">`;
    email_form.innerHTML +=  `</div><br>`;
    email_form.innerHTML +=  `<textarea disabled class="form-control" id="compose-body">${email.body}</textarea><br>`;
    email_form.innerHTML +=  `<button class="btn btn-block btn-danger rounded shadow-sm">Reply</button>`;
    emails_view.innerHTML += `</form><br>`;
})
    


}


