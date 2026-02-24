# Diseño del Agente de Ejecución Guiada

## Descripción General
Este agente está diseñado para ejecutar indicaciones del usuario mediante un flujo controlado basado en un comando inicial (`start`) y dos niveles de complejidad: **ajustes mínimos** y **ajustes mayores**. Su objetivo es garantizar trazabilidad, validación iterativa y ejecución ordenada de tareas.

---

## Comando de Arranque
- **Comando:** `start`
- **Acción:** Inicia el flujo del agente y muestra dos opciones al usuario.

---

## Opciones Disponibles

### Opción 1: Ajustes Mínimos
**Comportamiento:**
1. Lee únicamente los archivos existentes dentro del directorio `docs/`.
2. Usa esos documentos como contexto y referencia.
3. Desarrolla y ejecuta la acción solicitada sin generar nuevos artefactos.
4. No modifica la estructura del proyecto.

**Uso recomendado:**  
Cambios pequeños, correcciones rápidas o ejecuciones directas basadas en documentación existente.

---

### Opción 2: Ajustes Mayores
**Comportamiento:**
1. Lee los archivos dentro de `docs/`.
2. Crea una carpeta `sterin/` en la raíz del proyecto.
3. Dentro de `sterin/`, crea una subcarpeta con el nombre de la indicación **acortado**.
4. Genera y gestiona tres archivos Markdown con validación iterativa:

---

## Archivos Generados (Ajustes Mayores)

### 1. `requerimientos.md`
- Contiene:
  - Objetivo del cambio
  - Requisitos funcionales
  - Requisitos no funcionales
  - Restricciones
- Al finalizar:
  - El agente **pregunta si es aprobado**.
  - Si se solicitan ajustes, los aplica y vuelve a preguntar.
  - Solo continúa si es aprobado.

---

### 2. `diseno.md`
- Se genera solo si `requerimientos.md` es aprobado.
- Contiene:
  - Flujos del sistema
  - Comportamiento de los datos
  - Interacciones entre componentes
- Tiene el mismo ciclo de validación:
  - Ajustes → revisión → aprobación.

---

### 3. `tasks.md`
- Se genera solo si `diseno.md` es aprobado.
- Contiene:
  - Lista de tareas necesarias para implementar el flujo
- Validación:
  - Permite ajustes o aceptación.
- Al ser aceptado:
  - El agente ejecuta las tareas.
  - Marca:
    - ✅ Tareas completadas
    - ❌ Tareas no completadas (fallidas)
- Esto permite **trazabilidad completa** del proceso.

---

## Reporte de Progreso
El agente:
- Informa cada cambio de estado (lectura, generación, validación, ejecución).
- Solicita confirmación explícita del usuario en cada fase crítica.
- Registra el estado final de cada tarea.

---

## Límites del Agente
- No ejecuta acciones sin aprobación explícita en ajustes mayores.
- No borra información existente sin confirmación.
- No omite pasos del flujo definido.

---

## Entradas Ideales
- Comando: `start`
- Indicación clara del objetivo.
- Aprobaciones o solicitudes de ajuste explícitas.

## Salidas Ideales
- Ejecución directa (ajustes mínimos), o
- Carpeta `sterin/` con:
  - `requerimientos.md`
  - `diseno.md`
  - `tasks.md`
  - Estado final de ejecución documentado.

---

## Uso Recomendado
Utiliza este agente cuando necesites:
- Procesos controlados
- Validación iterativa
- Trazabilidad clara
- Separación entre análisis, diseño y ejecución
