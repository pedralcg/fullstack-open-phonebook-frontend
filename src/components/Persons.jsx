import PersonDetail from "./PersonDetail";


//! Componente Persons: Para mostrar la lista de personas filtradas
// Recibe el array de personas filtradas como prop.
const Persons = ({ filteredPersons, deleteHandler }) => {
  return (
    <div>
      {filteredPersons.map(person => (
        // Pasa deleteHandler a cada componente Person
        <PersonDetail key={person.id} person={person} deleteHandler={deleteHandler} />
      ))}
    </div>
  );
};

export default Persons