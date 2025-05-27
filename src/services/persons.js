import axios from 'axios'; // Importa axios para realizar peticiones HTTP

//// Define la URL base para el recurso 'persons' en tu json-server
//// const baseUrl = 'http://localhost:3001/persons';

// La base URL de la API. Como el frontend y el backend se sirven desde el mismo origen
// en producción (gracias a 'express.static'), podemos usar una URL relativa.
const baseUrl = '/api/persons'


// Función para obtener todas las personas del servidor
const getAll = () => {
  // Realiza una petición GET a la URL base
  const request = axios.get(baseUrl);
  const nonExisting = {
    id: "err0r",
    name: 'Error-phone',
    number: "¿¿¿-???-¿?¿?¿?",
  }
  // Devuelve la promesa que resolverá con los datos de la respuesta
  return request.then(response => response.data.concat(nonExisting));
};

// Función para crear una nueva persona en el servidor
const create = newObject => {
  // Realiza una petición POST a la URL base
  // Envía el 'newObject' (la nueva persona) en el cuerpo de la petición
  const request = axios.post(baseUrl, newObject);
  // Devuelve la promesa que resolverá con los datos de la respuesta (incluyendo el ID asignado por el servidor)
  return request.then(response => response.data);
};

// Función para eliminar una persona del servidor
const remove = id => {
  // Realiza una petición DELETE a la URL específica del recurso (baseUrl + id)
  const request = axios.delete(`${baseUrl}/${id}`);
  // Para las peticiones DELETE, a menudo no se necesita la data de la respuesta, solo confirmar que se completó.
  // axios.delete resuelve con el objeto de respuesta, no directamente con 'data' como GET/POST.
  return request.then(response => response.data);
};

// Función para actualizar una persona existente en el servidor
const update = (id, newObject) => {
  // Realiza una petición PUT a la URL específica de la persona (baseUrl + id)
  // Envía el 'newObject' (la versión actualizada de la persona) en el cuerpo de la petición
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  // Devuelve la promesa que resolverá con los datos de la respuesta
  return request.then(response => response.data);
};

// Exporta las funciones para que puedan ser utilizadas en otros módulos
export default {
  getAll,
  create,
  remove,
  update
};
