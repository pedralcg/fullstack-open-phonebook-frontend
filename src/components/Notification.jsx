// Componente Notification: Muestra un mensaje de notificación/error.
// Recibe un prop 'message' que contiene el texto del mensaje.
// Recibe un prop 'type' que indica si es un mensaje de 'success' o 'error'.
const Notification = ({ message, type }) => {
  // Si el mensaje es nulo o una cadena vacía, no se renderiza nada.
  if (message === null || message === '') {
    return null;
  }

  // Determina la clase CSS a aplicar basada en el 'type' del mensaje.
  // Si 'type' es 'success', usa la clase 'success'.
  // Si 'type' es 'error', usa la clase 'error'.
  // Si no se especifica un tipo o es desconocido, usa una clase por defecto (ej. 'notification').
  const className = type === 'success' ? 'success' : (type === 'error' ? 'error' : 'notification');

  // Se renderiza el mensaje dentro de un div con la clase CSS determinada.
  return (
    <div className={className}>
      {message}
    </div>
  );
};

export default Notification;
