# Plan de Implementación: Vista de Anuncios

## Resumen General

Este plan implementa la vista de anuncios siguiendo la arquitectura Atomic Design de Angular. La implementación se divide en capas: primero los modelos y servicios, luego los átomos, moléculas, organismos, y finalmente la página que orquesta todo. Cada paso incluye pruebas para validar la corrección del código.

## Tareas

- [x] 1. Configurar modelos de datos y generadores de pruebas
  - Crear interfaces TypeScript para todos los modelos de datos
  - Implementar generadores de fast-check para property-based testing
  - Configurar fast-check en el proyecto
  - _Requisitos: 2.1, 4.1, 10.1_

- [ ] 2. Implementar servicio de anuncios
  - [x] 2.1 Crear AnnouncementsService con métodos HTTP
    - Implementar getAnnouncements(), getBroadcastById(), votePoll(), getPollDiscussion()
    - Configurar manejo de errores con RxJS catchError
    - _Requisitos: 2.1, 4.1, 5.1_
  
  - [x] 2.2 Implementar algoritmo de ordenamiento
    - Crear método sortAnnouncements() con lógica de priorización
    - Implementar calculatePriority() para mensajes urgentes y encuestas próximas a vencer
    - _Requisitos: 6.1, 6.2, 6.3_
  
  - [ ]* 2.3 Escribir prueba de propiedad para ordenamiento
    - **Propiedad 6: Ordenamiento de anuncios**
    - **Valida: Requisitos 6.1, 6.2, 6.3**
  
  - [ ]* 2.4 Escribir pruebas unitarias para el servicio
    - Probar peticiones HTTP correctas
    - Probar manejo de errores
    - _Requisitos: 2.1, 4.1, 5.1_

- [ ] 3. Implementar componentes atómicos
  - [x] 3.1 Crear BadgeComponent
    - Implementar componente con @Input() text y variant
    - Aplicar estilos según variante (urgent, info, success)
    - _Requisitos: 2.3_
  
  - [x] 3.2 Crear AvatarComponent
    - Implementar componente con @Input() imageUrl, name, size
    - Manejar imágenes faltantes con placeholder
    - Aplicar lazy loading a imágenes
    - _Requisitos: 2.7, 10.1_
  
  - [x] 3.3 Crear ProgressBarComponent
    - Implementar componente con @Input() percentage, color, height
    - Renderizar barra de progreso con ancho dinámico
    - _Requisitos: 4.7_
  
  - [ ]* 3.4 Escribir pruebas unitarias para átomos
    - Probar renderizado básico de cada átomo
    - Probar variantes y tamaños
    - _Requisitos: 2.3, 2.7, 4.7_

- [ ] 4. Implementar componentes moleculares
  - [x] 4.1 Crear TimestampDisplayComponent
    - Implementar @Input() timestamp
    - Implementar get formattedTime() con lógica Today/Yesterday/Full date
    - Implementar formatTime12Hour() para formato AM/PM
    - _Requisitos: 2.4, 8.1, 8.2, 8.3, 8.4_
  
  - [ ]* 4.2 Escribir prueba de propiedad para formato de timestamp
    - **Propiedad 7: Formato de timestamp con AM/PM**
    - **Valida: Requisitos 8.4**
  
  - [ ]* 4.3 Escribir pruebas unitarias para TimestampDisplayComponent
    - Probar formato "Today" para fecha de hoy
    - Probar formato "Yesterday" para fecha de ayer
    - Probar formato de fecha completa
    - _Requisitos: 8.1, 8.2, 8.3_
  
  - [x] 4.4 Crear AvatarGroupComponent
    - Implementar @Input() users, maxVisible
    - Implementar @Output() groupClick
    - Implementar get visibleUsers() y get remainingCount()
    - Renderizar hasta 4 avatares con indicador +N
    - _Requisitos: 2.7, 10.1, 10.2, 10.4_
  
  - [ ]* 4.5 Escribir prueba de propiedad para límite de avatares
    - **Propiedad 8: Límite de avatares visibles**
    - **Valida: Requisitos 10.1, 10.2**
  
  - [ ]* 4.6 Escribir pruebas unitarias para AvatarGroupComponent
    - Probar con 0 usuarios
    - Probar con exactamente 4 usuarios
    - Probar emisión de evento groupClick
    - _Requisitos: 10.1, 10.2, 10.4_
  
  - [x] 4.7 Crear PollOptionComponent
    - Implementar @Input() option, totalVotes, isSelected
    - Implementar @Output() optionClick
    - Implementar get percentage() con cálculo correcto
    - Renderizar opción con ProgressBarComponent
    - _Requisitos: 4.6, 4.7_
  
  - [ ]* 4.8 Escribir prueba de propiedad para cálculo de porcentajes
    - **Propiedad 9: Cálculo de porcentajes de encuesta**
    - **Valida: Requisitos 4.7**
  
  - [ ]* 4.9 Escribir pruebas unitarias para PollOptionComponent
    - Probar renderizado básico
    - Probar emisión de evento optionClick
    - _Requisitos: 4.6, 4.7_

- [x] 5. Checkpoint - Verificar componentes base
  - Asegurarse de que todas las pruebas pasan
  - Verificar que los componentes se renderizan correctamente
  - Preguntar al usuario si hay dudas o ajustes necesarios

- [ ] 6. Implementar organismos
  - [x] 6.1 Crear AnnouncementsHeaderComponent
    - Implementar @Input() title, showBackButton, showNotificationIcon
    - Implementar @Output() backClick, notificationClick
    - Renderizar encabezado con botones interactivos
    - _Requisitos: 1.2, 1.3, 1.4, 3.2_
  
  - [ ]* 6.2 Escribir pruebas unitarias para AnnouncementsHeaderComponent
    - Probar renderizado de título
    - Probar emisión de eventos
    - _Requisitos: 1.2, 1.3, 1.4_
  
  - [x] 6.3 Crear BroadcastCardComponent
    - Implementar @Input() broadcast
    - Implementar @Output() readMoreClick
    - Componer BadgeComponent, TimestampDisplayComponent, AvatarGroupComponent
    - Aplicar estilos con backgroundColor dinámico
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_
  
  - [ ]* 6.4 Escribir prueba de propiedad para renderizado de broadcast card
    - **Propiedad 1: Renderizado completo de tarjetas de broadcast**
    - **Valida: Requisitos 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8**
  
  - [ ]* 6.5 Escribir pruebas unitarias para BroadcastCardComponent
    - Probar renderizado con datos mínimos
    - Probar emisión de evento readMoreClick
    - _Requisitos: 2.1, 3.1_
  
  - [x] 6.6 Crear PollCardComponent
    - Implementar @Input() poll
    - Implementar @Output() voteClick, viewDiscussionClick
    - Implementar getTimeRemaining() con cálculo de tiempo restante
    - Componer múltiples PollOptionComponent
    - Renderizar ícono, título, pregunta, opciones, total de votos
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_
  
  - [ ]* 6.7 Escribir prueba de propiedad para renderizado de poll card
    - **Propiedad 2: Renderizado completo de tarjetas de encuesta**
    - **Valida: Requisitos 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9**
  
  - [ ]* 6.8 Escribir prueba de propiedad para invariante de votos
    - **Propiedad 3: Invariante de incremento de votos**
    - **Valida: Requisitos 5.3**
  
  - [ ]* 6.9 Escribir prueba de propiedad para actualización de porcentajes
    - **Propiedad 4: Actualización de porcentajes tras votación**
    - **Valida: Requisitos 5.2**
  
  - [ ]* 6.10 Escribir prueba de propiedad para persistencia de voto
    - **Propiedad 5: Persistencia de voto del usuario**
    - **Valida: Requisitos 5.1, 5.4**
  
  - [ ]* 6.11 Escribir pruebas unitarias para PollCardComponent
    - Probar renderizado con datos mínimos
    - Probar cálculo de tiempo restante
    - Probar emisión de eventos
    - _Requisitos: 4.1, 4.4, 5.5_

- [x] 7. Checkpoint - Verificar organismos
  - Asegurarse de que todas las pruebas pasan
  - Verificar que los organismos componen correctamente los componentes inferiores
  - Preguntar al usuario si hay dudas o ajustes necesarios

- [ ] 8. Implementar página de anuncios
  - [x] 8.1 Crear AnnouncementsComponent (página)
    - Implementar ngOnInit() para cargar anuncios
    - Inyectar AnnouncementsService y Router
    - Implementar manejo de estados: loading, error, empty
    - Implementar onReadMore(), onVote(), onViewDiscussion(), onBack(), onNotifications()
    - Usar Observable con async pipe para announcements$
    - _Requisitos: 1.1, 2.1, 3.1, 3.2, 4.1, 5.1, 5.5, 7.1, 7.2, 7.3_
  
  - [x] 8.2 Crear template HTML para AnnouncementsComponent
    - Renderizar AnnouncementsHeaderComponent
    - Usar *ngFor para iterar sobre anuncios
    - Usar *ngIf para renderizar BroadcastCardComponent o PollCardComponent según tipo
    - Implementar estados de carga, vacío y error
    - _Requisitos: 1.2, 1.3, 1.4, 2.1, 4.1, 7.1, 7.2, 7.3_
  
  - [x] 8.3 Crear estilos CSS para AnnouncementsComponent
    - Implementar diseño responsivo con media queries
    - Aplicar espaciado y layout para lista de tarjetas
    - Estilizar estados de carga, vacío y error
    - _Requisitos: 9.1, 9.2, 9.3, 9.4_
  
  - [ ]* 8.4 Escribir pruebas unitarias para AnnouncementsComponent
    - Probar carga de anuncios al inicializar
    - Probar manejo de estado de carga
    - Probar manejo de estado vacío
    - Probar manejo de errores
    - Probar navegación en eventos
    - _Requisitos: 1.1, 3.1, 3.2, 5.5, 7.1, 7.2, 7.3_
  
  - [ ]* 8.5 Escribir pruebas de integración
    - Probar flujo completo: cargar → renderizar → votar → actualizar
    - Probar integración entre componentes
    - _Requisitos: 5.1, 5.2, 5.3_

- [ ] 9. Configurar rutas y navegación
  - [x] 9.1 Agregar ruta /announcements a app.routes.ts
    - Configurar lazy loading para AnnouncementsComponent
    - _Requisitos: 1.1_
  
  - [x] 9.2 Agregar opción "Broadcasts" al tab bar
    - Actualizar componente de navegación para incluir enlace a /announcements
    - Aplicar estilos para indicar ruta activa
    - _Requisitos: 1.1_
  
  - [ ]* 9.3 Escribir prueba de navegación
    - Probar que al hacer clic en "Broadcasts" se navega a /announcements
    - _Requisitos: 1.1_

- [ ] 10. Implementar accesibilidad y ARIA
  - [x] 10.1 Agregar ARIA labels a componentes interactivos
    - Agregar aria-label a botones de encabezado
    - Agregar role="article" a tarjetas
    - Agregar aria-label a insignia urgente
    - Agregar role="radiogroup" y aria-labelledby a opciones de encuesta
    - _Requisitos: 2.3, 4.6, 5.1_
  
  - [x] 10.2 Implementar navegación por teclado
    - Asegurar que todos los elementos interactivos son navegables con Tab
    - Implementar activación con Enter/Space en botones
    - Implementar selección con flechas en opciones de encuesta
    - _Requisitos: 5.1_
  
  - [ ]* 10.3 Probar accesibilidad con herramientas automatizadas
    - Ejecutar axe DevTools o WAVE
    - Verificar ratios de contraste
    - Corregir problemas encontrados

- [x] 11. Checkpoint final - Verificar funcionalidad completa
  - Asegurarse de que todas las pruebas pasan
  - Verificar que la navegación funciona correctamente
  - Probar flujo completo de usuario: navegar → ver anuncios → votar → ver discusión
  - Verificar estados de carga, vacío y error
  - Verificar accesibilidad y navegación por teclado
  - Preguntar al usuario si hay ajustes finales necesarios

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia los requisitos específicos que implementa para trazabilidad
- Los checkpoints aseguran validación incremental y oportunidad para feedback
- Las pruebas de propiedades validan corrección universal con 100+ iteraciones
- Las pruebas unitarias validan ejemplos específicos y casos borde
- El orden de implementación sigue la jerarquía de Atomic Design: modelos → átomos → moléculas → organismos → página
