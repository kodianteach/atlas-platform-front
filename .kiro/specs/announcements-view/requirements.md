# Documento de Requisitos

## Introducción

La vista de Anuncios (Announcements) es una funcionalidad que permite a los usuarios visualizar mensajes de difusión (broadcasts) y encuestas (polls) de la comunidad. Esta vista debe ser accesible desde la barra de navegación inferior (tab bar) y presentar dos tipos de contenido: anuncios urgentes con información importante y encuestas interactivas donde los usuarios pueden votar y ver resultados.

## Glosario

- **Sistema**: La aplicación Atlas Platform
- **Vista_Anuncios**: El componente de página que muestra anuncios y encuestas
- **Mensaje_Difusión**: Un anuncio o comunicado importante para la comunidad
- **Encuesta**: Una pregunta con opciones de respuesta donde los usuarios pueden votar
- **Tab_Bar**: La barra de navegación inferior de la aplicación
- **Tarjeta_Anuncio**: El componente visual que muestra un mensaje de difusión
- **Tarjeta_Encuesta**: El componente visual que muestra una encuesta
- **Usuario**: Persona que utiliza la aplicación

## Requisitos

### Requisito 1: Navegación a la Vista de Anuncios

**Historia de Usuario:** Como usuario, quiero acceder a la vista de anuncios desde la barra de navegación, para poder ver los mensajes importantes y encuestas de la comunidad.

#### Criterios de Aceptación

1. CUANDO un usuario presiona la opción "Broadcasts" en el Tab_Bar, ENTONCES el Sistema DEBERÁ navegar a la Vista_Anuncios
2. CUANDO la Vista_Anuncios se carga, ENTONCES el Sistema DEBERÁ mostrar un encabezado con el título "Announcements"
3. CUANDO la Vista_Anuncios se muestra, ENTONCES el Sistema DEBERÁ incluir un botón de retroceso en el encabezado
4. CUANDO la Vista_Anuncios se muestra, ENTONCES el Sistema DEBERÁ incluir un ícono de notificaciones en el encabezado

### Requisito 2: Visualización de Mensajes de Difusión

**Historia de Usuario:** Como usuario, quiero ver mensajes de difusión en formato de tarjeta, para poder identificar rápidamente anuncios importantes de la comunidad.

#### Criterios de Aceptación

1. CUANDO la Vista_Anuncios contiene mensajes de difusión, ENTONCES el Sistema DEBERÁ mostrar cada mensaje en una Tarjeta_Anuncio
2. CUANDO se muestra una Tarjeta_Anuncio, ENTONCES el Sistema DEBERÁ incluir un fondo de color distintivo
3. CUANDO un mensaje de difusión es urgente, ENTONCES el Sistema DEBERÁ mostrar una insignia "Urgent" en la Tarjeta_Anuncio
4. CUANDO se muestra una Tarjeta_Anuncio, ENTONCES el Sistema DEBERÁ incluir la marca de tiempo del mensaje
5. CUANDO se muestra una Tarjeta_Anuncio, ENTONCES el Sistema DEBERÁ incluir el título del mensaje
6. CUANDO se muestra una Tarjeta_Anuncio, ENTONCES el Sistema DEBERÁ incluir un texto de vista previa de la descripción
7. CUANDO se muestra una Tarjeta_Anuncio, ENTONCES el Sistema DEBERÁ incluir avatares de usuarios relacionados con indicador de cantidad adicional
8. CUANDO se muestra una Tarjeta_Anuncio, ENTONCES el Sistema DEBERÁ incluir un botón "Read More"

### Requisito 3: Interacción con Mensajes de Difusión

**Historia de Usuario:** Como usuario, quiero poder leer el contenido completo de un mensaje de difusión, para obtener toda la información del anuncio.

#### Criterios de Aceptación

1. CUANDO un usuario presiona el botón "Read More" en una Tarjeta_Anuncio, ENTONCES el Sistema DEBERÁ mostrar el contenido completo del mensaje
2. CUANDO un usuario presiona el botón de retroceso en el encabezado, ENTONCES el Sistema DEBERÁ navegar a la vista anterior

### Requisito 4: Visualización de Encuestas

**Historia de Usuario:** Como usuario, quiero ver encuestas de la comunidad en formato de tarjeta, para poder participar en decisiones comunitarias.

#### Criterios de Aceptación

1. CUANDO la Vista_Anuncios contiene encuestas, ENTONCES el Sistema DEBERÁ mostrar cada encuesta en una Tarjeta_Encuesta
2. CUANDO se muestra una Tarjeta_Encuesta, ENTONCES el Sistema DEBERÁ incluir un ícono indicador del tema
3. CUANDO se muestra una Tarjeta_Encuesta, ENTONCES el Sistema DEBERÁ incluir el título de la encuesta
4. CUANDO se muestra una Tarjeta_Encuesta, ENTONCES el Sistema DEBERÁ incluir el tiempo restante para votar
5. CUANDO se muestra una Tarjeta_Encuesta, ENTONCES el Sistema DEBERÁ incluir la pregunta de la encuesta
6. CUANDO se muestra una Tarjeta_Encuesta, ENTONCES el Sistema DEBERÁ mostrar todas las opciones de respuesta disponibles
7. CUANDO se muestra una Tarjeta_Encuesta, ENTONCES el Sistema DEBERÁ mostrar barras de progreso con porcentajes para cada opción
8. CUANDO se muestra una Tarjeta_Encuesta, ENTONCES el Sistema DEBERÁ mostrar el número total de votos
9. CUANDO se muestra una Tarjeta_Encuesta, ENTONCES el Sistema DEBERÁ incluir un enlace "View Discussion"

### Requisito 5: Interacción con Encuestas

**Historia de Usuario:** Como usuario, quiero votar en encuestas y ver los resultados, para participar en las decisiones de la comunidad.

#### Criterios de Aceptación

1. CUANDO un usuario selecciona una opción en una Tarjeta_Encuesta, ENTONCES el Sistema DEBERÁ registrar el voto del usuario
2. CUANDO un usuario vota en una encuesta, ENTONCES el Sistema DEBERÁ actualizar los porcentajes de todas las opciones
3. CUANDO un usuario vota en una encuesta, ENTONCES el Sistema DEBERÁ incrementar el contador total de votos
4. CUANDO un usuario ya ha votado en una encuesta, ENTONCES el Sistema DEBERÁ mostrar visualmente la opción seleccionada
5. CUANDO un usuario presiona "View Discussion", ENTONCES el Sistema DEBERÁ navegar a la vista de discusión de la encuesta

### Requisito 6: Ordenamiento y Priorización de Contenido

**Historia de Usuario:** Como usuario, quiero ver primero los anuncios más importantes y recientes, para estar al tanto de información crítica.

#### Criterios de Aceptación

1. CUANDO la Vista_Anuncios muestra múltiples elementos, ENTONCES el Sistema DEBERÁ ordenar los mensajes urgentes antes que los no urgentes
2. CUANDO hay múltiples mensajes con la misma prioridad, ENTONCES el Sistema DEBERÁ ordenarlos por marca de tiempo descendente
3. CUANDO hay encuestas próximas a vencer, ENTONCES el Sistema DEBERÁ mostrarlas con mayor prioridad

### Requisito 7: Estados de Carga y Vacío

**Historia de Usuario:** Como usuario, quiero recibir retroalimentación visual mientras se cargan los anuncios, para saber que el sistema está funcionando.

#### Criterios de Aceptación

1. CUANDO la Vista_Anuncios está cargando datos, ENTONCES el Sistema DEBERÁ mostrar un indicador de carga
2. CUANDO no hay anuncios ni encuestas disponibles, ENTONCES el Sistema DEBERÁ mostrar un estado vacío con mensaje informativo
3. CUANDO ocurre un error al cargar los datos, ENTONCES el Sistema DEBERÁ mostrar un mensaje de error descriptivo

### Requisito 8: Formato de Marcas de Tiempo

**Historia de Usuario:** Como usuario, quiero ver cuándo se publicaron los anuncios en un formato fácil de entender, para evaluar la relevancia de la información.

#### Criterios de Aceptación

1. CUANDO un mensaje fue publicado hoy, ENTONCES el Sistema DEBERÁ mostrar "Today" seguido de la hora
2. CUANDO un mensaje fue publicado ayer, ENTONCES el Sistema DEBERÁ mostrar "Yesterday" seguido de la hora
3. CUANDO un mensaje fue publicado hace más de un día, ENTONCES el Sistema DEBERÁ mostrar la fecha completa
4. CUANDO se muestra una marca de tiempo, ENTONCES el Sistema DEBERÁ usar formato de 12 horas con AM/PM

### Requisito 9: Diseño Responsivo

**Historia de Usuario:** Como usuario, quiero que la vista de anuncios se adapte a diferentes tamaños de pantalla, para tener una experiencia consistente en cualquier dispositivo.

#### Criterios de Aceptación

1. CUANDO la Vista_Anuncios se muestra en dispositivos móviles, ENTONCES el Sistema DEBERÁ ajustar el diseño para pantallas pequeñas
2. CUANDO la Vista_Anuncios se muestra en tablets, ENTONCES el Sistema DEBERÁ optimizar el uso del espacio disponible
3. CUANDO el tamaño de la pantalla cambia, ENTONCES el Sistema DEBERÁ reorganizar los elementos sin perder funcionalidad
4. CUANDO se muestran las tarjetas, ENTONCES el Sistema DEBERÁ mantener la legibilidad del texto en todos los tamaños de pantalla

### Requisito 10: Visualización de Grupos de Usuarios

**Historia de Usuario:** Como usuario, quiero ver qué otros usuarios están relacionados con un anuncio, para entender el alcance y contexto del mensaje.

#### Criterios de Aceptación

1. CUANDO una Tarjeta_Anuncio muestra avatares de usuarios, ENTONCES el Sistema DEBERÁ mostrar hasta 4 avatares visibles
2. CUANDO hay más de 4 usuarios relacionados, ENTONCES el Sistema DEBERÁ mostrar un indicador "+N" con el número de usuarios adicionales
3. CUANDO se muestran avatares, ENTONCES el Sistema DEBERÁ posicionarlos con superposición parcial
4. CUANDO un usuario presiona sobre el grupo de avatares, ENTONCES el Sistema DEBERÁ mostrar la lista completa de usuarios relacionados
