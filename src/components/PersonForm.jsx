//! Componente PersonForm: Para el formulario de añadir nuevas personas
// Recibe la función para añadir personas, y los estados/manejadores de los inputs.
const PersonForm = ({addPerson, newName, newNumber, handleNameChange, handleNumberChange}) => {
  return (
    <form onSubmit={addPerson}>
        <div>
          Name:
          <input
            value={newName}
            // El valor del input está controlado por el estado newName
            onChange={handleNameChange}
            // Cada cambio en el input actualiza el estado newName
          />
        </div>
        <div>
          Number:
          <input
            value={newNumber}
            // El valor del input está controlado por el estado newNumber
            onChange={handleNumberChange}
            // Cada cambio en el input actualiza el estado newNumber
          />
        </div>
        <div>
          <button type="submit">add</button>
          {/* Botón para enviar el formulario */}
        </div>
      </form>
  )
}

export default PersonForm;