document.querySelector('input[name="search"]').addEventListener('input', function() {
    const searchQuery = this.value;
  
    if (searchQuery.length > 0) {
      fetch(`/sugerencias?search=${searchQuery}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
          }
          return response.json();
        })
        .then(data => {
          const suggestionsContainer = document.getElementById('suggestions-list');
          suggestionsContainer.innerHTML = ''; // Limpiar la lista anterior
  
          if (data.length > 0) {
            data.forEach(suggestion => {
              const suggestionItem = document.createElement('li');
              suggestionItem.textContent = `${suggestion.marca} ${suggestion.modelo}`;
              suggestionItem.classList.add('suggestion-item'); // Agrega una clase para cada ítem
              suggestionsContainer.appendChild(suggestionItem);
  
              // Añadir comportamiento al hacer clic en una sugerencia
              suggestionItem.addEventListener('click', function() {
                document.getElementById('search-input').value = suggestion.marca + ' ' + suggestion.modelo;
                document.getElementById('search-form').submit(); // Enviar el formulario
              });
            });
          } else {
            suggestionsContainer.innerHTML = '<li>No se encontraron coincidencias</li>';
          }
        })
        .catch(error => {
          console.error('Error al obtener las sugerencias:', error);
        });
    } else {
      document.getElementById('suggestions-list').innerHTML = ''; // Limpiar la lista si no hay texto
    }
  });
  
