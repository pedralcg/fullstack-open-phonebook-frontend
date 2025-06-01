import { useState, useEffect } from 'react'
// Importa el nuevo módulo de servicio para personas
import personService from './services/persons'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

import './index.css'


//! Componente principal de la aplicación

const App = () => {
  // Estado para controlar la lista de personas
  const [persons, setPersons] = useState([]);

    // Estado para controlar el valor del campo de entrada del nuevo nombre
  const [newName, setNewName] = useState('')

  // Estado para controlar el valor del campo de entrada del nuevo número
  const [newNumber, setNewNumber] = useState('')

  // Nuevo estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  //? Estado para el mensaje de notificación y su tipo (success/error)
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  //* Hook useEffect para obtener los datos iniciales del servidor
  useEffect(() => {
    console.log('effect');
    // Usa personService.getAll() en lugar de axios.get()
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled');
        setPersons(initialPersons);
      })
      // Añadimos el bloque catch para los errores
      .catch(error => {
        console.error('Error fetching initial persons:', error);
        //* Usar notificación de error para la carga inicial
        setNotificationMessage('Failed to load phonebook data. Please check the server connection.');
        setNotificationType('error');
        setTimeout(() => {
          setNotificationMessage(null);
          setNotificationType(null);
        }, 5000);
      });
  }, [])
  console.log('render', persons.length, 'persons');


  //! Función manejadora para el evento 'submit' del formulario (Añadir o Actualizar persona)
  const addPerson = (event) => {
    // Previene el comportamiento por defecto de enviar el formulario (recargar la página)
    event.preventDefault(); 

    // Busca si ya existe una persona con el mismo nombre (insensible a mayúsculas/minúsculas)
    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());

    // Si la persona ya existe
    if (existingPerson) {
      // Pide confirmación al usuario para actualizar el número
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        // Crea un nuevo objeto con los datos actualizados (manteniendo el ID original)
        const updatedPerson = { ...existingPerson, number: newNumber };

        // Llama al servicio para actualizar la persona en el backend (HTTP PUT)
        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            // Actualiza el estado local: reemplaza la persona antigua con la versión actualizada
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : returnedPerson
              ));
            setNewName('');
            setNewNumber('');
            //* Mensaje de éxito para la actualización
            setNotificationMessage(`Updated ${returnedPerson.name}'s number.`);
            setNotificationType('success');
            setTimeout(() => {
              setNotificationMessage(null)
              setNotificationType(null);
            }, 5000)
          })
          .catch(error => {
            console.error(`Error updating ${newName}:`, error);
            if (error.response && error.response.status === 404) {
              //* Mensaje de error para 404 en actualización (persona ya eliminada)
              setNotificationMessage(`Information of ${newName} has already been removed from server.`);
              setNotificationType('error');
              setPersons(persons.filter(person => person.id !== existingPerson.id)); // Eliminar de la UI
            } else if (error.response && error.response.data && error.response.data.error) {
              //* Mensaje de error de validación u otro error del backend (ej. 400 Bad Request)
              setNotificationMessage(error.response.data.error);
              setNotificationType('error');
            } else {
            //* Mensaje de error genérico si no se puede extraer uno específico
              setNotificationMessage(`Failed to update ${newName}'s number. Please check the server.`);
              setNotificationType('error');
            }
              setTimeout(() => {
              setNotificationMessage(null);
              setNotificationType(null);
            }, 5000);
          });
      }
    } else {
      // Si la persona NO existe, procede a añadirla como una nueva entrada
      const personObject = {
        name: newName,
        number: newNumber,
      };

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          //* Mensaje de éxito para la creación
          setNotificationMessage(`Added ${returnedPerson.name} to phonebook.`);
          setNotificationType('success');
          setTimeout(() => {
            setNotificationMessage(null);
            setNotificationType(null);
          }, 5000);
        })
        .catch(error => {
          console.error('Error adding person to backend:', error);
          //* ¡Aquí es donde se extrae el mensaje de error de validación para la creación!
          if (error.response && error.response.data && error.response.data.error) {
            setNotificationMessage(error.response.data.error);
            setNotificationType('error');
          } else {
            setNotificationMessage('Failed to add person to phonebook. Please check the server.');
            setNotificationType('error');
          }
          setTimeout(() => {
            setNotificationMessage(null);
            setNotificationType(null);
          }, 5000);
        });
    }

    // Limpia los campos de entrada al final, independientemente del resultado
    setNewName('');
    setNewNumber('');
  };

  //* Función para manejar la eliminación de una persona
  const handleDelete = (id, name) => {
    // Pide confirmación al usuario antes de eliminar
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id) // Llama a la función 'remove' del servicio con el ID de la persona
        .then(() => {
          // Si la eliminación en el backend es exitosa, actualiza el estado local
          // Filtra la lista de personas para excluir la persona eliminada
          setPersons(persons.filter(person => person.id !== id));
          //* Mensaje de éxito para la eliminación
          setNotificationMessage(`Deleted ${name} from phonebook.`);
          setNotificationType('success');
          setTimeout(() => {
            setNotificationMessage(null);
            setNotificationType(null);
          }, 5000);
        })
        .catch(error => {
          console.error(`Error deleting ${name}:`, error);
          //* Mensaje de error para la eliminación
          // Aquí también podemos intentar extraer el error específico del backend
          if (error.response && error.response.data && error.response.data.error) {
            setNotificationMessage(error.response.data.error);
            setNotificationType('error');
            // Si el error es 404, la persona ya no existe, así que la eliminamos de la UI
            if (error.response.status === 404) {
              setPersons(persons.filter(person => person.id !== id));
            }
          } else {
            setNotificationMessage(`Failed to delete ${name}. Please check the server.`);
            setNotificationType('error');
          }
          setTimeout(() => {
            setNotificationMessage(null);
            setNotificationType(null);
          }, 5000);
        });
    }
  };

  // Función manejadora para el evento 'change' del campo de entrada del nombre
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  // Función manejadora para el evento 'change' del campo de entrada del número
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  // Función manejadora para el evento 'search' del campo de entrada de la busqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Función lógica de filtrado de personas
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} type={notificationType} />
      {/* Renderiza el componente Filter y le pasa las props necesarias */}
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <h2>Add a new</h2>

      {/* Renderiza el componente PersonForm y le pasa las props necesarias */}
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      
      {/*//! Elemento de depuración */}
      {/* <div>debug name: {newName}</div> */}
      {/* <div>debug number: {newNumber}</div> */}
      {/* <div>debug search: {searchTerm}</div> */}

      <h2>Numbers</h2>
      
      {/* Renderiza el componente Persons y le pasa la lista filtrada */}
      {/* Pasa la nueva función handleDelete al componente Persons */}
      <Persons filteredPersons={filteredPersons} deleteHandler={handleDelete} />
    </div>
  )
}

export default App