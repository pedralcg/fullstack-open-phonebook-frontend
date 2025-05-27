//! Componente Filter: Para el campo de búsqueda
// Recibe el término de búsqueda y el manejador de cambios como props.
const Filter = ({searchTerm, handleSearchChange}) => {
  return (
    <div>
      Filter shown with:
      <input
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  )
};

export default Filter;