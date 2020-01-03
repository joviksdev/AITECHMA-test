const form = document.querySelector('.registration-form');
const toggle_password = document.querySelector('.toggle-password');

const check_detail = document.querySelector('.check-detail-form');

if (check_detail !== null) {
  check_detail.addEventListener('submit', checkDetail);
}

/* Show/hide password */
if (toggle_password !== null) {
  toggle_password.addEventListener('click', function() {
    const password = document.querySelector('.user-password');

    if (this.checked) {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  });
}

/* Handle and process the form */

if (form !== null) {
  form.addEventListener('submit', processForm);
}

function processForm(e) {
  e.preventDefault();

  /* grab the form input value */

  const userName = document.querySelector('.user-name');
  const userPhone = document.querySelector('.user-number');
  const userEmail = document.querySelector('.user-email');

  const container = document.querySelector('.container');
  const form = document.querySelector('.registration-form');

  const update = document.querySelector('.update');
  if (container.contains(update)) {
    container.removeChild(update);
  }

  const userDetails = {
    name: userName.value,
    phone: userPhone.value,
    email: userEmail.value
  };
  if (isValid(userDetails)) {
    fetch('registration.js', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(userDetails)
    })
      .then(res => {
        if (res.ok) {
          return res.text();
        } else {
          return Promise.reject({
            status: res.status,
            statusText: res.statusText
          });
        }
      })
      .then(data => {
        const updateHtml = document.createElement('div');
        updateHtml.className = 'update';

        const dataFromServer = JSON.parse(data);
        updateHtml.innerHTML = `
      <p>Hello <strong>${dataFromServer.name}</strong>, your details has ben added successfully</p>
      <p>A generated password has been sent to your email. <a href='checkdetail.html'><strong>Log in</strong></a> to view you details</p>
      `;

        container.insertBefore(updateHtml, form);
      })
      .catch(error =>
        console.log('Error occur adding detail ' + error.statusText)
      );
  } else {
    console.log('Incorrect Details');
  }

  this.reset();
}

/* function to handle user detail and send request to the server */
function checkDetail(e) {
  e.preventDefault();

  /* grab onto the form element */

  const email = document.querySelector('.user-email');
  const password = document.querySelector('.user-password');
  const form = document.querySelector('.check-detail-form');
  const p = document.querySelector('.information');

  /* Check if form contain error info in dom and remove if the exist */

  const error = document.querySelector('.error');

  if (form.contains(error)) {
    form.removeChild(error);
  }
  /* create and error element */

  const errorHtml = document.createElement('p');
  errorHtml.className = 'error';

  const login_detail = {
    email: email.value,
    password: password.value
  };

  fetch('checkdetail.js', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(login_detail)
  })
    .then(res => {
      if (res.ok) {
        return res.text();
      } else {
        return Promise.reject({
          status: res.status,
          statusText: res.statusText
        });
      }
    })
    .then(data => {
      const { name, phone, email, err } = JSON.parse(data);

      errorHtml.textContent = `*${err}`;

      err !== '' && form.insertBefore(errorHtml, p);

      if (name !== '' || phone !== '' || email !== '') {
        let outputHtml = `
        <div>
        <h3>User Detail</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone Number:</strong> ${phone} </p>
        <p><strong>Email: </strong> ${email} </p>
        </div>
      `;

        document.querySelector('.user-detail').innerHTML = outputHtml;
      }
    })
    .catch(error => console.error('An error occur: ' + error.statusText));

  this.reset();
}

function isValid(details) {
  const { name, phone, email } = details;

  //const valid = /^[a-zA-Z0-9_-.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const phoneno = /^[0-9]{3}[-. ]?[0-9]{3}[-. ]?[0-9]{5}$/;

  if (!isNaN(name) || name === '') {
    name.nextElementSibling.style.color = 'red';
    name.style.borderBottom = '2px solid red';
    return false;
  } else if (isNaN(phone) || !phoneno.test(phone)) {
    return false;
  } else {
    return true;
  }
}
