// categoria-pacientes.js
// Lógica para la gestión de pacientes

document.addEventListener('DOMContentLoaded', () => {
  // Obtener información del usuario
  const params = new URLSearchParams(window.location.search);
  const usuario = params.has('practicante') ? 'practicante' : 'admin';
  const nombre = params.get('nombre') || (usuario === 'admin' ? 'Administrador' : 'Practicante');

  // Mostrar nombre del usuario
  let usuarioActualNombre = '';
  try {
    const usuarioActualLS = JSON.parse(localStorage.getItem('usuarioActual'));
    if (usuarioActualLS && usuarioActualLS.nombre) {
      usuarioActualNombre = usuarioActualLS.nombre;
    }
  } catch (e) {}
  
  const userNameSpan = document.getElementById('userName');
  if (userNameSpan) {
    userNameSpan.textContent = usuarioActualNombre || nombre;
  }

  // Lógica del menú de usuario
  const userIcon = document.getElementById('userIcon');
  const userDropdown = document.getElementById('userDropdown');
  if (userIcon && userDropdown) {
    userIcon.addEventListener('click', function(e) {
      userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
      e.stopPropagation();
    });
    document.body.addEventListener('click', function() {
      userDropdown.style.display = 'none';
    });
  }
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }

  // Configurar botón de volver
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    if (usuario === 'practicante') {
      backBtn.style.display = 'none';
    } else {
      backBtn.addEventListener('click', function() {
        window.history.back();
      });
    }
  }

  // Manejo de navegación lateral
  const sidebarButtons = document.querySelectorAll('.sidebar-menu button');
  const sections = document.querySelectorAll('.form-section');
  const defaultSection = document.getElementById('default-section');

  sidebarButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetSection = this.getAttribute('data-section');
      
      sidebarButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      if (defaultSection) {
        defaultSection.style.display = 'none';
      }
      
      sections.forEach(section => {
        section.classList.remove('active');
      });
      
      const activeSection = document.getElementById(`${targetSection}-section`);
      if (activeSection) {
        activeSection.classList.add('active');
      }
    });
  });

  const historialBtn = document.querySelector('button[data-section="historial"]');
  if(historialBtn) {
    historialBtn.click();
  }

  // --- CÓDIGO ACTUALIZADO PARA FORMULARIO Y REGISTRO DE PACIENTES ---
  const pesoInput = document.getElementById('peso');
  const alturaInput = document.getElementById('altura');
  const imcResultado = document.getElementById('imc-resultado');
  const form = document.getElementById('patient-form');
  const errorMessage = document.getElementById('error-message');
  const historyBody = document.getElementById('history-body');

  cargarHistorial();

  if(pesoInput) pesoInput.addEventListener('input', calcularYMostrarIMC);
  if(alturaInput) alturaInput.addEventListener('input', calcularYMostrarIMC);

  if(form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        validarYGuardarDatos();
    });
  }

  function calcularYMostrarIMC() {
      const peso = parseFloat(pesoInput.value);
      const alturaCm = parseFloat(alturaInput.value);

      if (peso > 0 && alturaCm > 0) {
          const alturaM = alturaCm / 100;
          const imc = peso / (alturaM * alturaM);
          imcResultado.textContent = imc.toFixed(2);
      } else {
          imcResultado.textContent = '---';
      }
  }

  function validarYGuardarDatos() {
      // 1. CAPTURAR LOS NUEVOS DATOS
      const datosPersonales = {
          nombreCompleto: document.getElementById('nombreCompleto').value.trim(),
          edad: document.getElementById('edad').value.trim(),
          matricula: document.getElementById('matricula').value.trim(),
          carrera: document.getElementById('carrera').value.trim()
      };

      const datosMedicos = {
          peso: pesoInput.value.trim(),
          altura: alturaInput.value.trim(),
          presion: document.getElementById('presion').value.trim(),
          glucosa: document.getElementById('glucosa').value.trim(),
          temperatura: document.getElementById('temperatura').value.trim()
      };

      let errores = [];

      // 2. VALIDAR LOS NUEVOS CAMPOS
      if (datosPersonales.nombreCompleto === '') errores.push('El nombre y apellidos son requeridos.');
      if (!datosPersonales.edad || isNaN(datosPersonales.edad) || parseInt(datosPersonales.edad) <= 0) errores.push('La edad debe ser un número positivo.');
      if (datosPersonales.matricula === '') errores.push('La matrícula es requerida.');
      if (datosPersonales.carrera === '') errores.push('La carrera es requerida.');

      // Validaciones de datos médicos (existentes)
      if (!datosMedicos.peso || isNaN(datosMedicos.peso) || parseFloat(datosMedicos.peso) <= 0) errores.push('El peso debe ser un número positivo.');
      if (!datosMedicos.altura || isNaN(datosMedicos.altura) || parseFloat(datosMedicos.altura) <= 0) errores.push('La altura debe ser un número positivo.');
      if (datosMedicos.presion === '') errores.push('La presión arterial es requerida.');


      if (errores.length > 0) {
          errorMessage.innerHTML = errores.join('<br>');
          errorMessage.style.display = 'block';
      } else {
          errorMessage.style.display = 'none';
          
          // 3. GUARDAR EL REGISTRO COMPLETO
          const registro = {
              ...datosPersonales,
              ...datosMedicos,
              imc: imcResultado.textContent,
              fecha: new Date().toLocaleString('es-MX')
          };
          
          guardarRegistro(registro);
          actualizarTablaHistorial(registro);
          form.reset();
          imcResultado.textContent = '---';
          
          mostrarConfirmacion('Registro Exitoso', 'Los datos del paciente se han guardado correctamente.');
      }
  }
  
  function guardarRegistro(registro) {
      const historial = JSON.parse(localStorage.getItem('historialPacientes')) || [];
      historial.unshift(registro);
      localStorage.setItem('historialPacientes', JSON.stringify(historial));
  }

  function cargarHistorial() {
      if(!historyBody) return;
      const historial = JSON.parse(localStorage.getItem('historialPacientes')) || [];
      historyBody.innerHTML = '';
      historial.forEach(registro => actualizarTablaHistorial(registro, false));
  }

  function actualizarTablaHistorial(registro, esNuevo = true) {
      if(!historyBody) return;
      const fila = document.createElement('tr');
      // 4. MOSTRAR LOS NUEVOS DATOS EN LA TABLA
      fila.innerHTML = `
          <td>${registro.fecha}</td>
          <td>${registro.nombreCompleto}</td>
          <td>${registro.matricula}</td>
          <td>${registro.carrera}</td>
          <td>${registro.edad}</td>
          <td>${registro.peso}</td>
          <td>${registro.altura}</td>
          <td>${registro.imc}</td>
      `;
      
      if (esNuevo) {
          historyBody.prepend(fila);
      } else {
          historyBody.appendChild(fila);
      }
  }

  function mostrarConfirmacion(titulo, mensaje) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      display: flex; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: linear-gradient(135deg, rgba(125, 211, 252, 0.9), rgba(254, 243, 199, 0.9));
      z-index: 9999; justify-content: center; align-items: center;
    `;
    
    modal.innerHTML = `
      <div style="
        background: rgba(255, 255, 255, 0.98); padding: 30px; border-radius: 20px;
        min-width: 350px; max-width: 500px; text-align: center;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3); border: 2px solid rgba(125, 211, 252, 0.4);
        position: relative; margin: 20px;
      ">
        <div style="margin-bottom: 20px; font-size: 3rem;">✅</div>
        <h3 style="
          margin: 0 0 15px 0; font-size: 1.5rem; font-weight: 700; color: transparent;
          background: linear-gradient(135deg, #06b6d4, #10b981);
          -webkit-background-clip: text; background-clip: text;
        ">${titulo}</h3>
        <p style="
          margin: 0 0 25px 0; font-size: 1.1rem; color: #374151; line-height: 1.5;
        ">${mensaje}</p>
        <button onclick="this.closest('div[style*=\\'position: fixed\\']').remove()" style="
          background: linear-gradient(135deg, #7dd3fc, #fef3c7); color: #1f2937;
          border: none; border-radius: 25px; padding: 12px 30px; font-size: 1rem;
          font-weight: 600; cursor: pointer; transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(125, 211, 252, 0.3);
        ">Aceptar</button>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
});