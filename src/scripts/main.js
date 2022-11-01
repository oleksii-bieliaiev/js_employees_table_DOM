'use strict';

const tbody = document.querySelector('tbody');
let sorted;

function Normalize(salary) {
  return +salary.replace(/[^0-9.-]+/g, '');
}

function sortTable(e) {
  const rows = [...tbody.children];
  const item = e.target.closest('th');
  const index = item.cellIndex;

  if (e.target.textContent === sorted) {
    rows.reverse();
  } else {
    sorted = e.target.textContent;

    rows.sort((a, b) => {
      if (!Normalize(a.cells[index].textContent)) {
        return a.cells[index].textContent
          .localeCompare(b.cells[index].textContent);
      }

      return Normalize(a.cells[index].textContent)
      - Normalize(b.cells[index].textContent);
    });
  }
  tbody.append(...rows);
}

document.querySelector('table').addEventListener('click', sortTable);

const body = document.querySelector('body');

function showNotification(title, description, type) {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList = 'notification';
  div.setAttribute('data-qa', 'notification');
  h2.classList = 'title';
  h2.textContent = title;
  div.className = `notification ${type}`;
  p.textContent = description;
  div.append(h2);
  div.append(p);
  body.append(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

body.insertAdjacentHTML('beforeend',
  `<form class="new-employee-form">
      <label>Name:
        <input
          name="name"
          type="text"
          data-qa="name"
        >
      </label>
      <label>Position:
        <input name="position"
          type="text"
          data-qa="position"
      >
      </label>
      <label> Office:
        <select name="office" data-qa="office" >
         <option value="Tokyo">Tokyo</option>
         <option value="Singapore">Singapore</option>
         <option value="London">London</option>
         <option value="New York">New York</option>
         <option value="Edinburgh">Edinburgh</option>
         <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <label>Age:
        <input name="age"
          type="number"
          data-qa="age"
        >
      </label>
      <label>Salary:
        <input
          name="salary"
          type="number"
          data-qa="salary"
        >
      </label>
      <button>Save to table</button>
     </form>`
);

const form = document.querySelector('form');
const inputs = document.querySelectorAll('input');

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const tr = document.createElement('tr');
  const dataArr = [data.get('name'), data.get('position'), data.get('office'),
    data.get('age'), data.get('salary')];

  if (data.get('name').length < 4) {
    showNotification('Short name',
      'Name must have more than 4 letters', 'error');

    return;
  }

  if (!data.get('name') || !data.get('position')
    || !data.get('age') || !data.get('salary')) {
    showNotification('Fields are not filled',
      'You must fill all fields', 'error');

    return;
  }

  if (data.get('age') < 18 || data.get('age') > 90) {
    showNotification('Wrong age',
      'Write an age between 18 and 90', 'error');

    return;
  }

  for (let i = 0; i < dataArr.length; i++) {
    const td = document.createElement('td');

    if (i === dataArr.length - 1) {
      td.textContent = `$${parseInt(dataArr[i]).toLocaleString('en-US')}`;
    } else {
      td.textContent = dataArr[i];
    }
    tr.append(td);
  }

  tbody.append(tr);

  showNotification('Employee added',
    'New data in the table', 'success');

  for (const input of inputs) {
    input.value = null;
  }
});

tbody.addEventListener('click', e => {
  const active = document.querySelector('.active');
  const row = e.target.closest('tr');

  if (!active) {
    row.classList.add('active');
  } else {
    active.classList.remove('active');
    row.classList.add('active');
  }
});

tbody.addEventListener('dblclick', change => {
  const target = change.target;
  const targetText = target.textContent;

  const newInput = document.createElement('input');

  newInput.classList = 'cell-input';
  newInput.name = 'text';
  newInput.type = 'text';
  target.textContent = null;

  target.append(newInput);
  newInput.focus();

  const cellInput = document.querySelector('.cell-input');

  newInput.addEventListener('keydown', eventPush => {
    if (eventPush.code === 'Enter') {
      if (cellInput.value.length === 0) {
        target.textContent = targetText;
      }

      if (target.cellIndex < 3) {
        if (cellInput.value.length < 4) {
          showNotification('Short name',
            'Name must have more than 4 letters', 'error');

          target.textContent = targetText;
        } else {
          target.textContent = cellInput.value;
        }
      }

      if (target.cellIndex === 3) {
        if (+cellInput.value) {
          if (+cellInput.value < 18
              || +cellInput.value > 90) {
            showNotification('Wrong age',
              'Write an age between 18 and 90', 'error');

            target.textContent = targetText;
          } else {
            target.textContent = cellInput.value;
          }
        } else {
          showNotification('Wrong age',
            'Write an age between 18 and 90', 'error');

          target.textContent = targetText;
        }
      }

      if (target.cellIndex === 4) {
        if (+cellInput.value) {
          target.textContent = `
            $${parseInt(cellInput.value).toLocaleString('en-US')}`;
        } else {
          showNotification('Wrong number',
            'Еnter salary', 'error');

          target.textContent = targetText;
        }
      }
    }
  });

  newInput.addEventListener('blur', () => {
    if (cellInput.value.length === 0) {
      target.textContent = targetText;
    }

    if (target.cellIndex < 3) {
      if (cellInput.value.length < 4) {
        showNotification('Short name',
          'Name must have more than 4 letters', 'error');
        target.textContent = targetText;
      } else {
        target.textContent = cellInput.value;
      }
    }

    if (target.cellIndex === 3) {
      if (+cellInput.value) {
        if (+cellInput.value < 18
            || +cellInput.value > 90) {
          showNotification('Wrong age',
            'Write an age between 18 and 90', 'error');

          target.textContent = targetText;
        } else {
          target.textContent = cellInput.value;
        }
      } else {
        showNotification('Wrong age',
          'Write an age between 18 and 90', 'error');
        target.textContent = targetText;
      }
    }

    if (target.cellIndex === 4) {
      if (+cellInput.value) {
        target.textContent = `
          $${parseInt(cellInput.value).toLocaleString('en-US')}`;
      } else {
        showNotification('Wrong number',
          'Еnter salary', 'error');

        target.textContent = targetText;
      }
    }
  });
});
