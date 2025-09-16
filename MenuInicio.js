// MenuInicio.js
// Lógica principal del menú de inicio

// Detecta el tipo de usuario y nombre por parámetro en la URL
const params = new URLSearchParams(window.location.search);
const usuario = params.has('practicante') ? 'practicante' : 'admin';
const nombre = params.get('nombre') || (usuario === 'admin' ? 'Administrador' : 'Practicante');

// Botones permitidos para practicante
const botonesPermitidosPracticante = [
  'Historial médico',
  'Ingresar Nuevo Paciente',
  'Mesas de salud',
  'Citas'
];

document.addEventListener('DOMContentLoaded', () => {
  // Mostrar nombre del usuario junto al icono
  let usuarioActualNombre = '';
  try {
    const usuarioActualLS = JSON.parse(localStorage.getItem('usuarioActual'));
    if (usuarioActualLS && usuarioActualLS.nombre) {
      usuarioActualNombre = usuarioActualLS.nombre;
    }
  } catch (e) {}
  const userNameSpan = document.getElementById('userName');
  if (userNameSpan) {
    userNameSpan.textContent = usuarioActualNombre;
  }
  // Cargar modales externos
  // Abrir modal de nuevo usuario solo para admin
  const btnNuevoUsuario = document.getElementById('btnNuevoUsuario');
  const modalUsuario = document.getElementById('modalUsuario');
  const cancelarUsuario = document.getElementById('cancelarUsuario');
  const formUsuario = document.getElementById('formUsuario');
  if (btnNuevoUsuario && modalUsuario && cancelarUsuario && formUsuario && usuario === 'admin') {
    btnNuevoUsuario.onclick = function() {
      modalUsuario.style.display = 'flex';
    };
    cancelarUsuario.onclick = function() {
      modalUsuario.style.display = 'none';
      formUsuario.reset();
    };
    formUsuario.onsubmit = function(e) {
      e.preventDefault();
      // Obtener datos del formulario
      const datos = Object.fromEntries(new FormData(formUsuario).entries());
      // Guardar en localStorage
      let usuarios = [];
      try {
        usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      } catch (err) {}
      usuarios.push(datos);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      modalUsuario.style.display = 'none';
      formUsuario.reset();
      alert('Usuario registrado correctamente');
    };
  }
  // Mensaje de bienvenida
  let usuarioActual = null;
  try {
    usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
  } catch (e) {}
  let nombreBienvenida = usuarioActual && usuarioActual.nombre ? usuarioActual.nombre : (usuario === 'admin' ? 'Administrador' : 'Practicante');
  document.querySelector('h2').innerText = usuario === 'admin'
    ? `Bienvenido ${nombreBienvenida} (Administrador)`
    : `Bienvenido ${nombreBienvenida}`;

  // Mostrar/ocultar botones según el rol
  document.querySelectorAll('.menu button').forEach(btn => {
    const texto = btn.innerText.trim();
    if (usuario === 'practicante') {
      if (!botonesPermitidosPracticante.some(t => texto.includes(t))) {
        btn.style.display = 'none';
      } else {
        btn.style.display = 'flex';
      }
    } else {
      btn.style.display = 'flex';
    }
  });

  // Lógica del icono de usuario y logout
  const userIcon = document.getElementById('userIcon');
  const userDropdown = document.getElementById('userDropdown');
  const logoutBtn = document.getElementById('logoutBtn');
  if (userIcon && userDropdown) {
    userIcon.onclick = function(e) {
      userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
      e.stopPropagation();
    };
    document.body.addEventListener('click', function() {
      userDropdown.style.display = 'none';
    });
  }
  if (logoutBtn) {
    logoutBtn.onclick = function() {
      window.location.href = 'index.html'; // Redirige al login
    };
  }
});
