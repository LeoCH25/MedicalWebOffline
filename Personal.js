// Personal.js
// Lógica para mostrar el modal de personal y los datos de localStorage

document.addEventListener('DOMContentLoaded', () => {
  const btnPersonal = document.querySelector('.menu button:nth-child(3)'); // Tercer botón: Personal
  const modalPersonal = document.getElementById('modalPersonal');
  const cerrarPersonal = document.getElementById('cerrarPersonal');
  const personalLista = document.getElementById('personalLista');

  if (btnPersonal && modalPersonal && cerrarPersonal && personalLista) {
    btnPersonal.addEventListener('click', () => {
      // Obtener usuarios de localStorage
      let usuarios = [];
      try {
        usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      } catch (e) {}
      // Renderizar lista
      if (usuarios.length === 0) {
        personalLista.innerHTML = '<p>No hay usuarios registrados.</p>';
      } else {
        personalLista.innerHTML = '<ul style="list-style:none; padding:0;">' +
          usuarios.map((u, i) => `
            <li style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
              <b>Nombre:</b> ${u.nombre || ''} <br>
              <b>Apellidos:</b> ${u.apellidos || ''} <br>
              <b>ID:</b> ${u.id || ''} <br>
              <b>Matrícula:</b> ${u.matricula || ''} <br>
              <b>Rol:</b> ${u.rol || ''} <br>
              <button style="margin-right:8px;" data-index="${i}" class="modificarUsuario">Modificar</button>
              <button data-index="${i}" class="eliminarUsuario">Eliminar</button>
            </li>
          `).join('') + '</ul>';
      }
      modalPersonal.style.display = 'flex';
    });
    cerrarPersonal.addEventListener('click', () => {
      modalPersonal.style.display = 'none';
    });
  }
});
