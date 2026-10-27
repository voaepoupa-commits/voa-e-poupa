(() => {
  'use strict';
  const form = document.querySelector('#flight-form');
  const origin = document.querySelector('#origin');
  const destination = document.querySelector('#destination');
  const departure = document.querySelector('#departure');
  const returning = document.querySelector('#return');
  const oneWay = document.querySelector('#one-way');
  const passengers = document.querySelector('#passengers');
  const error = document.querySelector('#form-error');
  const names = { LIS: 'Lisboa (LIS)', OPO: 'Porto (OPO)', FAO: 'Faro (FAO)', LAD: 'Luanda (LAD)', PAR: 'Paris (todos os aeroportos)', RIO: 'Rio de Janeiro (todos os aeroportos)', SID: 'Ilha do Sal (SID)' };
  // Local calendar date: avoids changing the day at UTC midnight.
  const date = new Date();
  const today = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  departure.min = today;
  returning.min = today;
  document.querySelector('#year').textContent = date.getFullYear();
  function updateDates() {
    returning.min = departure.value || today;
    if (returning.value && departure.value && returning.value < departure.value) returning.value = '';
    returning.disabled = oneWay.checked;
    returning.required = !oneWay.checked;
    document.querySelector('#return-field').hidden = oneWay.checked;
    error.hidden = true;
  }
  departure.addEventListener('change', updateDates);
  oneWay.addEventListener('change', updateDates);
  origin.addEventListener('change', () => { error.hidden = true; });
  destination.addEventListener('change', () => { error.hidden = true; });
  document.querySelectorAll('[data-destination]').forEach(button => {
    button.addEventListener('click', () => {
      origin.value = 'LIS';
      destination.value = button.dataset.destination;
      error.hidden = true;
      document.querySelector('#pesquisa').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      departure.focus({ preventScroll: true });
    });
  });
  form.addEventListener('submit', event => {
    error.hidden = true;
    if (origin.value === destination.value || departure.value < today || (!oneWay.checked && returning.value < departure.value)) {
      event.preventDefault();
      error.textContent = origin.value === destination.value ? 'Escolhe uma origem e um destino diferentes.' : 'Verifica as datas: a ida não pode estar no passado e a volta deve ser igual ou posterior à ida.';
      error.hidden = false;
      (origin.value === destination.value ? destination : departure).focus();
      return;
    }
    // Use the provider's human-readable search. No API, prices or availability are simulated.
    // Keep native form submission to avoid popup blockers and retain the current page.
    let query = `Flights from ${names[origin.value]} to ${names[destination.value]} on ${departure.value}`;
    query += oneWay.checked ? ' one way' : ` returning ${returning.value}`;
    query += ` for ${passengers.value} adults economy`;
    let search = form.querySelector('[name="q"]');
    if (!search) { search = document.createElement('input'); search.type = 'hidden'; search.name = 'q'; form.append(search); }
    search.value = query;
  });
  updateDates();
})();
