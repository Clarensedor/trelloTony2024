//obtengo los botones
let addCardButtons = document.querySelectorAll(".addCardButton");

async function handleAddCardClick(button) {
  button.addEventListener("click", async function () {
    let newCard = document.createElement("div");
    newCard.className = "tarjeta";

    // Prioridad
    let prioridades = ["Low", "High", "Medium"];

    // Estado
    let estados = ["In Progress", "To Do", "Done"];

    let cardContent = `
<div class="inputs">
  <button class="openTask">
    <p>tarea</p>
  </button>
  <button class="eliminar-tarjeta">Eliminar</button>
  <div class="modal">
    <div class="modal-content">
      <span class="close">&times;</span>
      <div class="input-wrapper">
        <label for="title">Título:</label>
        <input type="text" class="title" />
      </div>
      <div class="input-wrapper">
        <label for="description">Descripción:</label>
        <input type="text" class="description" />
      </div>
      <div class="input-wrapper">
        <label for="assignedTo">Asignado a:</label>
        <input type="text" class="assignedTo" />
      </div>
      <div class="input-wrapper">
        <label for="startDate">Fecha de inicio:</label>
        <input type="date" class="startDate" />
      </div>
      <div class="input-wrapper">
        <label for="endDate">Fecha de fin:</label>
        <input type="date" class="endDate" />
      </div>
      <div class="input-wrapper">
        <label for="status">Estado:</label>
        <select class="status">
          ${estados.map(estado => `<option value="${estado}">${estado}</option>`).join('')}
        </select>
      </div>
      <div class="input-wrapper">
        <label for="priority">Prioridad:</label>
        <select class="priority">
          ${prioridades.map(prioridad => `<option value="${prioridad}">${prioridad}</option>`).join('')}
        </select>
      </div>
      <div class="input-wrapper">
        <label for="comments">Comentarios:</label>
        <input type="text" class="comments" />
      </div>
      <div class="input-wrapper">
        <label for="id">ID:</label>
        <input type="text" class="id" disabled />
      </div>
      <button class="save-card">Guardar</button>
    </div>
  </div>
</div>
`;

    // cargar div
    newCard.innerHTML = cardContent;

    let totalTasks = await getTasks();

    const cardData = {

      title: '',
      description: '',
      assignedTo: '',
      startDate: '',
      endDate: '',
      status: estados[0], // Asignar el primer estado de la lista
      priority: prioridades[0], // Asignar la primera prioridad de la lista
      comments: '',
      id: totalTasks + 1,
    };
    await createCard(cardData);

    let eliminarButton = newCard.querySelector(".eliminar-tarjeta");
    eliminarButton.addEventListener("click", function () {
      newCard.remove();
    });

    // Agregar botón de cerrar
    let closeButton = newCard.querySelector(".close");
    closeButton.addEventListener("click", function () {
      newCard.remove();
    });

    // Agregar la nueva tarjeta al contenedor
    let cardsContainer = document.querySelector(".cards");
    cardsContainer.appendChild(newCard);

    // Funcionalidad del modal
    let modal = newCard.querySelector(".modal");
    let openTaskButton = newCard.querySelector(".openTask");
    openTaskButton.addEventListener("click", function () {
      modal.style.display = "block";
    });
    closeButton = modal.querySelector(".close");
    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
    });
    window.addEventListener("click", function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });


    // Evento para guardar la tarjeta
    let saveButton = newCard.querySelector(".save-card");
    saveButton.addEventListener("click", async function () {
      // Obtener los valores de los campos del formulario
      let titleInput = newCard.querySelector(".title").value;
      let descriptionInput = newCard.querySelector(".description").value;
      let assignedToInput = newCard.querySelector(".assignedTo").value;
      let startDateInput = newCard.querySelector(".startDate").value;
      let endDateInput = newCard.querySelector(".endDate").value;
      let statusSelect = newCard.querySelector(".status").value;
      let prioritySelect = newCard.querySelector(".priority").value;
      let commentsInput = newCard.querySelector(".comments").value;
      let id = newCard.querySelector(".id").value;

      let cardData = {
        id: taskId,
        title: titleInput,
        description: descriptionInput,
        assignedTo: assignedToInput,
        startDate: startDateInput,
        endDate: endDateInput,
        status: statusSelect,
        priority: prioritySelect,
        comments: commentsInput,
      };
      await modifyCard(cardData);
      await recargar();
    });
  });
}

addCardButtons.forEach(handleAddCardClick);

window.addEventListener('load', async function () {
  await recargar();
});


async function createCard(cardData) {
  console.log(cardData);
  try {
    const response = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cardData),
      
    });
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
  await recargar();
}

async function modifyCard(cardData) {
  console.log(cardData);
  try {
    const response = await fetch(`http://localhost:3000/api/tasks/${cardData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cardData),
    });
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

async function getTasks() {
  let totalTasks;
  let url = "http://localhost:3000/api/tasks";
  try {
    const response = await fetch(url);
    const data = await response.json();
    totalTasks = data.length;
  } catch (error) {
    console.error('Error:', error);
  }
  return totalTasks;
}

// promesa obtengo response
async function recargar() {
  let url = "http://localhost:3000/api/tasks";
  fetch(url)
    .then(response => response.json())
    .then(data => {
      tareas = data;
      createCardsForResponse(tareas);
      tareas.forEach(e => createCardsForResponse(tareas));

    })
    .catch(error => {
      console.error('Error:', error);
    });
}



//crear cartas
function createCardsForResponse(response) {

  let cardsContainer = document.querySelector(".cards");


  // Eliminar tarjetas existentes //preguntar si esta bien esta chanchada o tengo que hacer alguna cosa 
  let existingCards = cardsContainer.querySelectorAll(".tarjeta");
  existingCards.forEach(card => card.remove());




  //foreach para cargar los datos del response
  response.forEach(item => {
    let newCard = document.createElement("div");
    newCard.dataset.taskId = item.id;
    newCard.className = "tarjeta";
    let cardContent = `
      <div class="inputs">
        <button class="openTask">
          <p>${item.title}</p>
        </button>
        <button class="eliminar-tarjeta">Eliminar</button>
        <div class="modal">
          <div class="modal-content">
            <span class="close">&times;</span>
            <div class="input-wrapper">
              <label for="title">Título:</label>
              <input type="text" class="title" value="${item.title}">
            </div>
            <div class="input-wrapper">
              <label for="description">Descripción:</label>
              <input type="text" class="description" value="${item.description}">
            </div>
            <div class="input-wrapper">
              <label for="assignedTo">Asignado a:</label>
              <input type="text" class="assignedTo" value="${item.assignedTo}">
            </div>
            <div class="input-wrapper">
              <label for="startDate">Fecha de inicio:</label>
              <input type="date" class="startDate" value="${formatDate(item.startDate)}">
            </div>
            <div class="input-wrapper">
              <label for="endDate">Fecha de fin:</label>
              <input type="date" class="endDate" value="${formatDate(item.endDate)}">
            </div>
            <div class="input-wrapper">
              <label for="status">Estado:</label>
              <select class="status">
                <option value="En Proceso" ${item.status === "In Progress" ? "selected" : ""}>En Proceso</option>
                <option value="Bloqueado" ${item.status === "To Do" ? "selected" : ""}>Por Hacer</option>
                <option value="Finalizado" ${item.status === "Done" ? "selected" : ""}>Finalizado</option>
              </select>
            </div>
            <div class="input-wrapper">
              <label for="priority">Prioridad:</label>
              <select class="priority">
                <option value="Alta" ${item.priority === "High" ? "selected" : ""}>Alta</option>
                <option value="Baja" ${item.priority === "Low" ? "selected" : ""}>Baja</option>
                <option value="Media" ${item.priority === "Medium" ? "selected" : ""}>Media</option>
              </select>
            </div>
            <div class="input-wrapper">
              <label for="comments">Comentarios:</label>
              <input type="text" class="comments" value="${item.comments}">
            </div>
            <div class="input-wrapper">
            <label for="id">ID:</label>
            <input type="text" class="id" value="${item.id}" disabled />
          </div>
            <button class="save-card">Guardar</button>
          </div>
        </div>
      </div>
    `;
    newCard.innerHTML = cardContent;

    // Evento para guardar la tarjeta
    let saveButton = newCard.querySelector(".save-card");
    saveButton.addEventListener("click", async function () {
      // Obtener los valores de los campos del formulario
      let titleInput = newCard.querySelector(".title").value;
      let descriptionInput = newCard.querySelector(".description").value;
      let assignedToInput = newCard.querySelector(".assignedTo").value;
      let startDateInput = newCard.querySelector(".startDate").value;
      let endDateInput = newCard.querySelector(".endDate").value;
      let statusSelect = newCard.querySelector(".status").value;
      let prioritySelect = newCard.querySelector(".priority").value;
      let commentsInput = newCard.querySelector(".comments").value;

      // Obtener el ID de la tarea
      const taskId = newCard.dataset.taskId;

      let cardData = {
        id: taskId, // Agregar el ID de la tarea al objeto cardData
        title: titleInput,
        description: descriptionInput,
        assignedTo: assignedToInput,
        startDate: startDateInput,
        endDate: endDateInput,
        status: statusSelect,
        priority: prioritySelect,
        comments: commentsInput,
      };

      await modifyCard(cardData);
      await recargar();
    });

    //cargo logica boton eliminar
    let eliminarButton = newCard.querySelector(".eliminar-tarjeta");
    eliminarButton.addEventListener("click", async function () {
      await deleteTask(item.id);
      await recargar();
    });

    cardsContainer.appendChild(newCard);


    // boton cerrar modal
    let closeButton = newCard.querySelector(".close");
    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
    });

    let modal = newCard.querySelector(".modal");
    let openTaskButtons = newCard.querySelectorAll(".openTask");
    openTaskButtons.forEach((button) => {
      button.addEventListener("click", function () {
        modal.style.display = "block";
      });
    });
    closeButton = modal.querySelector(".close");
    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
    });
    window.addEventListener("click", function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  });
}

async function deleteTask(taskId) {
  console.log(taskId)
  try {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}




function formatDate(dateString) {

  let [day, month, year] = dateString.split('/');
  if (!day || !month || !year) {

    return '';
  }

  let date = new Date(+year, month - 1, +day);

  let anio = date.getFullYear();
  let mes = String(date.getMonth() + 1).padStart(2, '0');
  let dia = String(date.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}