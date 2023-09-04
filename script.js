'use strict';

/**-------------------------------
 * BANKIST APP
 * ------------------------------ */

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-07-26T17:01:17.194Z',
    '2023-07-28T23:36:17.929Z',
    '2023-08-26T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-07-26T17:01:17.194Z',
    '2023-07-28T23:36:17.929Z',
    '2023-08-26T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Waleed Salah',
  movements: [6000, 34640, -450, -290, -1510, -1310, 3410, -100],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-07-26T17:01:17.194Z',
    '2023-08-26T23:36:17.929Z',
    '2023-08-27T10:51:36.790Z',
  ],
  currency: 'EGP',
  locale: 'ar-EG',
};
const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
/** -------------------------------------------------------------------------------------------------------- */

/**
 *--------------------------------------------------------------------------------------------------------
 * ALL APP FUNCTIONS
 *--------------------------------------------------------------------------------------------------------
 */

// Formatted Dates Function
const formattedMovementsDate = (date, locale) => {
  // Calc Date
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'today';
  if (daysPassed === 1) return 'yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

// Formatted Currency Function
const formatCurrency = (locale, currency, movements) => {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(locale, options).format(movements);
};

// Create LogOut Timer function
const LogOutTimer = () => {
  // 1- set the time to 5 minutes;
  let time = 240;

  const tick = function () {
    // Define minutes and secondes
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // in each second print time im UI
    labelTimer.textContent = `${min}:${sec}`;

    //  when time equal 0 stop this timer and logout the user
    if (time === 0) {
      labelWelcome.textContent = 'Log in to get started!';
      containerApp.style.opacity = 0;
      clearInterval(timer);
    }

    // decrease 1S of time to run the timer in each one second
    time--;
  };

  //  call this time every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Create reset timer function
const resetTimer = () => {
  if (timer) clearInterval(timer);
  timer = LogOutTimer();
};

// Create display movements function on UI
const displayMovements = (account, sort = false) => {
  containerMovements.innerHTML = '';
  const moves = sort
    ? [...account.movements]?.sort((a, b) => a - b)
    : account.movements;
  moves?.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(account.movementsDates[i]);

    const formattedMovements = formatCurrency(
      account.locale,
      account.currency,
      mov
    );

    const displayDate = formattedMovementsDate(date, account.locale);
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}"> ${
      i + 1
    } ${type} </div>
      <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMovements}</div>
        </div>
       
     
  `;
    containerMovements.insertAdjacentHTML('afterBegin', html);
  });
};
/** -------------------------------------------------------------------------------------------------------- */

// Create Calc display balance
const calcDisplayBalance = account => {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.innerHTML = formatCurrency(
    account.locale,
    account.currency,
    account.balance
  );
};
/** -------------------------------------------------------------------------------------------------------- */

// Create the Calc Display Summary
const calcDisplaySummary = account => {
  // Incomes movements
  const incomes = account.movements
    .filter(deposit => deposit > 0)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumIn.textContent = formatCurrency(
    account.locale,
    account.currency,
    incomes
  );

  // Outputs movements
  const outputs = account.movements
    .filter(withdraw => withdraw < 0)
    .reduce((acc, withdraw) => acc + withdraw, 0);

  labelSumOut.textContent = formatCurrency(
    account.locale,
    account.currency,
    Math.abs(outputs)
  );

  // Interests movements
  const interest = account.movements
    .filter(deposit => deposit > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(intr => intr >= 1)
    .reduce((acc, intr) => acc + intr, 0);

  labelSumInterest.textContent = formatCurrency(
    account.locale,
    account.currency,
    interest
  );
};
/** -------------------------------------------------------------------------------------------------------- */

// Create username property function
const createUsernames = accounts => {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
/** -------------------------------------------------------------------------------------------------------- */

// Create updateUI function that display the information of the currentAccount.
const updateUI = currentAccount => {
  // display movements
  displayMovements(currentAccount);

  // display balance
  calcDisplayBalance(currentAccount);

  // display Summary
  calcDisplaySummary(currentAccount);
};
/** -------------------------------------------------------------------------------------------------------- */

// Implement Login Function
let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  // prevent default submitting form
  e.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    // 1- display welcome message and UI
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Display The current Date
    const currentDate = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      weekday: 'short',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(currentDate);
    /** -------------------------------------------------------------- */

    // Display The UI
    containerApp.style.opacity = 100;

    // 2- Clear username and pin input
    inputLoginUsername.value = inputLoginPin.value = '';
    inputClosePin.blur();

    // to reset the timer after each login request
    resetTimer();

    // Update UI
    updateUI(currentAccount);
  }
});
/** -------------------------------------------------------------------------------------------------------- */

// Create Transfers amounts function
btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  // get info from inputs
  const amounts = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  // Check if the amount
  if (
    receiverAccount &&
    amounts >= 0 &&
    currentAccount.balance >= amounts &&
    receiverAccount?.username !== currentAccount.username
  ) {
    //doing the transfer ..
    currentAccount.movements.push(-amounts);
    receiverAccount?.movements.push(amounts);

    // add the transfer date to movementsDates array
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // to reset the timer after each transfer request

    resetTimer();
    // update UI
    updateUI(currentAccount);
  }
});
/** -------------------------------------------------------------------------------------------------------- */

// Create Request Loan Function
btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  // check
  if (
    loanAmount &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    // add this loan amount to movements array
    currentAccount.movements.push(loanAmount);

    // add the loan date to moveDates array
    currentAccount.movementsDates.push(new Date().toISOString());

    // to reset the timer after each loan request
    resetTimer();

    // Update UI
    updateUI(currentAccount);
  }

  // Clear input
  inputLoanAmount.value = '';
});
/** -------------------------------------------------------------------------------------------------------- */

// Create Delete Account function
btnClose.addEventListener('click', e => {
  e.preventDefault();

  // Confirm the username and pin
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );

    // Delete the account from array
    accounts.splice(index, 1);

    // Hide the UI
    containerApp.style.opacity = 0;
  }

  // Clear the inputs
  inputCloseUsername.value = inputClosePin.value = '';
});
/** -------------------------------------------------------------------------------------------------------- */

// Create Sorting Movements Array
let stored = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount, !stored);
  stored = !stored;
});
/** -------------------------------------------------------------------------------------------------------- */

/** ------------------------------------------
 * LECTURES
 * ------------------------------------------- */

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
