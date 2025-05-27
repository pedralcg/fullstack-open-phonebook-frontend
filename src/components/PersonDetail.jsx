//! Componente Person: Para mostrar los detalles de una sola persona
// Recibe un objeto 'person' como prop.
const PersonDetail = ({person, deleteHandler}) => {
  return (
    <p>
      {person.name} {person.number}
      {/* Botón de eliminación. Llama a deleteHandler con el ID y el nombre de la persona */}
      <button onClick={() => deleteHandler(person.id, person.name)}>delete</button>
    </p>
  )
}

export default PersonDetail