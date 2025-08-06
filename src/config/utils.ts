export const formatDate = (dateString?:string) => {
  // Crea un objeto Date a partir del string
  if(dateString == undefined) return
  
  const date = new Date(dateString);

  // Obtiene los componentes de la fecha y hora
  const year = date.getFullYear().toString().slice(-2); // Obtiene los últimos 2 dígitos del año
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0-11, se le suma 1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Construye el formato deseado
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
