document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose_submit').addEventListener('click', () => send_email());
  
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

    for(let i = 0; i < emails.length; i++){
      emails_view.innerHTML += `<ul class="list-group"><li class="list-group-item"><h5>${emails[i].sender}</h5> ${emails[i].subject}  ${emails[i].body}</li></ul>`;
    }
    
  });

}

function send_email(){

  const compose_recipients = document.querySelector('#compose-recipients').value;
  const compose_subject = document.querySelector('#compose-subject').value;
  const compose_body = document.querySelector('#compose-body').value;

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



