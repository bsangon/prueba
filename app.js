// ── Estado global ──────────────────────────────────────────────────────────────
const state = {
  shifts: [
    { id: 's1', name: 'Mañana',  code: 'M', start: '07:00', end: '15:00', color: '#bfdbfe' },
    { id: 's2', name: 'Tarde',   code: 'T', start: '15:00', end: '23:00', color: '#bbf7d0' },
    { id: 's3', name: 'Noche',   code: 'N', start: '23:00', end: '07:00', color: '#e9d5ff' },
    { id: 's4', name: 'Libre',   code: 'L', start: '',      end: '',      color: '#f1f5f9' },
  ],
  employees: [
    { id: 'e1', name: 'Ana García' },
    { id: 'e2', name: 'Carlos López' },
    { id: 'e3', name: 'María Pérez' },
    { id: 'e4', name: 'Juan Martín' },
  ],
  schedule: {},   // { 'eId_day': shiftId }
  month: null,    // Date object (primer día del mes)
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function isWeekend(date, day) {
  const d = new Date(date.getFullYear(), date.getMonth(), day);
  return d.getDay() === 0 || d.getDay() === 6;
}

function dayName(date, day) {
  const d = new Date(date.getFullYear(), date.getMonth(), day);
  return d.toLocaleDateString('es-ES', { weekday: 'short' });
}

function monthLabel(date) {
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

function shiftById(id) {
  return state.shifts.find(s => s.id === id);
}

// ── Renderizado de configuracion ───────────────────────────────────────────────
function renderShifts() {
  const list = document.getElementById('shifts-list');
  list.innerHTML = '';
  state.shifts.forEach(shift => {
    const div = document.createElement('div');
    div.className = 'shift-item';
    div.innerHTML = `
      <input type="color" value="${shift.color}" data-id="${shift.id}" data-field="color" title="Color" />
      <input type="text" value="${shift.name}" data-id="${shift.id}" data-field="name" placeholder="Nombre" />
      <input type="text" value="${shift.code}" data-id="${shift.id}" data-field="code" placeholder="Cod" style="max-width:40px;text-align:center" />
      <span class="time-range">
        <input type="time" value="${shift.start}" data-id="${shift.id}" data-field="start" />
        –
        <input type="time" value="${shift.end}" data-id="${shift.id}" data-field="end" />
      </span>
      <button class="remove-btn" data-id="${shift.id}" title="Eliminar">✕</button>
    `;
    list.appendChild(div);
  });

  list.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', e => {
      const { id, field } = e.target.dataset;
      const shift = state.shifts.find(s => s.id === id);
      if (shift) shift[field] = e.target.value;
      renderLegend();
    });
  });

  list.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.dataset.id;
      state.shifts = state.shifts.filter(s => s.id !== id);
      renderShifts();
    });
  });
}

function renderEmployees() {
  const list = document.getElementById('employees-list');
  list.innerHTML = '';
  state.employees.forEach(emp => {
    const div = document.createElement('div');
    div.className = 'employee-item';
    div.innerHTML = `
      <input type="text" value="${emp.name}" data-id="${emp.id}" placeholder="Nombre empleado" />
      <button class="remove-btn" data-id="${emp.id}" title="Eliminar">✕</button>
    `;
    list.appendChild(div);
  });

  list.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', e => {
      const emp = state.employees.find(em => em.id === e.target.dataset.id);
      if (emp) emp.name = e.target.value;
    });
  });

  list.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.dataset.id;
      state.employees = state.employees.filter(em => em.id !== id);
      renderEmployees();
    });
  });
}

// ── Generacion automatica ──────────────────────────────────────────────────────
function generateSchedule() {
  const monthInput = document.getElementById('month-picker').value;
  if (!monthInput) { alert('Selecciona un mes.'); return; }
  if (state.employees.length === 0) { alert('Añade al menos un empleado.'); return; }

  const workShifts = state.shifts.filter(s => s.code !== 'L');
  if (workShifts.length === 0) { alert('Añade al menos un turno de trabajo.'); return; }

  const [year, month] = monthInput.split('-').map(Number);
  state.month = new Date(year, month - 1, 1);
  const totalDays = daysInMonth(state.month);
  const daysOff = parseInt(document.getElementById('days-off').value, 10) || 0;
  const balanceRule = document.getElementById('rule-balance').checked;
  const noConsecutiveRule = document.getElementById('rule-no-consecutive').checked;

  state.schedule = {};

  // Determinar dias libres por empleado (preferencia fines de semana)
  state.employees.forEach(emp => {
    const offDays = new Set();

    // Primero los fines de semana
    for (let d = 1; d <= totalDays && offDays.size < daysOff; d++) {
      if (isWeekend(state.month, d)) offDays.add(d);
    }

    // Completar con dias aleatorios si hace falta
    let attempts = 0;
    while (offDays.size < daysOff && attempts < 500) {
      const d = Math.floor(Math.random() * totalDays) + 1;
      if (!isWeekend(state.month, d)) offDays.add(d);
      attempts++;
    }

    // Asignar turnos
    const shiftCounts = {};
    workShifts.forEach(s => { shiftCounts[s.id] = 0; });
    let consecutive = 0;
    let lastOff = false;

    for (let d = 1; d <= totalDays; d++) {
      const key = `${emp.id}_${d}`;
      if (offDays.has(d)) {
        state.schedule[key] = 'L';
        consecutive = 0;
        lastOff = true;
        continue;
      }

      // Romper racha de >5 dias consecutivos
      if (noConsecutiveRule && consecutive >= 5 && !lastOff) {
        state.schedule[key] = 'L';
        consecutive = 0;
        lastOff = true;
        continue;
      }

      // Elegir turno (balance o aleatorio)
      let chosen;
      if (balanceRule) {
        const minCount = Math.min(...workShifts.map(s => shiftCounts[s.id]));
        const candidates = workShifts.filter(s => shiftCounts[s.id] === minCount);
        chosen = candidates[Math.floor(Math.random() * candidates.length)];
      } else {
        chosen = workShifts[Math.floor(Math.random() * workShifts.length)];
      }

      state.schedule[key] = chosen.id;
      shiftCounts[chosen.id]++;
      consecutive++;
      lastOff = false;
    }
  });

  renderSchedule();
}

// ── Renderizado del cuadrante ──────────────────────────────────────────────────
function renderSchedule() {
  if (!state.month) return;

  const totalDays = daysInMonth(state.month);
  document.getElementById('schedule-title').textContent =
    'Cuadrante – ' + monthLabel(state.month);

  renderLegend();
  renderTable(totalDays);
  renderSummary(totalDays);
}

function renderLegend() {
  const legend = document.getElementById('legend');
  legend.innerHTML = state.shifts.map(s => `
    <div class="legend-item">
      <div class="legend-color" style="background:${s.color}"></div>
      <span><strong>${s.code}</strong> ${s.name}${s.start ? ` (${s.start}–${s.end})` : ''}</span>
    </div>
  `).join('');
}

function renderTable(totalDays) {
  const thead = document.getElementById('schedule-thead');
  const tbody = document.getElementById('schedule-tbody');

  // Cabecera
  let headerRow = '<tr><th>Empleado</th>';
  for (let d = 1; d <= totalDays; d++) {
    const we = isWeekend(state.month, d);
    const name = dayName(state.month, d);
    headerRow += `<th class="${we ? 'weekend' : ''}">${name}<br/><small>${d}</small></th>`;
  }
  headerRow += '</tr>';
  thead.innerHTML = headerRow;

  // Filas de empleados
  tbody.innerHTML = '';
  state.employees.forEach(emp => {
    const tr = document.createElement('tr');
    let row = `<td class="employee-name">${emp.name}</td>`;

    for (let d = 1; d <= totalDays; d++) {
      const key = `${emp.id}_${d}`;
      const assignedId = state.schedule[key];
      const we = isWeekend(state.month, d);

      let shift, bg, code;
      if (assignedId === 'L' || !assignedId) {
        shift = null;
        bg = we ? '#ede9fe' : '#f1f5f9';
        code = 'L';
      } else {
        shift = shiftById(assignedId);
        bg = shift ? shift.color : '#fff';
        code = shift ? shift.code : '?';
      }

      const weClass = we ? 'weekend-day' : '';
      row += `<td class="shift-cell ${weClass}"
                  style="background:${bg}"
                  data-emp="${emp.id}"
                  data-day="${d}"
                  title="${shift ? shift.name : 'Libre'}">${code}</td>`;
    }
    tr.innerHTML = row;
    tbody.appendChild(tr);
  });

  // Click en celda para editar
  tbody.querySelectorAll('.shift-cell').forEach(cell => {
    cell.addEventListener('click', openModal);
  });
}

function renderSummary(totalDays) {
  const summary = document.getElementById('summary');
  const workShifts = state.shifts.filter(s => s.code !== 'L');

  let html = '<h3>Resumen por empleado</h3>';
  html += '<table class="summary-table"><thead><tr><th>Empleado</th>';
  workShifts.forEach(s => { html += `<th>${s.name}</th>`; });
  html += '<th>Libres</th><th>Total trabajados</th></tr></thead><tbody>';

  state.employees.forEach(emp => {
    const counts = {};
    workShifts.forEach(s => { counts[s.id] = 0; });
    let offCount = 0;

    for (let d = 1; d <= totalDays; d++) {
      const val = state.schedule[`${emp.id}_${d}`];
      if (val === 'L' || !val) offCount++;
      else if (counts[val] !== undefined) counts[val]++;
    }

    const worked = totalDays - offCount;
    html += `<tr><td style="text-align:left;font-weight:600;padding-left:.5rem">${emp.name}</td>`;
    workShifts.forEach(s => { html += `<td>${counts[s.id]}</td>`; });
    html += `<td>${offCount}</td><td>${worked}</td></tr>`;
  });

  html += '</tbody></table>';
  summary.innerHTML = html;
}

// ── Modal de edicion ───────────────────────────────────────────────────────────
let pendingEdit = null;

function openModal(e) {
  const cell = e.currentTarget;
  const empId = cell.dataset.emp;
  const day = parseInt(cell.dataset.day, 10);
  const emp = state.employees.find(em => em.id === empId);
  const date = new Date(state.month.getFullYear(), state.month.getMonth(), day);
  const dateStr = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  pendingEdit = { empId, day };

  document.getElementById('modal-info').textContent = `${emp.name} – ${dateStr}`;

  const options = document.getElementById('modal-options');
  options.innerHTML = '';

  state.shifts.forEach(shift => {
    const btn = document.createElement('button');
    btn.className = 'modal-option-btn';
    btn.style.background = shift.color;
    btn.textContent = `${shift.code} – ${shift.name}${shift.start ? ` (${shift.start}–${shift.end})` : ''}`;
    btn.addEventListener('click', () => {
      if (pendingEdit) {
        const key = `${pendingEdit.empId}_${pendingEdit.day}`;
        state.schedule[key] = shift.code === 'L' ? 'L' : shift.id;
        renderSchedule();
      }
      closeModal();
    });
    options.appendChild(btn);
  });

  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  pendingEdit = null;
}

// ── Exportar CSV ───────────────────────────────────────────────────────────────
function exportCSV() {
  if (!state.month) return;
  const totalDays = daysInMonth(state.month);

  let csv = 'Empleado';
  for (let d = 1; d <= totalDays; d++) {
    csv += `,${d}`;
  }
  csv += '\n';

  state.employees.forEach(emp => {
    csv += `"${emp.name}"`;
    for (let d = 1; d <= totalDays; d++) {
      const val = state.schedule[`${emp.id}_${d}`];
      let code = 'L';
      if (val && val !== 'L') {
        const shift = shiftById(val);
        code = shift ? shift.code : '?';
      }
      csv += `,${code}`;
    }
    csv += '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `cuadrante_${state.month.getFullYear()}_${String(state.month.getMonth()+1).padStart(2,'0')}.csv`;
  a.click();
}

// ── Inicializacion ─────────────────────────────────────────────────────────────
function init() {
  // Mes actual por defecto
  const now = new Date();
  const monthVal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  document.getElementById('month-picker').value = monthVal;

  renderShifts();
  renderEmployees();

  // Mostrar estado vacio en schedule
  document.getElementById('schedule-tbody').innerHTML =
    '<tr><td colspan="100%" class="empty-state">Configura el cuadrante y pulsa "Generar cuadrante"</td></tr>';

  // Eventos
  document.getElementById('add-shift-btn').addEventListener('click', () => {
    state.shifts.push({ id: uid(), name: 'Turno', code: 'X', start: '08:00', end: '16:00', color: '#fed7aa' });
    renderShifts();
  });

  document.getElementById('add-employee-btn').addEventListener('click', () => {
    state.employees.push({ id: uid(), name: 'Empleado ' + (state.employees.length + 1) });
    renderEmployees();
  });

  document.getElementById('generate-btn').addEventListener('click', generateSchedule);
  document.getElementById('print-btn').addEventListener('click', () => window.print());
  document.getElementById('export-csv-btn').addEventListener('click', exportCSV);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target === document.getElementById('modal')) closeModal();
  });
}

init();
